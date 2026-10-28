import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/auth/stores')
      .then((res) => setStores(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl text-ink mb-2">Shops</h1>
      <p className="text-ink/60 mb-10">Every shop here is run by an independent, admin-approved seller.</p>

      {loading ? (
        <p className="text-ink/50">Loading shops...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((s) => (
            <Link
              key={s._id}
              to={`/store/${s._id}`}
              className="group bg-white border border-line rounded-xl p-6 hover:border-marigold hover:-translate-y-0.5 transition"
            >
              <div className="w-14 h-14 rounded-full bg-marigold/25 flex items-center justify-center font-display text-2xl text-ink mb-4">
                {s.storeName.charAt(0)}
              </div>
              <h3 className="font-display text-xl text-ink mb-1">{s.storeName}</h3>
              <p className="text-sm text-ink/50 mb-4">{s.productCount} products</p>
              <span className="text-sm text-teal font-medium group-hover:underline">Visit shop →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}