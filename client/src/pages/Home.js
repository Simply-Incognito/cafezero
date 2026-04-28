import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CategoryFilter from '../components/food/CategoryFilter';
import FoodCard from '../components/food/FoodCard';
import Loader from '../components/common/Loader';

const MOCK_FOODS = [
  { _id: '1', name: 'Caramel Macchiato', price: 5.50, category: 'coffee', photo: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=400&h=300' },
  { _id: '2', name: 'Pepperoni Pizza', price: 12.99, category: 'pizza', photo: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&h=300' },
  { _id: '3', name: 'Classic Cheeseburger', price: 9.50, category: 'burger', photo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&h=300' },
  { _id: '4', name: 'Chocolate Lava Cake', price: 6.99, category: 'dessert', photo: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=400&h=300' },
  { _id: '5', name: 'Iced Americano', price: 4.00, category: 'coffee', photo: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&h=300' },
  { _id: '6', name: 'Veggie Deluxe Pizza', price: 14.50, category: 'pizza', photo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&h=300' },
];

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await api.get('/food');
        const fetchedFoods = res.data.data.foods;
        // If DB is empty, use mock data so the app doesn't look empty at first glance
        setFoods(fetchedFoods.length > 0 ? fetchedFoods : MOCK_FOODS);
      } catch (err) {
        console.error('Failed to fetch foods, using mock data:', err);
        setFoods(MOCK_FOODS);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const filteredFoods = activeCategory === 'all' 
    ? foods 
    : foods.filter(f => f.category === activeCategory);

  if (loading) return <Loader />;

  return (
    <div className="home-page">
      <header className="hero-section">
        <div className="hero-content">
          <h2>Order Your Favorite Coffee & Food</h2>
          <p>Freshly brewed coffee and delicious meals delivered straight to your door.</p>
          <button className="primary-btn" onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}>
            Explore Menu
          </button>
        </div>
      </header>

      <section className="menu-section" id="menu">
        <div className="section-header">
          <h2>Our Menu</h2>
          <CategoryFilter 
            activeCategory={activeCategory} 
            onCategoryChange={setActiveCategory} 
          />
        </div>

        <div className="food-grid">
          {filteredFoods.map(food => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
