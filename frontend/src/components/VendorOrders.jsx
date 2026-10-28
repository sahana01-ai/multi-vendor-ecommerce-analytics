import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function VendorOrders() {
  const [orders, setOrders] = useState([]);

  const loadOrders = () => {
    API.get('/orders/vendor-orders').then((res) => setOrders(res.data));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (orderId, itemId, status) => {
    await API.put(`/orders/${orderId}/items/${itemId}`, { status });
    loadOrders();
  };

  return (
    <div>
      <h2 className="font-display text-2xl text-ink mb-6">Orders</h2>
      {orders.length === 0 ? (
        <p className="text-ink/50">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) =>
            order.items.map((item) => (
              <div key={item._id} className="bg-white border border-line rounded-xl p-5 flex items-center justify-between">
                <div>
                  <p className="font-medium text-ink">{item.name} × {item.quantity}</p>
                  <p className="text-sm text-ink/50">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <select
                  value={item.status}
                  onChange={(e) => updateStatus(order._id, item._id, e.target.value)}
                  className="border border-line rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-marigold/20"
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}