/**
 * WhatsApp Notification Service
 * Generates formatted WhatsApp messages & Click-to-Chat deep links (wa.me)
 */

/**
 * Format phone number to international WhatsApp standard
 */
const formatPhoneNumber = (phone) => {
  if (!phone) return '918983398247';
  let cleaned = String(phone).replace(/[^0-9]/g, '');
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned; // Default country code India (+91)
  }
  return cleaned || '918983398247';
};

/**
 * Send / Prepare WhatsApp Notification for Candidate Status Update
 */
const sendWhatsAppStatusNotification = async ({
  studentName = 'Candidate',
  studentPhone = '8983398247',
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
${process.env.CLIENT_URL || 'https://careerconnect-484v9qnqo-gayatri-bajaj.vercel.app'}/student/applications

_CareerConnect Training & Placement Cell_`;

  // Standard universal wa.me deep link
  const waLink = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageText)}`;

  console.log(`💬 WhatsApp Notification generated for ${studentName} (${formattedPhone})`);
  console.log(`📱 WhatsApp Deep Link: ${waLink}`);


  return {
    sent: false,
    linkReady: true,
    recipientPhone: formattedPhone,
    messageText,
    waLink,
    sentAt: new Date(),
  };
};

module.exports = {
  sendWhatsAppStatusNotification,
};