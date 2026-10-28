import { useState } from 'react';
import VendorAnalytics from '../components/VendorAnalytics';
import VendorProducts from '../components/VendorProducts';
import VendorOrders from '../components/VendorOrders';

export default function VendorDashboard() {
  const [tab, setTab] = useState('analytics');

  const tabs = [
    { key: 'analytics', label: 'Analytics' },
    { key: 'products', label: 'Products' },
    { key: 'orders', label: 'Orders' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl text-ink mb-8">Vendor dashboard</h1>

      <div className="flex gap-2 mb-8 border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              tab === t.key ? 'border-marigold text-ink' : 'border-transparent text-ink/50 hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'analytics' && <VendorAnalytics />}
      {tab === 'products' && <VendorProducts />}
      {tab === 'orders' && <VendorOrders />}
    </div>
  );
}