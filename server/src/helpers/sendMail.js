const { config } = require("../config/config");
const nodemailer = require('nodemailer');
const { apiError } = require("../utils");

const sendMail = async (email, name, otp, otpExpiry, next, req) => {
  if (!email || !name || !otp || !otpExpiry) {
    const error = new Error('Missing required parameters for OTP email');
    return apiError(next, error, req, 500);
  }
  try {


    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.EMAILUSER,
        pass: config.EMAILPASS,
      },
    });

    const formattedExpiry = new Date(otpExpiry).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const mailOptions = {
      from: config.EMAILUSER,
      to: email,
      subject: 'Your OTP Verification Code',
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your OTP Code</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
      color: #333;
    }
    .container {
      max-width: 550px;
      width: 100%;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      margin: 20px auto;
    }
    .header {
      background-color: black;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      color: white;
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .header p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 16px;
    }
    .content {
      padding: 30px;
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
    }
    .otp-container {
      margin: 30px 0;
      text-align: center;
    }
    .otp-box {
      background-color: #f5f7fb;
      border-radius: 8px;
      padding: 20px;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    .otp-code {
      font-size: 36px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #4F46E5;
    }
    .expiry-container {
      margin-top: 25px;
      text-align: center;
    }
    .expiry-label {
      font-size: 14px;
      color: #6B7280;
      margin-bottom: 8px;
    }
    .expiry {
      font-size: 18px;
      font-weight: 600;
      color: #FF4D4F;
    }
    .message {
      margin: 25px 0;
      font-size: 16px;
      line-height: 1.6;
      color: #4B5563;
    }
    .warning {
      background-color: #FFF5F5;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #FF4D4F;
      margin: 20px 0;
      font-size: 14px;
      color: #9C4146;
    }
    .footer {
      text-align: center;
      padding: 20px 30px;
      background-color: #F9FAFB;
      border-top: 1px solid #E5E7EB;
    }
    .company-name {
      font-weight: 600;
      color: #4F46E5;
    }
    .footer-text {
      font-size: 13px;
      color: #6B7280;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Verification Code</h1>
      <p>Please use the code below to complete your sign in</p>
    </div>
    
    <div class="content">
      <p class="greeting">Hello ${name},</p>
      
      <p class="message">
        We received a request to sign in to your <span class="company-name">NeuroHire</span> account. 
        Please use the following verification code to complete the process:
      </p>
      
      <div class="otp-container">
        <div class="otp-box">
          <div class="otp-code">${otp}</div>
        </div>
      </div>
      
      <div class="expiry-container">
        <div class="expiry-label">This code will expire at:</div>
        <div class="expiry">${formattedExpiry}</div>
      </div>
      
      <p class="message">
        If you didn't request this code, you can safely ignore this email. Someone might have 
        entered your email address by mistake.
      </p>
      
      <div class="warning">
        For security reasons, please do not share this code with anyone. Our team will never ask you for this code.
      </div>
    </div>
    
    <div class="footer">
      <div class="company-name">NeuroHire</div>
      <p class="footer-text">This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email Error:', error);
    const errorMessage = new Error('Failed to send OTP email');
    return apiError(next, errorMessage, req, 500);
  }
};

module.exports = sendMail;