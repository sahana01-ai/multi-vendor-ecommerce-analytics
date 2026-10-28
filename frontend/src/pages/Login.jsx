import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      if (res.data.user.role === 'vendor') navigate('/vendor/dashboard');
      else if (res.data.user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/shop');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-canvas flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-ink mb-2">Marketplace</h1>
          <p className="text-ink/60 text-sm">Sign in to continue shopping or selling</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-line rounded-xl p-8">
          {error && (
            <div className="bg-clay/10 border border-clay/30 text-clay text-sm rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-line rounded-lg px-4 py-2.5 mb-4 outline-none focus:border-marigold focus:ring-2 focus:ring-marigold/20 transition"
            required
          />

          <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-line rounded-lg px-4 py-2.5 mb-6 outline-none focus:border-marigold focus:ring-2 focus:ring-marigold/20 transition"
            required
          />

          <button
            type="submit"
            className="w-full bg-ink text-white py-3 rounded-lg font-medium hover:bg-ink/90 transition"
          >
            Sign in
          </button>

          <p className="text-sm text-center mt-6 text-ink/60">
            New here? <Link to="/signup" className="text-marigold-dark font-medium hover:underline">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}