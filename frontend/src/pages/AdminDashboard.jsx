import { useState } from 'react';
import AdminAnalytics from '../components/AdminAnalytics';
import AdminVendors from '../components/AdminVendors';

export default function AdminDashboard() {
  const [tab, setTab] = useState('analytics');

  const tabs = [
    { key: 'analytics', label: 'Analytics' },
    { key: 'vendors', label: 'Vendors' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl text-ink mb-8">Admin dashboard</h1>

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

      {tab === 'analytics' && <AdminAnalytics />}
      {tab === 'vendors' && <AdminVendors />}
    </div>
  );
}