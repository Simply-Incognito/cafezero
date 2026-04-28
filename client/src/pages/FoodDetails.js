import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import Loader from '../components/common/Loader';

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await api.get(`/food/${id}`);
        setFood(res.data.data.food);
      } catch (err) {
        console.error('Failed to fetch food details:', err);
        // Fallback to searching mock data if API fails (useful for initial test)
        const MOCK_FOODS = [
          { _id: '1', name: 'Caramel Macchiato', price: 5.50, description: 'Freshly brewed espresso with steamed milk and a sweet caramel drizzle.', category: 'coffee', photo: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=800&h=600' },
          { _id: '2', name: 'Pepperoni Pizza', price: 12.99, description: 'Classic pizza with zesty tomato sauce, melted mozzarella, and spicy pepperoni slices.', category: 'pizza', photo: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&h=600' },
          { _id: '3', name: 'Classic Cheeseburger', price: 9.50, description: 'Juicy beef patty topped with melted cheddar, fresh lettuce, tomato, and our signature sauce.', category: 'burger', photo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&h=600' },
          { _id: '4', name: 'Chocolate Lava Cake', price: 6.99, description: 'Rich chocolate cake with a warm, gooey chocolate center. Served with a scoop of vanilla ice cream.', category: 'dessert', photo: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&h=600' },
          { _id: '5', name: 'Iced Americano', price: 4.00, description: 'Smooth espresso shots topped with cold water and served over ice.', category: 'coffee', photo: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&h=600' },
          { _id: '6', name: 'Veggie Deluxe Pizza', price: 14.50, description: 'Healthy and delicious pizza loaded with bell peppers, onions, olives, mushrooms, and tomatoes.', category: 'pizza', photo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&h=600' },
        ];
        const mockItem = MOCK_FOODS.find(f => f._id === id);
        setFood(mockItem);
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, [id]);

  if (loading) return <Loader />;

  if (!food) {
    return (
      <div className="empty-state">
        <h2>Food not found!</h2>
        <button className="primary-btn" onClick={() => navigate('/')}>Back Home</button>
      </div>
    );
  }

  return (
    <div className="food-details-page">
      <button className="back-link" onClick={() => navigate(-1)}>← Back to Menu</button>
      <div className="details-container">
        <div className="details-image">
          <img src={food.photo} alt={food.name} />
        </div>
        <div className="details-content">
          <span className="category-tag">{food.category}</span>
          <h1>{food.name}</h1>
          <p className="description">{food.description || 'Enjoy our delicious ' + food.name + ', prepared with the freshest ingredients and a touch of CafeZero magic.'}</p>
          <div className="price-row">
            <span className="price">${food.price.toFixed(2)}</span>
            <button className="primary-btn" onClick={() => addToCart(food)}>Add to Cart</button>
          </div>
          
          <div className="nutrients-preview">
            <div className="nutrient"><span>Rating</span><strong>⭐ {food.ratingsAverage || 4.5}</strong></div>
            <div className="nutrient"><span>Prep Time</span><strong>15-20 min</strong></div>
            <div className="nutrient"><span>Availability</span><strong>{food.isAvailable ? 'In Stock' : 'Out of Stock'}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
