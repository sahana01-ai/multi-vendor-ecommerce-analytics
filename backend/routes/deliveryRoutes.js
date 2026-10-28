const express = require('express');
const router = express.Router();
const { FREE_ABOVE, areas, findArea } = require('../config/deliveryAreas');

// All areas we deliver to
router.get('/areas', (req, res) => {
  res.json({ freeAbove: FREE_ABOVE, areas });
});

// Check one pincode
router.get('/check', (req, res) => {
  const pin = String(req.query.pincode || '').trim();
  if (!/^\d{6}$/.test(pin)) {
    return res.status(400).json({ serviceable: false, message: 'Enter a valid 6-digit pincode.' });
  }
  const area = findArea(pin);
  if (!area) {
    return res.json({ serviceable: false, message: "Sorry, we don't deliver to this pincode yet." });
  }
  res.json({
    serviceable: true,
    city: area.city,
    state: area.state,
    fee: area.fee,
    days: area.days,
    freeAbove: FREE_ABOVE,
  });
});

module.exports = router;