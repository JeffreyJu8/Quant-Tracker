const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Trade = require('../models/Trade');

// Add a new trade
router.post('/', auth, async (req, res) => {
    const { symbol, type, quantity, price } = req.body;

    try {
        const newTrade = new Trade({
            user: req.user.id,
            symbol,
            type,
            quantity,
            price,
        });

        const trade = await newTrade.save();
        res.json(trade);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all trades for a user
router.get('/', auth, async (req, res) => {
    try {
        const trades = await Trade.find({ user: req.user.id }).sort({ date: -1 });
        res.json(trades);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
