const crypto = require("crypto");
const { NewsletterSubscriber } = require("../../models");
const { sendMail, hasSmtpConfig } = require("../../utils/mailer");
const ApiError = require("../../utils/ApiError");
const { getWelcomeEmail } = require("./templates/welcome");

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

module.exports = {
  subscribeEmail,
};
