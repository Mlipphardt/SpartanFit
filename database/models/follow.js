const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followSchema = new Schema({
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: String,
  createdAt: { type: Date, default: Date.now },
  userId: { type: String, required: true },
  followerfirstName: { type: String, required: true },
  followerlastName: String,
  followerUserName: { type: String, required: true },
});

const Follow = mongoose.model('Following', followSchema);

module.exports = Follow;
