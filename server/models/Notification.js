const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    type: {
      type: String,
      enum: [
        'application_status',
        'new_application',
        'job_posted',
        'job_approved',
        'announcement',
      ],
      default: 'announcement',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedJob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      default: null,
    },
    relatedApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    // Multi-Channel Delivery Status (Email & WhatsApp)
    emailNotification: {
      sent: { type: Boolean, default: false },
      recipientEmail: { type: String, default: '' },
      subject: { type: String, default: '' },
      previewUrl: { type: String, default: '' },
      sentAt: { type: Date, default: null },
    },
    whatsappNotification: {
      sent: { type: Boolean, default: false },
      recipientPhone: { type: String, default: '' },
      messageText: { type: String, default: '' },
      waLink: { type: String, default: '' },
      sentAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ recipient: 1, isRead: 1 });

module.exports = mongoose.model('Notification', NotificationSchema);
