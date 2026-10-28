import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-line sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl text-ink">Marketplace</Link>

        <div className="flex items-center gap-6 text-sm">
          <Link to="/shop" className="text-ink/70 hover:text-ink transition">Shop</Link>
          <Link to="/delivery" className="text-ink/70 hover:text-ink transition">Delivery</Link>
          <Link to="/stores" className="text-ink/70 hover:text-ink transition">Shops</Link>

          {user ? (
            <>
              {user.role === 'vendor' && (
                <Link to="/vendor/dashboard" className="text-ink/70 hover:text-ink transition">My Store</Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="text-ink/70 hover:text-ink transition">Admin</Link>
              )}
              {user.role === 'customer' && (
                <>
                  <Link to="/cart" className="text-ink/70 hover:text-ink transition">Cart</Link>
                  <Link to="/my-orders" className="text-ink/70 hover:text-ink transition">My Orders</Link>
                </>
              )}
              <span className="text-ink/50">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-ink text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-ink/90 transition"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-ink/70 hover:text-ink transition">Sign in</Link>
              <Link
                to="/signup"
                className="bg-ink text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-ink/90 transition"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}