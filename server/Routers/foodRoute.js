const express = require('express');
const foodController = require('../Controllers/foodController');

const router = express.Router();

router
  .route('/')
  .get(foodController.getAllFoods)
  .post(foodController.createFood);

router
  .route('/:id')
  .get(foodController.getFood)
  .patch(foodController.updateFood)
  .delete(foodController.deleteFood);

module.exports = router;
