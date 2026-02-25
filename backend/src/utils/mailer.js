const nodemailer = require("nodemailer");
const env = require("../config/env");

let transporter = null;

function hasSmtpConfig() {
  return !!(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);
}

function getTransporter() {
  if (transporter) return transporter;
  if (!hasSmtpConfig()) return null;

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  return transporter;
}

async function sendMail({ to, subject, text, html }) {
  const t = getTransporter();
  if (!t) {
    const err = new Error("SMTP not configured");
    err.code = "SMTP_NOT_CONFIGURED";
    throw err;
  }

  return t.sendMail({
    from: env.SMTP_FROM,
    to,
    subject,
    text,
    html,
  });
}

module.exports = { sendMail, hasSmtpConfig };
