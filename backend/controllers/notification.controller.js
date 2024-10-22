import Notification from '../models/notificacion.model.js';

export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .populate('relatedUser', 'name username profilePicture')
      .populate('relatedPost', 'content image');

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error in getUserNotifications controller', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markNotificationAsRead = async (req, res) => {
  const notificationId = req.params.id;
  try {
    const notification = await Notification.findByIdAndUpdate(
      { _id: notificationId, recipient: req.user._id },
      {
        read: true,
      },
      { new: true }
    );
    res.status(200).json(notification);
  } catch (error) {
    console.error('Error in markNotificationAsRead', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteNotification = async (req, res) => {
  const notificationId = req.params.id;
  try {
    await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: req.user._id,
    });
    res.status(200).json({ message: 'notification deleted successfully' });
  } catch (error) {
    console.error('Error in deleteNotification controller: ', error);
    res.status(500).json({ message: 'server error' });
  }
};
