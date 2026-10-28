import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);

  const loadVendors = () => {
    API.get('/auth/vendors').then((res) => setVendors(res.data));
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/auth/vendors/${id}/status`, { status });
    loadVendors();
  };

  const statusColor = {
    approved: 'text-teal',
    pending: 'text-marigold-dark',
    rejected: 'text-clay',
  };

  return (
    <div>
      <h2 className="font-display text-2xl text-ink mb-6">Vendors</h2>
      <div className="space-y-3">
        {vendors.map((v) => (
          <div key={v._id} className="bg-white border border-line rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="font-medium text-ink">{v.storeName || v.name}</p>
              <p className="text-sm text-ink/50">{v.email}</p>
              <p className={`text-sm font-medium capitalize ${statusColor[v.vendorStatus]}`}>{v.vendorStatus}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => updateStatus(v._id, 'approved')}
                className="bg-teal text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal/90 transition">
                Approve
              </button>
              <button onClick={() => updateStatus(v._id, 'rejected')}
                className="bg-clay text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-clay/90 transition">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}