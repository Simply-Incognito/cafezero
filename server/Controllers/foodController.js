const Food = require('../Models/foodModel');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const CustomError = require('../Utils/CustomError');

exports.getAllFoods = asyncErrorHandler(async (req, res, next) => {
  const foods = await Food.find();
  
  res.status(200).json({
    status: 'success',
    results: foods.length,
    data: { foods }
  });
});

exports.getFood = asyncErrorHandler(async (req, res, next) => {
  const food = await Food.findById(req.params.id);
  
  if (!food) {
    return next(new CustomError('No food item found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: { food }
  });
});

exports.createFood = asyncErrorHandler(async (req, res, next) => {
  const newFood = await Food.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: { food: newFood }
  });
});

exports.updateFood = asyncErrorHandler(async (req, res, next) => {
  const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!food) {
    return next(new CustomError('No food item found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: { food }
  });
});

exports.deleteFood = asyncErrorHandler(async (req, res, next) => {
  const food = await Food.findByIdAndDelete(req.params.id);
  
  if (!food) {
    return next(new CustomError('No food item found with that ID', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});
