import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import DeliveryCheck from '../components/DeliveryCheck';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [processing, setProcessing] = useState(false);
  const [delivery, setDelivery] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart')) || []);
  }, []);

  const updateQuantity = (productId, qty) => {
    const updated = cart.map((item) =>
      item.productId === productId ? { ...item, quantity: Math.max(1, qty) } : item
    );
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeItem = (productId) => {
    const updated = cart.filter((item) => item.productId !== productId);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = delivery ? (subtotal >= delivery.freeAbove ? 0 : delivery.fee) : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = async () => {
    if (!delivery) {
      setError('Please check that we deliver to your pincode.');
      return;
    }
    if (!address.trim()) {
      setError('Please enter a shipping address');
      return;
    }
    setError('');

    if (paymentMethod === 'Online') {
      setProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setProcessing(false);
    }

    setLoading(true);
    try {
      await API.post('/orders', {
        items: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        shippingAddress: address,
        paymentMethod,
        pincode: delivery.pincode,
      });
      localStorage.removeItem('cart');
      navigate('/my-orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl text-ink mb-3">Your cart is empty</h1>
        <p className="text-ink/60">Browse products and add something you like.</p>
      </div>
    );
  }

  const optionClass = (active) =>
    `flex-1 border rounded-lg px-4 py-3 text-sm font-medium transition ${
      active ? 'border-marigold bg-marigold/10 text-ink' : 'border-line text-ink/60 hover:border-ink/30'
    }`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl text-ink mb-8">Your cart</h1>

      <div className="space-y-4 mb-8">
        {cart.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 bg-white border border-line rounded-xl p-4">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-marigold/20 flex items-center justify-center font-display text-3xl text-ink/70">
                {item.name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-medium text-ink">{item.name}</h3>
              <p className="text-ink/60 text-sm">₹{item.price}</p>
            </div>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
              className="w-16 border border-line rounded-lg px-2 py-1 text-center outline-none focus:ring-2 focus:ring-marigold"
            />
            <button onClick={() => removeItem(item.productId)} className="text-clay text-sm hover:underline">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white border border-line rounded-xl p-6 mb-6">
        <label className="block text-sm font-medium text-ink mb-1.5">Delivery pincode</label>
        <DeliveryCheck onResult={setDelivery} />

        <label className="block text-sm font-medium text-ink mb-1.5 mt-5">Shipping address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows="3"
          className="w-full border border-line rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-marigold/20 focus:border-marigold transition"
          placeholder="House / street / area"
        />

        <label className="block text-sm font-medium text-ink mb-1.5 mt-5">Payment method</label>
        <div className="flex gap-3 mb-5">
          <button type="button" onClick={() => setPaymentMethod('COD')} className={optionClass(paymentMethod === 'COD')}>
            Cash on Delivery
          </button>
          <button type="button" onClick={() => setPaymentMethod('Online')} className={optionClass(paymentMethod === 'Online')}>
            Online Payment
          </button>
        </div>

        <div className="border-t border-line pt-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-ink/70">
            <span>Items</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-ink/70">
            <span>Delivery</span>
            <span>{delivery ? (deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`) : 'Check pincode'}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold text-ink pt-1">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        {error && <p className="text-clay text-sm mt-3">{error}</p>}

        <button
          onClick={handleCheckout}
          disabled={loading || processing || !delivery}
          className="w-full bg-ink text-white py-3 rounded-lg font-medium hover:bg-ink/90 transition mt-4 disabled:opacity-50"
        >
          {processing ? 'Processing payment...' : loading ? 'Placing order...' : 'Place order'}
        </button>
      </div>
    </div>
  );
}