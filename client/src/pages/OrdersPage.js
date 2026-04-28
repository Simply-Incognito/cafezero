import React, { useEffect, useState } from "react";
import api from "../services/api";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/order");
        // Check if data is nested under 'data' or 'orders' depending on API
        setOrders(res.data.orders || res.data.data || res.data);
      } catch (err) {
        setError(err || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Order History</h1>
        <p>Manage and track your recent coffee and food orders.</p>
      </div>

      {error && <div className="status-msg-toast error">{error}</div>}

      <div className="orders-list">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <span>Order #</span>
                  <strong>{order._id.slice(-8).toUpperCase()}</strong>
                </div>
                <div className="order-status completed">Delivered</div>
              </div>
              
              <div className="order-body">
                <div className="order-info">
                  <h3>{order.name}</h3>
                  <p>{order.description || "No description provided."}</p>
                </div>
                <div className="order-meta">
                  <div className="meta-item">
                    <label>Quantity</label>
                    <span>{order.quantity}x</span>
                  </div>
                  <div className="meta-item">
                    <label>Total Price</label>
                    <span className="price">${order.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="order-footer">
                <button className="reorder-btn">Order Again</button>
                <button className="details-btn">View Details</button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>You haven't placed any orders yet.</p>
            <button className="primary-btn" onClick={() => window.location.href = '/'}>Browse Menu</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
