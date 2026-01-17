import Notification from "../models/Notification.js";

//............................. Get My Notifications .............................

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      toUserId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(100); 
    
    res.json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
};

//............................. Mark As Read .............................
export const markAsRead = async (req, res) => {
  try {
    const n = await Notification.findOne({
      _id: req.params.id,
      toUserId: req.user._id,
    });
    if (!n) return res.status(404).json({ success: false, message: "Not found" });

    n.isRead = true;
    await n.save();

    res.json({ success: true, message: "Read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ success: false, message: "Failed to mark as read" });
  }
};

//............................. Create Notification .............................
export const createNotification = async ({ toUserId, message, type }) => {
  try {
    await Notification.create({ toUserId, message, type });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
};
