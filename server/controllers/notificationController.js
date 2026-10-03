const Notification = require('../models/Notification');
const { successResponse, errorResponse } = require('../utils/apiResponse');

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

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
