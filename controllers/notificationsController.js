const db = require('../database/models');

module.exports = {
  findAll: function (req, res) {
    db.Notification.find(req.query)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function (req, res) {
    db.Notification.findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function (req, res) {
    db.Notification.create(req.body)
      .then(function (dbNotification) {
        return db.User.findByIdAndUpdate(
          { _id: req.params.id },
          { $push: { notifications: dbNotification._id } },
          { new: true }
        );
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: function (req, res) {
    db.Notification.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
    })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function (req, res) {
    db.Notification.findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
};
