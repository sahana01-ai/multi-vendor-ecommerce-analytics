import { useState } from 'react';
import { Link } from 'react-router-dom';

const TINTS = {
  Electronics: 'bg-teal/15',
  Clothing: 'bg-marigold/25',
  Home: 'bg-clay/15',
  Fitness: 'bg-teal/25',
  Stationery: 'bg-ink/10',
};

export default function ProductCard({ product }) {
  const [failed, setFailed] = useState(false);
  const showImage = product.imageUrl && !failed;

  return (
    <Link
      to={`/product/${product._id}`}
      className="group block bg-white border border-line rounded-xl overflow-hidden hover:border-marigold hover:-translate-y-0.5 transition"
    >
      <div className="aspect-square overflow-hidden">
        {showImage ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={() => setFailed(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className={`w-full h-full flex flex-col items-center justify-center ${TINTS[product.category] || 'bg-canvas'}`}>
            <span className="font-display text-6xl text-ink/70">{product.name.charAt(0)}</span>
            <span className="text-xs text-ink/50 mt-2 tracking-wide uppercase">{product.category}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-teal font-medium mb-1">{product.vendor?.storeName}</p>
        <h3 className="font-display text-lg text-ink mb-1 line-clamp-1">{product.name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-ink font-semibold">₹{product.price}</p>
          {product.avgRating ? (
            <p className="text-sm text-ink/60">
              <span className="text-marigold">★</span> {product.avgRating}
              <span className="text-ink/40"> ({product.reviewCount})</span>
            </p>
          ) : (
            <p className="text-xs text-ink/40">No reviews yet</p>
          )}
        </div>
      </div>
    </Link>
  );
}