const Notification = require('../models/Notification');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { sendApplicationStatusEmail } = require('../services/emailService');
const { sendWhatsAppStatusNotification } = require('../services/whatsappService');

/**
 * @desc    Get user notifications
 * @route   GET /api/notifications
 * @access  Private
 */
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .populate('sender', 'name profileImage')
      .populate('relatedJob', 'title company')
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false,
    });

    return successResponse(res, 200, 'Notifications fetched successfully', {
      notifications,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark a single notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return errorResponse(res, 404, 'Notification not found');
    }

    if (notification.recipient.toString() !== req.user.id) {
      return errorResponse(res, 403, 'Not authorized to access this notification');
    }

    notification.isRead = true;
    await notification.save();

    return successResponse(res, 200, 'Notification marked as read', notification);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark all user notifications as read
 * @route   PATCH /api/notifications/read-all
 * @access  Private
 */
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    return successResponse(res, 200, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Preview HTML Email rendered for a notification
 * @route   GET /api/notifications/preview-email/:id
 * @access  Public
 */
const previewNotificationEmail = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('recipient', 'name email')
      .populate('relatedJob', 'title company');

    const recipientName = notification?.recipient?.name || req.query.name || 'Candidate';
    const recipientEmail = notification?.recipient?.email || req.query.email || 'candidate@student.demo';
    const jobTitle = notification?.relatedJob?.title || req.query.job || 'Software Engineer';
    const companyName = req.query.company || 'TechCorp Solutions';
    const status = req.query.status || 'Shortlisted';

    const statusColors = {
      'Shortlisted': '#10b981',
      'Interview': '#3b82f6',
      'Selected': '#8b5cf6',
      'Under Review': '#f59e0b',
      'Rejected': '#ef4444',
    };
    const statusBadgeColor = statusColors[status] || '#2563eb';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>CareerConnect Placement Notification Email Preview</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 40px 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 20px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
          .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 36px 28px; text-align: center; }
          .header h1 { margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.02em; }
          .header p { margin: 8px 0 0 0; color: #bfdbfe; font-size: 14px; }
          .content { padding: 36px 28px; }
          .greeting { font-size: 18px; font-weight: 700; color: #f8fafc; margin-bottom: 16px; }
          .card { background: #0f172a; border: 1px solid #334155; border-radius: 14px; padding: 22px; margin: 24px 0; }
          .badge { display: inline-block; padding: 6px 16px; border-radius: 9999px; font-weight: 800; font-size: 13px; color: #ffffff; background-color: ${statusBadgeColor}; text-transform: uppercase; letter-spacing: 0.05em; }
          .details-row { display: flex; justify-content: space-between; margin-top: 14px; font-size: 13px; color: #94a3b8; border-top: 1px solid #1e293b; padding-top: 12px; }
          .btn { display: inline-block; padding: 14px 32px; background: #2563eb; color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; text-align: center; margin-top: 24px; box-shadow: 0 10px 15px -3px rgba(37,99,235,0.3); }
          .footer { padding: 24px; background: #0f172a; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #334155; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 CareerConnect</h1>
            <p>Training & Placement Official Communication</p>
          </div>
          <div class="content">
            <div class="greeting">Dear ${recipientName},</div>
            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
              We are pleased to inform you that the recruitment team at <strong>${companyName}</strong> has updated the evaluation status of your campus placement application.
            </p>
            <div class="card">
              <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em;">Opportunity</div>
              <div style="font-size: 20px; font-weight: 800; color: #ffffff; margin: 4px 0 14px 0;">${jobTitle}</div>
              <div style="margin-bottom: 12px;">
                <span class="badge">${status}</span>
              </div>
              <div class="details-row">
                <span>Company: <strong style="color: #f8fafc;">${companyName}</strong></span>
                <span>Recipient: <strong style="color: #f8fafc;">${recipientEmail}</strong></span>
              </div>
            </div>
            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
              ${status === 'Selected' ? '🎉 <strong>Congratulations!</strong> You have been selected for this position. The T&P cell will send your offer letter and joining kit shortly.' :
                status === 'Interview' ? '📅 Your interview round has been scheduled. Please check your student dashboard for meet links and time slots.' :
                status === 'Shortlisted' ? '🌟 Great job! Your technical profile met company benchmarks and you have been shortlisted for the next evaluation round.' :
                'Your application has been received and is currently under review by the hiring team.'}
            </p>
            <center>
              <a href="http://localhost:5173/student/applications" class="btn">View on Student Dashboard</a>
            </center>
          </div>
          <div class="footer">
            This is an official automated notification generated by CareerConnect.<br>
            Delivered to: <strong>${recipientEmail}</strong> • © 2026 CareerConnect Platform.
          </div>
        </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.send(htmlContent);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Send instant test Email & WhatsApp notification live
 * @route   POST /api/notifications/send-test-alert
 * @access  Private / Public
 */
const sendTestAlert = async (req, res, next) => {
  try {
    const {
      email = 'student@careerconnect.demo',
      phone = '9876543210',
      name = 'Rahul Sharma',
      jobTitle = 'Full Stack Software Engineer',
      companyName = 'TechCorp Solutions',
      status = 'Shortlisted',
    } = req.body;

    const emailResult = await sendApplicationStatusEmail({
      studentName: name,
      studentEmail: email,
      jobTitle,
      companyName,
      status,
      matchScore: 85,
    });

    const whatsappResult = await sendWhatsAppStatusNotification({
      studentName: name,
      studentPhone: phone,
      jobTitle,
      companyName,
      status,
      matchScore: 85,
    });

    return successResponse(res, 200, 'Test Email and WhatsApp notification dispatched successfully!', {
      emailResult,
      whatsappResult,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  previewNotificationEmail,
  sendTestAlert,
};
