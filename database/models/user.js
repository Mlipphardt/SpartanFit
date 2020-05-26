const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
mongoose.promise = Promise;

const validateEmail = email => {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = new Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  password: { type: String, required: true },
  username: {
    type: String,
    required: true,
    index: {
      unique: true,
      collation: { locale: 'en', strength: 2 },
    },
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  occupation: String,
  city: { type: String },
  state: { type: String },
  createdAt: { type: Date, default: Date.now },
  interests: { type: String },
  bio: { type: String },
  image: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
  workout: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Workout',
    },
  ],
  meal: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Meal',
    },
  ],
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Like',
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Following',
    },
  ],
  notifications: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Notification',
    },
  ],
  currentWeight: Number,
  goalWeight: Number,
  slug: {
    type: String,
    unique: true,
  },
});

userSchema.index({ lastName: 'text', firstName: 'text' });
//userSchema.index({ '$**': 'text' });

// Define schema methods
userSchema.methods = {
  checkPassword: function (inputPassword) {
    return bcrypt.compareSync(inputPassword, this.password);
  },
  hashPassword: plainTextPassword => {
    return bcrypt.hashSync(plainTextPassword, 10);
  },
};

// Define hooks for pre-saving
userSchema.pre('save', function (next) {
  if (!this.password) {
    next();
  } else {
    this.password = this.hashPassword(this.password);
    next();
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
