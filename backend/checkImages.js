require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function check(url) {
  try {
    const res = await fetch(url);
    const type = res.headers.get('content-type') || '';
    return res.ok && type.startsWith('image/') ? 'OK  ' : `FAIL (${res.status} ${type})`;
  } catch (e) {
    return `FAIL (${e.message})`;
  }
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const products = await Product.find().select('name imageUrl');
  for (const p of products) {
    if (!p.imageUrl) {
      console.log(`NO LINK  ${p.name}`);
      continue;
    }
    console.log(`${await check(p.imageUrl)}  ${p.name}`);
  }
  await mongoose.disconnect();
}

run();