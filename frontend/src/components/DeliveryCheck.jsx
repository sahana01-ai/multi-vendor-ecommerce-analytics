import { useState } from 'react';
import API from '../api/axios';

export default function DeliveryCheck({ onResult }) {
  const [pin, setPin] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    setLoading(true);
    try {
      const res = await API.get('/delivery/check', { params: { pincode: pin } });
      setResult(res.data);
      onResult && onResult(res.data.serviceable ? { ...res.data, pincode: pin } : null);
    } catch (err) {
      const data = err.response?.data || { serviceable: false, message: 'Could not check delivery.' };
      setResult(data);
      onResult && onResult(null);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setPin(e.target.value.replace(/\D/g, '').slice(0, 6));
    if (result) {
      setResult(null);
      onResult && onResult(null);
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={pin}
          onChange={onChange}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), check())}
          placeholder="Enter 6-digit pincode"
          inputMode="numeric"
          className="flex-1 border border-line rounded-lg px-4 py-2.5 bg-white outline-none focus:ring-2 focus:ring-marigold/30 focus:border-marigold transition"
        />
        <button
          type="button"
          onClick={check}
          disabled={loading || pin.length !== 6}
          className="bg-ink text-white px-5 rounded-lg font-medium hover:bg-ink/90 transition disabled:opacity-40"
        >
          {loading ? 'Checking...' : 'Check'}
        </button>
      </div>

      {result && result.serviceable && (
        <p className="text-sm text-teal mt-2">
          Delivering to {result.city}, {result.state} in {result.days}.{' '}
          {result.fee === 0 ? 'Free delivery.' : `Delivery ₹${result.fee} (free above ₹${result.freeAbove}).`}
        </p>
      )}
      {result && !result.serviceable && (
        <p className="text-sm text-clay mt-2">{result.message}</p>
      )}
    </div>
  );
}