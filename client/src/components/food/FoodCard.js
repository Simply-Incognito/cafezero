import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();

  return (
    <div className="food-card">
      <div className="food-image">
        <img src={food.photo || 'https://via.placeholder.com/200x150?text=Food'} alt={food.name} />
      </div>
      <div className="food-info">
        <h3>{food.name}</h3>
        <p className="food-price">${food.price.toFixed(2)}</p>
        <div className="food-actions">
          <Link to={`/food/${food._id}`} className="view-details">Details</Link>
          <button 
            onClick={() => addToCart(food)} 
            className="add-to-cart-btn"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
