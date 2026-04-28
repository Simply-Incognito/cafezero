const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A food item must have a name'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'A food item must belong to a category'],
    enum: ['coffee', 'pizza', 'burger', 'dessert', 'beverage']
  },
  price: {
    type: Number,
    required: [true, 'A food item must have a price']
  },
  description: {
    type: String,
    trim: true
  },
  photo: {
    type: String,
    default: 'https://via.placeholder.com/400x300?text=Food'
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
