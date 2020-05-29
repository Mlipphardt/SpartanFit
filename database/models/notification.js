const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  //user who interacted with your profile/post
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: String,
  userId: { type: String, required: true },
  //commented, posted, followed, etc
  notificationType: { type: String, required: true },
  seen: { type: Boolean, required: true, default: false },
  postId: String,
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
