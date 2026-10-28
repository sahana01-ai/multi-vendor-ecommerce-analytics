require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const emails = [
  'urbanthreads@test.com',
  'homehearth@test.com',
  'gadgetgarage@test.com',
  'fitfuel@test.com',
  'paperink@test.com',
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const hash = await bcrypt.hash('shop123', 10);
  for (const email of emails) {
    const r = await User.updateOne({ email }, { password: hash, vendorStatus: 'approved' });
    console.log(r.matchedCount ? `Reset: ${email}` : `NOT FOUND: ${email}`);
  }
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });