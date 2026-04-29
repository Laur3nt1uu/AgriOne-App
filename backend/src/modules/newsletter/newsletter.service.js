const crypto = require("crypto");
const { NewsletterSubscriber } = require("../../models");
const { sendMail, hasSmtpConfig } = require("../../utils/mailer");
const ApiError = require("../../utils/ApiError");
const { getWelcomeEmail } = require("./templates/welcome");
const { getCampaignEmail, getAvailableCampaigns } = require("./templates/campaigns");

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function generateUnsubscribeToken() {
  return crypto.randomBytes(32).toString("hex");
}

async function subscribeEmail(email, language = "ro", source = "blog_page") {
  const normalizedEmail = normalizeEmail(email);

  // Check if already subscribed
  let subscriber = await NewsletterSubscriber.findOne({
    where: { email: normalizedEmail },
  });

  // If already exists and subscribed, return success silently
  if (subscriber) {
    if (subscriber.status === "subscribed") {
      return { success: true, alreadySubscribed: true };
    }

    // If was unsubscribed, re-subscribe
    if (subscriber.status === "unsubscribed") {
      subscriber.status = "subscribed";
      subscriber.language = language;
      subscriber.subscriptionSource = source;
      subscriber.unsubscribeToken = generateUnsubscribeToken();
      await subscriber.save();
    }
  } else {
    // Create new subscriber
    subscriber = await NewsletterSubscriber.create({
      email: normalizedEmail,
      status: "subscribed",
      language,
      subscriptionSource: source,
      unsubscribeToken: generateUnsubscribeToken(),
    });
  }

  // Send welcome email
  if (hasSmtpConfig()) {
    try {
      const { subject, html, text } = getWelcomeEmail(language, subscriber.unsubscribeToken);
      await sendMail({
        to: normalizedEmail,
        subject,
        html,
        text,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail the subscription if email fails
    }
  }

  return { success: true, alreadySubscribed: false };
}

async function getSubscriberStats() {
  const total = await NewsletterSubscriber.count();
  const subscribed = await NewsletterSubscriber.count({ where: { status: "subscribed" } });
  const unsubscribed = await NewsletterSubscriber.count({ where: { status: "unsubscribed" } });
  return { total, subscribed, unsubscribed };
}

async function unsubscribeByToken(token) {
  const rawToken = String(token || "").trim();
  if (!rawToken || rawToken.length > 128) {
    throw new ApiError(400, "Invalid unsubscribe token.", null, "NEWSLETTER_INVALID_TOKEN");
  }

  const subscriber = await NewsletterSubscriber.findOne({
    where: { unsubscribeToken: rawToken },
  });

  if (!subscriber) {
    throw new ApiError(404, "Subscriber not found.", null, "NEWSLETTER_SUBSCRIBER_NOT_FOUND");
  }

  if (subscriber.status !== "unsubscribed") {
    subscriber.status = "unsubscribed";
    await subscriber.save();
  }

  return { unsubscribed: true };
}

function getCampaigns(language = "ro") {
  return getAvailableCampaigns(language);
}

async function sendCampaign(campaignKey) {
  if (!hasSmtpConfig()) {
    throw new ApiError(503, "SMTP is not configured.", null, "SMTP_NOT_CONFIGURED");
  }

  const subscribers = await NewsletterSubscriber.findAll({
    where: { status: "subscribed" },
  });

  if (subscribers.length === 0) {
    return { sent: 0, failed: 0, total: 0 };
  }

  let sent = 0;
  let failed = 0;

  for (const subscriber of subscribers) {
    try {
      const { subject, html, text } = getCampaignEmail(
        campaignKey,
        subscriber.language || "ro",
        subscriber.unsubscribeToken
      );
      await sendMail({ to: subscriber.email, subject, html, text });
      sent++;
    } catch (err) {
      console.error(`Failed to send campaign to ${subscriber.email}:`, err.message);
      failed++;
    }
  }

  return { sent, failed, total: subscribers.length };
}

module.exports = {
  subscribeEmail,
  unsubscribeByToken,
  sendCampaign,
  getCampaigns,
  getSubscriberStats,
};
