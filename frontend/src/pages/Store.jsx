import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Store() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get('/auth/stores').then((res) => setStore(res.data.find((s) => s._id === id) || null));
    API.get('/products', { params: { vendor: id } }).then((res) => setProducts(res.data));
  }, [id]);

  return (
    <div>
      <div className="bg-ink text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-marigold flex items-center justify-center font-display text-3xl text-ink">
            {store?.storeName?.charAt(0) || '?'}
          </div>
          <div>
            <h1 className="font-display text-4xl">{store?.storeName || 'Shop'}</h1>
            <p className="text-white/60 text-sm mt-1">
              {products.length} products ·{' '}
              <Link to="/stores" className="underline hover:text-marigold">all shops</Link>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {products.length === 0 ? (
          <p className="text-center text-ink/50">This shop has no products yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}