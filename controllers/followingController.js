const db = require('../database/models');

module.exports = {
  findAll: function (req, res) {
    db.Follow.find(req.query)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function (req, res) {
    console.log(req.body);
    console.log(req.params.id);
    db.Follow.findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function (req, res) {
    db.Follow.create(req.body).then(function (dbFollow) {
      return db.User.findByIdAndUpdate(
        { _id: req.params.id },
        { $push: { following: dbFollow._id } },
        { new: true }
      );
    }).then;
    db.Notification.create({
      userId: req.body.followerId,
      username: req.body.followerUserName,
      firstName: req.body.followerfirstName,
      lastName: req.body.followerlastName,
      notificationType: 'followed you',
    })
      .then(function (dbNotification) {
        return db.User.findByIdAndUpdate(
          { _id: req.body.userId },
          { $push: { notifications: dbNotification } },
          { new: true }
        );
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: function (req, res) {
    db.Follow.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function (req, res) {
    db.Follow.findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
};
