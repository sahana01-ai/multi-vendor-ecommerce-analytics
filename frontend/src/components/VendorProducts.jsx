import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function VendorProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: '', stock: '', imageUrl: '',
  });

  const loadProducts = () => {
    API.get('/products/vendor/my-products').then((res) => setProducts(res.data));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/products', { ...form, price: Number(form.price), stock: Number(form.stock) });
    setForm({ name: '', description: '', price: '', category: '', stock: '', imageUrl: '' });
    setShowForm(false);
    loadProducts();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await API.delete(`/products/${id}`);
    loadProducts();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-2xl text-ink">My products</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-ink text-white px-5 py-2.5 rounded-lg font-medium hover:bg-ink/90 transition"
        >
          {showForm ? 'Cancel' : '+ Add product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-line rounded-xl p-6 mb-8 grid grid-cols-2 gap-4">
          <input name="name" placeholder="Product name" value={form.name} onChange={handleChange}
            className="border border-line rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-marigold/20 focus:border-marigold col-span-2" required />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange}
            className="border border-line rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-marigold/20 focus:border-marigold" required />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange}
            className="border border-line rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-marigold/20 focus:border-marigold" required />
          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange}
            className="border border-line rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-marigold/20 focus:border-marigold" required />
          <input name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange}
            className="border border-line rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-marigold/20 focus:border-marigold" />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange}
            className="border border-line rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-marigold/20 focus:border-marigold col-span-2" rows="2" />
          <button type="submit" className="bg-marigold text-ink px-6 py-2.5 rounded-lg font-medium hover:bg-marigold-dark transition col-span-2">
            Save product
          </button>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p._id} className="bg-white border border-line rounded-xl overflow-hidden">
            <img src={p.imageUrl || 'https://via.placeholder.com/300'} alt={p.name} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-medium text-ink mb-1">{p.name}</h3>
              <p className="text-ink/60 text-sm mb-1">₹{p.price} · {p.stock} in stock</p>
              <button onClick={() => handleDelete(p._id)} className="text-clay text-sm hover:underline mt-2">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}