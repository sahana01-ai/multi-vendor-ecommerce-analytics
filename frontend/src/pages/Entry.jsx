import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const CATEGORIES = [
  { name: 'Electronics', blurb: 'Gadgets & accessories' },
  { name: 'Clothing', blurb: 'Everyday wear' },
  { name: 'Home', blurb: 'Make it cosy' },
  { name: 'Fitness', blurb: 'Move more' },
  { name: 'Stationery', blurb: 'Write it down' },
];

const STEPS = [
  { n: '01', title: 'Browse independent shops', text: 'Every seller is approved by our admin before they can list a single product.' },
  { n: '02', title: 'Fill one cart', text: 'Mix products from different shops and check out once.' },
  { n: '03', title: 'Pay your way', text: 'Cash on delivery or online payment, with each item tracked separately.' },
];

export default function Entry() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [stores, setStores] = useState([]);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    API.get('/auth/stores').then((r) => setStores(r.data)).catch(() => {});
    API.get('/products').then((r) => setProductCount(r.data.length)).catch(() => {});
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/shop?search=${encodeURIComponent(q)}`);
  };

  const hide = (e) => {
    e.target.style.display = 'none';
  };

  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, #FBE6C8 0%, #F6F3EC 55%, #F3E3CF 100%)' }}>
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-medium tracking-widest uppercase text-teal mb-4">Multi-vendor marketplace</p>
            <h1 className="font-display text-5xl md:text-6xl text-ink leading-tight mb-5">
              Shop small, all in one place.
            </h1>
            <p className="text-ink/70 text-lg leading-relaxed mb-8 max-w-md">
              Discover independent shops, fill one cart, and track every order from a single account.
            </p>

            <form onSubmit={onSearch} className="flex gap-2 max-w-md mb-6">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search for headphones, shirts, journals..."
                className="flex-1 bg-white border border-line rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-marigold"
              />
              <button className="bg-ink text-white px-5 rounded-lg font-medium hover:bg-ink/90 transition">
                Search
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                to="/shop"
                className="bg-marigold text-ink px-7 py-3.5 rounded-lg font-semibold hover:bg-marigold-dark transition"
              >
                Shop now
              </Link>
              <Link to="/stores" className="text-ink/70 hover:text-ink font-medium transition">
                Browse shops →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md ml-auto">
            <div className="space-y-4 pt-10">
              <img
                onError={hide}
                src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500"
                alt="Ceramic mug"
                className="w-full aspect-[4/5] object-cover rounded-xl border-8 border-white shadow-md -rotate-2"
              />
              <img
                onError={hide}
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"
                alt="Cotton t-shirt"
                className="w-full aspect-square object-cover rounded-xl border-8 border-white shadow-md rotate-1"
              />
            </div>
            <div className="space-y-4">
              <img
                onError={hide}
                src="https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500"
                alt="Yoga mats"
                className="w-full aspect-square object-cover rounded-xl border-8 border-white shadow-md rotate-2"
              />
              <img
                onError={hide}
                src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500"
                alt="Headphones"
                className="w-full aspect-[4/5] object-cover rounded-xl border-8 border-white shadow-md -rotate-1"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Live stats */}
      <section className="bg-ink text-white">
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-3 text-center">
          <div>
            <p className="font-display text-3xl">{stores.length}</p>
            <p className="text-white/60 text-sm">Independent shops</p>
          </div>
          <div>
            <p className="font-display text-3xl">{productCount}</p>
            <p className="text-white/60 text-sm">Products</p>
          </div>
          <div>
            <p className="font-display text-3xl">2</p>
            <p className="text-white/60 text-sm">Ways to pay</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-display text-3xl text-ink mb-8">Shop by category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              to={`/shop?category=${c.name}`}
              className="bg-white border border-line rounded-xl p-5 hover:border-marigold hover:-translate-y-0.5 transition"
            >
              <h3 className="font-display text-xl text-ink">{c.name}</h3>
              <p className="text-sm text-ink/50 mt-1">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured shops */}
      {stores.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display text-3xl text-ink">Meet the shops</h2>
            <Link to="/stores" className="text-teal font-medium hover:underline">See all →</Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {stores.slice(0, 3).map((s) => (
              <Link
                key={s._id}
                to={`/store/${s._id}`}
                className="bg-white border border-line rounded-xl p-6 hover:border-marigold transition"
              >
                <div className="w-12 h-12 rounded-full bg-marigold/25 flex items-center justify-center font-display text-xl text-ink mb-3">
                  {s.storeName.charAt(0)}
                </div>
                <h3 className="font-display text-xl text-ink">{s.storeName}</h3>
                <p className="text-sm text-ink/50">{s.productCount} products</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="bg-white border-y border-line">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="font-display text-3xl text-ink mb-10">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.n}>
                <p className="font-display text-4xl text-marigold mb-2">{s.n}</p>
                <h3 className="font-medium text-ink mb-1">{s.title}</h3>
                <p className="text-ink/60 text-sm leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller banner */}
      <section className="bg-ink text-white">
        <div className="max-w-6xl mx-auto px-6 py-14 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl mb-2">Have something to sell?</h2>
            <p className="text-white/60">Open your shop, manage orders, and see your sales in live charts.</p>
          </div>
          <Link
            to="/signup"
            className="bg-marigold text-ink px-7 py-3.5 rounded-lg font-semibold hover:bg-marigold-dark transition"
          >
            Start selling
          </Link>
        </div>
      </section>
    </div>
  );
}