/**
 * WhatsApp Notification Service
 * Generates formatted WhatsApp messages & Click-to-Chat deep links (wa.me)
 */

/**
 * Format phone number to international WhatsApp standard
 */
const formatPhoneNumber = (phone) => {
  if (!phone) return '919876543210';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned; // Default country code India (+91)
  }
  return cleaned;
};

/**
 * Send / Prepare WhatsApp Notification for Candidate Status Update
 */
const sendWhatsAppStatusNotification = async ({
  studentName = 'Candidate',
  studentPhone = '9876543210',
  jobTitle,
  companyName,
  status,
  matchScore = 0,
}) => {
  const statusEmoji = {
    'Shortlisted': '🌟 SHORTLISTED',
    'Interview': '📅 INTERVIEW SCHEDULED',
    'Selected': '🎉 SELECTED (OFFER)',
    'Under Review': '🔍 UNDER REVIEW',
    'Rejected': '❌ NOT SELECTED',
  };

  const statusLabel = statusEmoji[status] || status.toUpperCase();
  const formattedPhone = formatPhoneNumber(studentPhone);

  const messageText = `🎓 *CareerConnect Placement Alert*
---------------------------------
Dear *${studentName}*,

Your application status has been updated:
🏢 *Company:* ${companyName}
💼 *Position:* ${jobTitle}
📊 *Current Status:* *${statusLabel}*
🎯 *Skill Match Score:* ${matchScore}%

${status === 'Selected' ? '🎉 Congratulations! The T&P cell will send your offer letter shortly.' :
  status === 'Interview' ? '📅 Please be prepared for your upcoming interview round.' :
  status === 'Shortlisted' ? '🌟 Great work! You have progressed to the next round.' :
  'Your application is under evaluation by the hiring panel.'}

👉 *View Details on Student Portal:*
http://localhost:5173/student/applications

_CareerConnect Training & Placement Cell_`;

  const waLink = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(messageText)}`;

  console.log(`💬 WhatsApp Notification generated for ${studentName} (${formattedPhone})`);
  console.log(`📱 WhatsApp Deep Link: ${waLink}`);

  return {
    sent: true,
    recipientPhone: formattedPhone,
    messageText,
    waLink,
    sentAt: new Date(),
  };
};

module.exports = {
  sendWhatsAppStatusNotification,
};
