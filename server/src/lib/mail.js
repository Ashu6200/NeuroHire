const nodemailer = require('nodemailer');
const { config } = require('../config/config');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: config.SMTP_PORT == 465,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS,
  },
});

const sendMail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: config.SMTP_FROM,
      to,
      subject,
      html,
    });
    logger.info('[mail] Email sent', { messageId: info.messageId, to });
    return info;
  } catch (error) {
    logger.error('[mail] Email send failed', {
      to,
      subject,
      error: error.message,
    });
    throw new Error('Failed to send email. Please try again later.');
  }
};

/**
 * Send email verification link.
 */
const sendVerificationEmail = async ({ name, email, url }) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
      <h2 style="color: #333;">Welcome to NeuroHire!</h2>
      <p>Hi ${name},</p>
      <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
      </div>
      <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
      <p style="word-break: break-all; color: #007bff;">${url}</p>
      <p>This link will expire in 1 hour.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #777;">If you did not create an account, no further action is required.</p>
    </div>
  `;
  return sendMail({
    to: email,
    subject: 'Verify your email - NeuroHire',
    html,
  });
};

/**
 * Send password reset link.
 */
const sendPasswordResetEmail = async ({ name, email, url }) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
      <h2 style="color: #333;">Reset Your Password</h2>
      <p>Hi ${name},</p>
      <p>You are receiving this email because we received a password reset request for your account.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
      </div>
      <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
      <p style="word-break: break-all; color: #007bff;">${url}</p>
      <p>This link will expire in 1 hour.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #777;">If you did not request a password reset, no further action is required.</p>
    </div>
  `;
  return sendMail({
    to: email,
    subject: 'Reset your password - NeuroHire',
    html,
  });
};

/**
 * Send password reset success confirmation.
 */
const sendPasswordResetSuccessEmail = async ({ name, email }) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
      <h2 style="color: #333; color: #28a745;">Password Reset Successful</h2>
      <p>Hi ${name},</p>
      <p>Your password has been successfully reset. You can now log in with your new password.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${config.FRONTEND_URL}/sign-in" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Login</a>
      </div>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #777;">If you did not perform this action, please contact support immediately.</p>
    </div>
  `;
  return sendMail({
    to: email,
    subject: 'Password reset successful - NeuroHire',
    html,
  });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
};
