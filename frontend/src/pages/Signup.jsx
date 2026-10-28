import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'customer', storeName: '',
  });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/auth/signup', form);
      const res = await API.post('/auth/login', { email: form.email, password: form.password });
      login(res.data.user, res.data.token);
      if (res.data.user.role === 'vendor') navigate('/vendor/dashboard');
      else navigate('/shop');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-canvas flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-ink mb-2">Join the marketplace</h1>
          <p className="text-ink/60 text-sm">Shop from independent sellers, or start selling</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-line rounded-xl p-8">
          {error && (
            <div className="bg-clay/10 border border-clay/30 text-clay text-sm rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <label className="block text-sm font-medium text-ink mb-1.5">Full name</label>
          <input name="name" type="text" value={form.name} onChange={handleChange}
            className="w-full border border-line rounded-lg px-4 py-2.5 mb-4 outline-none focus:border-marigold focus:ring-2 focus:ring-marigold/20 transition" required />

          <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange}
            className="w-full border border-line rounded-lg px-4 py-2.5 mb-4 outline-none focus:border-marigold focus:ring-2 focus:ring-marigold/20 transition" required />

          <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange}
            className="w-full border border-line rounded-lg px-4 py-2.5 mb-4 outline-none focus:border-marigold focus:ring-2 focus:ring-marigold/20 transition" required />

          <label className="block text-sm font-medium text-ink mb-1.5">I want to</label>
          <select name="role" value={form.role} onChange={handleChange}
            className="w-full border border-line rounded-lg px-4 py-2.5 mb-4 outline-none focus:border-marigold focus:ring-2 focus:ring-marigold/20 transition bg-white">
            <option value="customer">Shop as a customer</option>
            <option value="vendor">Sell as a vendor</option>
          </select>

          {form.role === 'vendor' && (
            <>
              <label className="block text-sm font-medium text-ink mb-1.5">Store name</label>
              <input name="storeName" type="text" value={form.storeName} onChange={handleChange}
                className="w-full border border-line rounded-lg px-4 py-2.5 mb-4 outline-none focus:border-marigold focus:ring-2 focus:ring-marigold/20 transition" required />
            </>
          )}

          <button type="submit"
            className="w-full bg-ink text-white py-3 rounded-lg font-medium hover:bg-ink/90 transition mt-2">
            Create account
          </button>

          <p className="text-sm text-center mt-6 text-ink/60">
            Already have an account? <Link to="/login" className="text-marigold-dark font-medium hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
