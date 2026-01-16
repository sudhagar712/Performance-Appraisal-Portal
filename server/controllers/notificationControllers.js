import Notification from "../models/Notification.js";

//............................. Get My Notifications .............................

export const getMyNotifications = async (req, res) => {
  const notifications = await Notification.find({
    toUserId: req.user._id,
  }).sort({ createdAt: -1 });
  res.json({ success: true, notifications });
};

//............................. Mark As Read .............................
export const markAsRead = async (req, res) => {
  const n = await Notification.findOne({
    _id: req.params.id,
    toUserId: req.user._id,
  });
  if (!n) return res.status(404).json({ success: false, message: "Not found" });

  n.isRead = true;
  await n.save();

  res.json({ success: true, message: "Read" });
};

//............................. Create Notification .............................
export const createNotification = async ({ toUserId, message, type }) => {
  await Notification.create({ toUserId, message, type });
};
