import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get('/orders/my-orders').then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl text-ink mb-8">My orders</h1>

      {orders.length === 0 ? (
        <p className="text-ink/50">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-line rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-ink/50">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                                <div className="text-right">
                  <span className="font-semibold text-ink block">₹{order.totalAmount}</span>
                  <span className="text-xs text-ink/50">{order.paymentMethod} · {order.paymentStatus}</span>
                  {order.deliveryCity && (
  <span className="text-xs text-ink/50 block">
    Delivery to {order.deliveryCity} · {order.deliveryFee ? `₹${order.deliveryFee}` : 'free'}
  </span>
)}
                </div>
              </div>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-ink/80">{item.name} × {item.quantity}</span>
                    <span className="capitalize text-teal font-medium">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}