const db = require('../database/models');

module.exports = {
  findAll: function (req, res) {
    db.Comment.find(req.query)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function (req, res) {
    db.Comment.findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function (req, res) {
    if (req.body.originalPoster === req.body.userId) {
      db.Comment.create(req.body)
        .then(function (dbComment) {
          console.log(req.body);
          return db.Post.findByIdAndUpdate(
            { _id: req.params.id },
            { $push: { comments: dbComment._id } },
            { new: true }
          );
        })
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    } else {
      db.Comment.create(req.body).then(function (dbComment) {
        console.log(req.body);
        return db.Post.findByIdAndUpdate(
          { _id: req.params.id },
          { $push: { comments: dbComment._id } },
          { new: true }
        );
      }).then;
      db.Notification.create({
        username: req.body.username,
        userId: req.body.commenterId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        postId: req.body.postId,
        notificationType: 'commented',
      })
        .then(function (dbNotification) {
          return db.User.findByIdAndUpdate(
            { _id: req.body.originalPoster },
            { $push: { notifications: dbNotification._id } },
            { new: true }
          );
        })
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    }
  },
  update: function (req, res) {
    db.Comment.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function (req, res) {
    db.Comment.findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
};
