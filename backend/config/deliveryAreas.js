const FREE_ABOVE = 999; // free delivery when the items total is at least this

const areas = [
  { city: 'Chennai', state: 'Tamil Nadu', prefixes: ['600', '601', '602', '603'], fee: 49, days: '1-2 days' },
  { city: 'Coimbatore', state: 'Tamil Nadu', prefixes: ['641'], fee: 59, days: '2-3 days' },
  { city: 'Madurai', state: 'Tamil Nadu', prefixes: ['625'], fee: 59, days: '2-3 days' },
  { city: 'Tiruchirappalli', state: 'Tamil Nadu', prefixes: ['620'], fee: 59, days: '2-3 days' },
  { city: 'Bengaluru', state: 'Karnataka', prefixes: ['560'], fee: 79, days: '2-4 days' },
  { city: 'Hyderabad', state: 'Telangana', prefixes: ['500'], fee: 79, days: '2-4 days' },
  { city: 'Kochi', state: 'Kerala', prefixes: ['682'], fee: 79, days: '2-4 days' },
  { city: 'Mumbai', state: 'Maharashtra', prefixes: ['400', '401'], fee: 99, days: '3-5 days' },
  { city: 'Pune', state: 'Maharashtra', prefixes: ['411'], fee: 99, days: '3-5 days' },
  { city: 'Delhi', state: 'Delhi', prefixes: ['110'], fee: 99, days: '3-5 days' },
];

function findArea(pincode) {
  const pin = String(pincode || '').trim();
  if (!/^\d{6}$/.test(pin)) return null;
  return areas.find((a) => a.prefixes.some((p) => pin.startsWith(p))) || null;
}

module.exports = { FREE_ABOVE, areas, findArea };