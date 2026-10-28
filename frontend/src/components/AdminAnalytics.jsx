import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import API from '../api/axios';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get('/analytics/admin').then((res) => setData(res.data));
  }, []);

  if (!data) return <p className="text-ink/50">Loading analytics...</p>;

  const { summary, revenueOverTime, topVendors } = data;

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-line rounded-xl p-5">
          <p className="text-sm text-ink/50 mb-1">Platform Revenue</p>
          <p className="font-display text-3xl text-ink">₹{summary.totalRevenue}</p>
        </div>
        <div className="bg-white border border-line rounded-xl p-5">
          <p className="text-sm text-ink/50 mb-1">Total Orders</p>
          <p className="font-display text-3xl text-ink">{summary.totalOrders}</p>
        </div>
      </div>

      <div className="bg-white border border-line rounded-xl p-6 mb-8">
        <h3 className="font-display text-xl text-ink mb-4">Platform revenue over time</h3>
        {revenueOverTime.length === 0 ? (
          <p className="text-ink/50 text-sm">No sales yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DDD5C3" />
              <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#E9A23B" strokeWidth={2.5} dot={{ fill: '#16233B' }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white border border-line rounded-xl p-6">
        <h3 className="font-display text-xl text-ink mb-4">Top vendors</h3>
        {topVendors.length === 0 ? (
          <p className="text-ink/50 text-sm">No sales yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topVendors}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DDD5C3" />
              <XAxis dataKey="storeName" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#2F6E63" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}