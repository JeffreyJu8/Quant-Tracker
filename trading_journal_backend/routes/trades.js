const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Trade = require('../models/Trade');

// Add a new trade
router.post('/', auth, async (req, res) => {
    try {
        const {
            symbol, 
            type, 
            entryDate, 
            exitDate, 
            expirationDate, 
            strikePrice, 
            quantity, 
            fillPrice, 
            closePrice, 
            fee, 
            pl
        } = req.body;

        if (!symbol || !type || !entryDate || !exitDate || !quantity || !fillPrice || !closePrice || !fee) {
            return res.status(400).json({ msg: 'Please enter all required fields' });
        }

        if (type === 'option' && (!expirationDate || !strikePrice)) {
            return res.status(400).json({ msg: 'Options trades must include expiration date and strike price' });
        }

        // Create a new trade
        const newTrade = new Trade({
            user: req.user.id,
            symbol,
            type,
            entryDate,
            exitDate,
            expirationDate: type === 'option' ? expirationDate : undefined,
            strikePrice: type === 'option' ? strikePrice : undefined,
            quantity,
            fillPrice,
            closePrice,
            fee,
            pl,
        });

        const trade = await newTrade.save();
        res.json(trade);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.post('/trades', async (req, res) => {
    try {
        const { symbol, type, entryDate, exitDate, expirationDate, strikePrice, quantity, fillPrice, closePrice, fee, pl } = req.body;
        
        // Create a new trade
        const newTrade = new Trade({
            symbol,
            type,
            entryDate,
            exitDate,
            expirationDate,
            strikePrice,
            quantity,
            fillPrice,
            closePrice,
            fee,
            pl,
        });
        
        const trade = await newTrade.save();
        res.json(trade);
    } catch (err) {
        console.error(err.message); // Log the error to the console
        res.status(500).send('Server Error'); // Respond with a 500 status code and a message
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
