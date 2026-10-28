import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [params] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get('search') || '');
  const [category, setCategory] = useState(params.get('category') || 'All');
  const [sort, setSort] = useState('new');

  useEffect(() => {
    API.get('/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const filtered = products
    .filter((p) => category === 'All' || p.category === category)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'low') return a.price - b.price;
      if (sort === 'high') return b.price - a.price;
      if (sort === 'rating') return (b.avgRating || 0) - (a.avgRating || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div>
      <div className="bg-ink text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h1 className="font-display text-4xl md:text-5xl mb-3">Everything from independent shops</h1>
          <p className="text-white/70 mb-6">
            {products.length} products ·{' '}
            <Link to="/stores" className="underline hover:text-marigold">browse all shops</Link>
          </p>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md mx-auto block rounded-lg px-4 py-3 text-ink bg-white border border-line outline-none focus:ring-2 focus:ring-marigold"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-1.5 rounded-full text-sm border transition ${
                  category === c
                    ? 'bg-ink text-white border-ink'
                    : 'bg-white text-ink/70 border-line hover:border-ink/40'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-line rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-marigold/30"
          >
            <option value="new">Newest first</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>

        {loading ? (
          <p className="text-center text-ink/50">Loading products...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-ink/50">No products match your search.</p>
        ) : (
          <>
            <p className="text-sm text-ink/50 mb-4">{filtered.length} products</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}