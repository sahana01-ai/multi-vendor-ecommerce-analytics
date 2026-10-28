import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import DeliveryCheck from '../components/DeliveryCheck';

function Stars({ value }) {
  return (
    <span className="text-marigold">
      {'★'.repeat(value)}
      <span className="text-ink/20">{'★'.repeat(5 - value)}</span>
    </span>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [imgFailed, setImgFailed] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = () => API.get(`/reviews/${id}`).then((res) => setReviews(res.data));

  useEffect(() => {
    API.get(`/products/${id}`).then((res) => setProduct(res.data));
    loadReviews();
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find((item) => item.productId === id);

    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock);
    } else {
      cart.push({
        productId: id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setMessage('Added to cart!');
    setTimeout(() => setMessage(''), 2000);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!rating) {
      setReviewMsg({ type: 'error', text: 'Please choose a star rating.' });
      return;
    }
    setSubmitting(true);
    try {
      await API.post('/reviews', { productId: id, rating, comment });
      setRating(0);
      setComment('');
      setReviewMsg({ type: 'ok', text: 'Thanks! Your review was added.' });
      loadReviews();
    } catch (err) {
      setReviewMsg({ type: 'error', text: err.response?.data?.message || 'Could not post your review.' });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!confirm('Delete your review?')) return;
    await API.delete(`/reviews/${reviewId}`);
    setReviewMsg({ type: '', text: '' });
    loadReviews();
  };

  if (!product) return <p className="text-center mt-20 text-ink/50">Loading...</p>;

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const showImage = product.imageUrl && !imgFailed;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-square bg-white border border-line rounded-xl overflow-hidden">
          {showImage ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-marigold/20">
              <span className="font-display text-8xl text-ink/70">{product.name.charAt(0)}</span>
              <span className="text-xs text-ink/50 mt-2 tracking-wide uppercase">{product.category}</span>
            </div>
          )}
        </div>

        <div>
          <p className="text-teal font-medium mb-2">{product.vendor?.storeName}</p>
          <h1 className="font-display text-4xl text-ink mb-3">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4 text-sm">
            {reviews.length ? (
              <>
                <Stars value={Math.round(avg)} />
                <span className="text-ink/60">{avg.toFixed(1)} · {reviews.length} review{reviews.length > 1 ? 's' : ''}</span>
              </>
            ) : (
              <span className="text-ink/40">No reviews yet</span>
            )}
          </div>

          <p className="text-2xl font-semibold text-ink mb-6">₹{product.price}</p>
          <p className="text-ink/70 mb-6 leading-relaxed">{product.description}</p>

          <p className="text-sm text-ink/50 mb-6">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          {user?.role === 'customer' && (
            <div className="flex items-center gap-4 mb-4">
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(Math.max(1, Number(e.target.value)), product.stock))}
                className="w-20 border border-line rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-marigold"
              />
              <button
                onClick={addToCart}
                disabled={product.stock === 0}
                className="bg-marigold text-ink px-6 py-3 rounded-lg font-medium hover:bg-marigold-dark transition disabled:opacity-40"
              >
                Add to cart
              </button>
            </div>
          )}
          {!user && (
            <p className="text-sm text-ink/60 mb-4">
              <Link to="/login" className="text-teal font-medium hover:underline">Sign in</Link> as a customer to buy this.
            </p>
          )}
          {message && <p className="text-teal text-sm mb-4">{message}</p>}

          <div className="border-t border-line pt-5 mt-4">
            <p className="font-medium text-ink mb-2">Check delivery</p>
            <DeliveryCheck />
            <Link to="/delivery" className="text-xs text-teal hover:underline mt-2 inline-block">
              See all delivery areas
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-16 max-w-2xl">
        <h2 className="font-display text-2xl text-ink mb-6">Reviews</h2>

        {user?.role === 'customer' ? (
          <form onSubmit={submitReview} className="bg-white border border-line rounded-xl p-5 mb-8">
            <p className="font-medium text-ink mb-2">Write a review</p>
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setRating(n)}
                  className={`text-3xl leading-none transition ${n <= rating ? 'text-marigold' : 'text-ink/20 hover:text-marigold/60'}`}
                  aria-label={`${n} star${n > 1 ? 's' : ''}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="3"
              placeholder="What did you think of this product?"
              className="w-full border border-line rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-marigold/20 focus:border-marigold transition"
            />
            {reviewMsg.text && (
              <p className={`text-sm mt-2 ${reviewMsg.type === 'ok' ? 'text-teal' : 'text-clay'}`}>{reviewMsg.text}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="mt-3 bg-ink text-white px-5 py-2.5 rounded-lg font-medium hover:bg-ink/90 transition disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post review'}
            </button>
          </form>
        ) : (
          <p className="text-sm text-ink/60 mb-8">
            {user ? 'Only customers can post reviews.' : (
              <><Link to="/login" className="text-teal font-medium hover:underline">Sign in</Link> as a customer to write a review.</>
            )}
          </p>
        )}

        {reviews.length === 0 ? (
          <p className="text-ink/50">No reviews yet. Be the first to review this product.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="border border-line rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-ink">
                    {r.customer?.name}
                    {r.verifiedPurchase && (
                      <span className="ml-2 text-xs font-normal text-teal bg-teal/10 px-2 py-0.5 rounded-full">
                        Verified purchase
                      </span>
                    )}
                  </span>
                  <Stars value={r.rating} />
                </div>
                {r.comment && <p className="text-ink/70 text-sm">{r.comment}</p>}
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-ink/40">{new Date(r.createdAt).toLocaleDateString()}</p>
                  {user && r.customer?._id === user.id && (
                    <button onClick={() => deleteReview(r._id)} className="text-xs text-clay hover:underline">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}