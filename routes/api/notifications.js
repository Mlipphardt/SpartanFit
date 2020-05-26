const router = require('express').Router();
const notificationsController = require('../../controllers/notificationsController');

//matches with 'api/notifications'
router.route('/').get(notificationsController.findAll);

//matches with '/api/notifications/:id'
router
  .route('/:id')
  .get(notificationsController.findById)
  .post(notificationsController.create)
  .put(notificationsController.update)
  .delete(notificationsController.remove);

module.exports = router;
