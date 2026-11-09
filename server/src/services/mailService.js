const nodemailer = require('nodemailer');
const { config } = require('../config/config');
const logger = require('../utils/logger');

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_PORT === 465,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      },
    });
  }
  return transporter;
};

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const client = getTransporter();
    const info = await client.sendMail({
      from: config.SMTP_FROM,
      to,
      subject,
      text,
      html,
    });
    logger.info('Email sent successfully', { messageId: info.messageId, to });
    return info;
  } catch (error) {
    logger.error('Failed to send email', { error: error.message, to });
    throw error;
  }
};

const sendSubscriptionExpiryWarning = async (user, daysLeft) => {
  const subject = `Your ${config.ENV === 'production' ? '' : '[Test] '}NeuroHire plan is expiring soon`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2>Hi ${user.name || 'there'},</h2>
      <p>Your premium subscription on <strong>NeuroHire</strong> is set to expire in <strong>${daysLeft} day${daysLeft === 1 ? '' : 's'}</strong>.</p>
      <p>Renew now to ensure uninterrupted access to your AI mock interviews, resume exports, and advanced feedback.</p>
      <div style="margin-top: 30px;">
        <a href="${config.FRONTEND_URL}/dashboard/billing" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; rounded: 6px; font-weight: bold;">Renew Subscription</a>
      </div>
      <p style="margin-top: 30px; font-size: 12px; color: #666;">If you have already renewed or set up auto-renew, you can ignore this email.</p>
    </div>
  `;
  
  return sendEmail({
    to: user.email,
    subject,
    html,
    text: `Your NeuroHire plan is expiring in ${daysLeft} days. Renew at ${config.FRONTEND_URL}/dashboard/billing`,
  });
};

module.exports = {
  sendEmail,
  sendSubscriptionExpiryWarning,
};
