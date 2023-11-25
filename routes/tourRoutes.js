const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router(); //middleware

// route.param('id', tourController.checkID);

//Tour Route
router
  .route('/')
  .get(tourController.getAllTour)
  .post(tourController.createTour);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
