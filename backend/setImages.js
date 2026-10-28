require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const img = (keywords, n) => `https://loremflickr.com/500/500/${keywords}?lock=${n}`;

const images = {
  // Urban Threads
  'Linen Shirt': 'https://images.unsplash.com/photo-1591357037205-166318b51afd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'Denim Jacket': 'https://images.unsplash.com/photo-1772985451338-6bbc32aeedf1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'Cotton Hoodie': 'https://images.unsplash.com/photo-1695013081006-ba8cdc2cc049?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'Jogger Pants': 'https://plus.unsplash.com/premium_photo-1698339571239-8c65d17adab7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'Canvas Cap': 'https://images.unsplash.com/photo-1560774358-d727658f457c?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',

  // Home & Hearth
  'Scented Candle Set': 'https://images.unsplash.com/photo-1720788810349-7e51a042404a?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'Cotton Bedsheet': 'https://media.istockphoto.com/id/1279913217/photo/well-groomed-woman-hands-holding-the-cotton-branch-with-pile-of-folded-bed-sheets-and-blankets.webp?a=1&b=1&s=612x612&w=0&k=20&c=azOyZoLVl2B_Ao8XEogr6HqLzqB6ZfAgmUTMFkKhJ0Q=',
  'Wall Clock': 'https://images.unsplash.com/photo-1558603655-491ecfa8324f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'Cushion Covers':'https://plus.unsplash.com/premium_photo-1676454000663-643ab3995b55?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'Ceramic Planter':'https://images.unsplash.com/photo-1585445490582-9872899757b7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',

  // Gadget Garage
  'Power Bank 10000mAh': 'https://plus.unsplash.com/premium_photo-1761033366849-c50f4a15d4c6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'USB-C Hub': 'https://images.unsplash.com/photo-1760376789487-994070337c76?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'Wireless Earbuds': 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'HD Webcam': 'https://images.unsplash.com/photo-1636569826709-8e07f6104992?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'Phone Stand': 'https://images.unsplash.com/photo-1707651385176-8c7492596164?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',

  // Fit Fuel
  'Resistance Bands': 'https://plus.unsplash.com/premium_photo-1666736569032-8480d5009e70?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'Adjustable Dumbbells':'https://plus.unsplash.com/premium_photo-1672129881087-76646a57d517?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'Skipping Rope': 'https://images.unsplash.com/photo-1589953856582-c9b3cb2f14b3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'Shaker Bottle': 'https://images.unsplash.com/photo-1593188543121-6441d07ad2e5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'Foam Roller': 'https://plus.unsplash.com/premium_photo-1666736569451-121617facc47?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',

  // Paper & Ink
  'Dotted Journal':'https://images.unsplash.com/photo-1654542645844-590f5b8c146a?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'Fountain Pen': 'https://images.unsplash.com/photo-1531087131490-07836ca4341d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'Sticky Notes Pack':'https://media.istockphoto.com/id/1982675606/photo/sticky-notes.webp?a=1&b=1&s=612x612&w=0&k=20&c=tsn20HNttqghipG8YvM947rjIx24AegnuFF2ULJeq5g=',
  'Desk Organizer': 'https://plus.unsplash.com/premium_photo-1683631774729-bdb2f4a2d77c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'Colour Pencil Set':'https://images.unsplash.com/photo-1607081758973-b85919737e26?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const [name, url] of Object.entries(images)) {
    const r = await Product.updateOne({ name }, { imageUrl: url });
    console.log(r.matchedCount ? `Updated: ${name}` : `Not found: ${name}`);
  }
  await mongoose.disconnect();
  console.log('Done');
}

run().catch((e) => { console.error(e); process.exit(1); });