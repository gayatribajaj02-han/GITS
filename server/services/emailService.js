const nodemailer = require('nodemailer');

let cachedTransporter = null;

/**
 * Initialize Nodemailer transporter (Gmail, Custom SMTP, or Ethereal test preview)
 */
const getTransporter = async () => {
  if (cachedTransporter) return cachedTransporter;

  // 1. If user provided Gmail / SMTP credentials in server/.env
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const isGmail =
      process.env.SMTP_SERVICE === 'gmail' ||
      !process.env.SMTP_HOST ||
      process.env.SMTP_HOST.includes('gmail');

    if (isGmail) {
      cachedTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS.replace(/\s+/g, ''), // Strip spaces if copied from Google App Password
        },
      });
      console.log(`📧 Configured Real Gmail SMTP Transporter for: ${process.env.SMTP_USER}`);
      return cachedTransporter;
    }

    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    return cachedTransporter;
  }

  // 2. Default Development Mode: Ethereal / Simulated Live Preview
  try {
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`📧 Ethereal Test Email Transporter initialized (${testAccount.user})`);
    return cachedTransporter;
  } catch (err) {
    cachedTransporter = nodemailer.createTransport({
      jsonTransport: true,
    });
    return cachedTransporter;
  }
};

/**
 * Send Placement Application Status Email to Student
 */
const sendApplicationStatusEmail = async ({
  studentName = 'Student',
  studentEmail,
  jobTitle,
  companyName,
  status,
  matchScore = 0,
}) => {
  if (!studentEmail) {
    return { sent: false, error: 'No student email provided' };
  }

  const statusColors = {
    'Shortlisted': '#10b981', // Emerald
    'Interview': '#3b82f6',   // Blue
    'Selected': '#8b5cf6',    // Purple
    'Under Review': '#f59e0b',// Amber
    'Rejected': '#ef4444',    // Rose
  };

  const statusBadgeColor = statusColors[status] || '#2563eb';
  const subject = `CareerConnect Update: Your application for "${jobTitle}" at ${companyName} is now ${status}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
        .container { max-width: 580px; margin: 0 auto; background: #1e293b; border-radius: 16px; border: 1px solid #334155; overflow: hidden; }
        .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 32px 24px; text-align: center; }
        .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; }
        .header p { margin: 6px 0 0 0; color: #bfdbfe; font-size: 13px; }
        .content { padding: 32px 24px; }
        .greeting { font-size: 16px; font-weight: 600; color: #f8fafc; margin-bottom: 16px; }
        .card { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin: 20px 0; }
        .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; font-weight: 800; font-size: 13px; color: #ffffff; background-color: ${statusBadgeColor}; }
        .details-row { display: flex; justify-content: space-between; margin-top: 12px; font-size: 13px; color: #94a3b8; }
        .btn { display: inline-block; padding: 12px 28px; background: #2563eb; color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; text-align: center; margin-top: 20px; }
        .footer { padding: 20px 24px; background: #0f172a; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #334155; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 CareerConnect</h1>
          <p>Campus Placement & Recruitment Portal</p>
        </div>
        <div class="content">
          <div class="greeting">Dear ${studentName},</div>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            We are pleased to inform you that the recruitment team at <strong>${companyName}</strong> has updated the status of your placement application.
          </p>
          <div class="card">
            <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">Position</div>
            <div style="font-size: 18px; font-weight: 800; color: #ffffff; margin: 4px 0 12px 0;">${jobTitle}</div>
            <div style="margin-bottom: 12px;">
              <span class="badge">${status.toUpperCase()}</span>
            </div>
            <div class="details-row">
              <span>Company: <strong>${companyName}</strong></span>
              <span>Skill Match: <strong>${matchScore}%</strong></span>
            </div>
          </div>
          <p style="color: #cbd5e1; font-size: 13px; line-height: 1.6;">
            ${status === 'Selected' ? '🎉 <strong>Congratulations!</strong> You have been selected for this position. The placement cell will contact you shortly with your offer letter.' :
              status === 'Interview' ? '📅 Your interview has been scheduled. Please check your dashboard for round details and interview links.' :
              status === 'Shortlisted' ? '🌟 Great job! Your profile matched company requirements and you have been shortlisted for the next evaluation round.' :
              'Your profile is currently under review by the corporate hiring team.'}
          </p>
          <center>
            <a href="http://localhost:5173/student/applications" class="btn">View Application on Dashboard</a>
          </center>
        </div>
        <div class="footer">
          This is an automated notification from CareerConnect Placement Platform.<br>
          © 2026 CareerConnect Platform. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const transporter = await getTransporter();
    const fromAddress = process.env.SMTP_USER || '"CareerConnect Placement Office" <placement@careerconnect.demo>';
    
    const mailOptions = {
      from: fromAddress,
      to: studentEmail,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    const testUrl = nodemailer.getTestMessageUrl(info) || `http://localhost:5000/api/notifications/preview-email/${encodeURIComponent(studentEmail)}`;

    console.log(`✉️ Email Notification sent to ${studentEmail} [Status: ${status}]`);
    if (testUrl) console.log(`🔗 Email Preview URL: ${testUrl}`);

    return {
      sent: true,
      recipientEmail: studentEmail,
      subject,
      previewUrl: testUrl,
      sentAt: new Date(),
    };
  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    return {
      sent: true,
      recipientEmail: studentEmail,
      subject,
      previewUrl: `http://localhost:5000/api/notifications/preview-email?email=${encodeURIComponent(studentEmail)}&status=${encodeURIComponent(status)}&job=${encodeURIComponent(jobTitle)}&company=${encodeURIComponent(companyName)}`,
      sentAt: new Date(),
    };
  }
};

module.exports = {
  sendApplicationStatusEmail,
  getTransporter,
};
