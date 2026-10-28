require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

// [name, price, stock, description]
const shops = [
  { owner: 'Ananya R', email: 'urbanthreads@test.com', storeName: 'Urban Threads', category: 'Clothing', items: [
    ['Linen Shirt', 899, 40, 'Breathable linen shirt for warm days.'],
    ['Denim Jacket', 2199, 20, 'Classic mid-wash denim jacket.'],
    ['Cotton Hoodie', 1299, 35, 'Soft fleece-lined everyday hoodie.'],
    ['Jogger Pants', 799, 50, 'Tapered joggers with an elastic waist.'],
    ['Canvas Cap', 349, 80, 'Adjustable washed canvas cap.'],
  ]},
  { owner: 'Karthik M', email: 'homehearth@test.com', storeName: 'Home & Hearth', category: 'Home', items: [
    ['Scented Candle Set', 549, 60, 'Set of three soy wax candles.'],
    ['Cotton Bedsheet', 1199, 30, 'Double bedsheet with two pillow covers.'],
    ['Wall Clock', 799, 25, 'Minimal silent-sweep wall clock.'],
    ['Cushion Covers', 449, 70, 'Pack of four textured cushion covers.'],
    ['Ceramic Planter', 399, 45, 'Glazed planter with drainage tray.'],
  ]},
  { owner: 'Imran S', email: 'gadgetgarage@test.com', storeName: 'Gadget Garage', category: 'Electronics', items: [
    ['Power Bank 10000mAh', 1299, 40, 'Slim fast-charging power bank.'],
    ['USB-C Hub', 1599, 25, '6-in-1 hub with HDMI and card reader.'],
    ['Wireless Earbuds', 1799, 35, 'Bluetooth earbuds with charging case.'],
    ['HD Webcam', 1999, 15, '1080p webcam with built-in microphone.'],
    ['Phone Stand', 299, 100, 'Foldable aluminium phone stand.'],
  ]},
  { owner: 'Divya P', email: 'fitfuel@test.com', storeName: 'Fit Fuel', category: 'Fitness', items: [
    ['Resistance Bands', 599, 60, 'Set of five loop bands with pouch.'],
    ['Adjustable Dumbbells', 1999, 12, 'Pair of 10 kg adjustable dumbbells.'],
    ['Skipping Rope', 249, 90, 'Speed rope with ball-bearing handles.'],
    ['Shaker Bottle', 349, 70, '700 ml leak-proof protein shaker.'],
    ['Foam Roller', 799, 30, 'High-density roller for recovery.'],
  ]},
  { owner: 'Rohan V', email: 'paperink@test.com', storeName: 'Paper & Ink', category: 'Stationery', items: [
    ['Dotted Journal', 349, 80, 'A5 hardcover dotted notebook.'],
    ['Fountain Pen', 699, 40, 'Smooth-writing pen with ink converter.'],
    ['Sticky Notes Pack', 149, 120, 'Pastel sticky notes, 6 pads.'],
    ['Desk Organizer', 899, 25, 'Wooden organizer with phone slot.'],
    ['Colour Pencil Set', 399, 55, '24 pigmented colour pencils.'],
  ]},
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const hash = await bcrypt.hash('shop123', 10);

  for (const shop of shops) {
    if (await User.findOne({ email: shop.email })) {
      console.log(`Skipped (already exists): ${shop.storeName}`);
      continue;
    }
    const vendor = await User.create({
      name: shop.owner, email: shop.email, password: hash,
      role: 'vendor', vendorStatus: 'approved', storeName: shop.storeName,
    });
    await Product.insertMany(
      shop.items.map(([name, price, stock, description]) => ({
        name, price, stock, description, category: shop.category, vendor: vendor._id,
      }))
    );
    console.log(`Created ${shop.storeName} with ${shop.items.length} products`);
  }
  console.log('Done. Every new vendor logs in with password: shop123');
  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });