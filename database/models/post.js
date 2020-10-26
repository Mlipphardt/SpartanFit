const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: String,
  userpic: { type: String, required: true },
  postBody: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  userId: { type: String, required: true },
});

//postSchema.index({ postBody: 'text', lastName: 'text', firstName: 'text' });
postSchema.index({ '$**': 'text' });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
