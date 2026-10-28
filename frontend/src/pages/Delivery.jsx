import { useState, useEffect } from 'react';
import API from '../api/axios';
import DeliveryCheck from '../components/DeliveryCheck';

export default function Delivery() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get('/delivery/areas').then((res) => setData(res.data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl text-ink mb-2">Delivery areas</h1>
      <p className="text-ink/60 mb-8">
        We deliver to these cities. {data && `Delivery is free on item totals of ₹${data.freeAbove} and above.`}
      </p>

      <div className="bg-white border border-line rounded-xl p-5 mb-8">
        <p className="font-medium text-ink mb-2">Check your pincode</p>
        <DeliveryCheck />
      </div>

      {!data ? (
        <p className="text-ink/50">Loading...</p>
      ) : (
        <div className="bg-white border border-line rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-canvas text-left text-ink/60">
              <tr>
                <th className="px-5 py-3 font-medium">City</th>
                <th className="px-5 py-3 font-medium">State</th>
                <th className="px-5 py-3 font-medium">Pincodes</th>
                <th className="px-5 py-3 font-medium">Delivery time</th>
                <th className="px-5 py-3 font-medium">Fee</th>
              </tr>
            </thead>
            <tbody>
              {data.areas.map((a) => (
                <tr key={a.city} className="border-t border-line">
                  <td className="px-5 py-3 text-ink font-medium">{a.city}</td>
                  <td className="px-5 py-3 text-ink/70">{a.state}</td>
                  <td className="px-5 py-3 text-ink/70">{a.prefixes.map((p) => `${p}xxx`).join(', ')}</td>
                  <td className="px-5 py-3 text-ink/70">{a.days}</td>
                  <td className="px-5 py-3 text-ink/70">₹{a.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}