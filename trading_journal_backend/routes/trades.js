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
            position,
            entryDate,
            exitDate,
            expirationDate,
            strikePrice,
            quantity,
            fillPrice,
            closePrice,
            fee
        } = req.body;

        if (!symbol || !type || !position || !entryDate || !exitDate || !quantity || !fillPrice || !closePrice || !fee) {
            return res.status(400).json({ msg: 'Please enter all required fields' });
        }

        if (type === 'option' && (!expirationDate || !strikePrice)) {
            return res.status(400).json({ msg: 'Options trades must include expiration date and strike price' });
        }

        // Calculate P/L
        let calculatedPL = (parseFloat(closePrice) * parseInt(quantity)) - (parseFloat(fillPrice) * parseInt(quantity)) - parseFloat(fee);
        
        if (position === 'short') {
            calculatedPL = -calculatedPL;
        }

        // Apply *100 multiplication for options
        if (type === 'option') {
            calculatedPL *= 100;
        }

        // Create a new trade
        const newTrade = new Trade({
            user: req.user.id,
            symbol,
            type,
            position,
            entryDate,
            exitDate,
            expirationDate: type === 'option' ? expirationDate : undefined,
            strikePrice: type === 'option' ? strikePrice : undefined,
            quantity,
            fillPrice,
            closePrice,
            fee,
            pl: calculatedPL.toFixed(2), // Round to 2 decimal places
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

// DELETE a trade by ID
router.delete('/:id', auth, async (req, res) => {
    try {
        const trade = await Trade.findById(req.params.id);

        if (!trade) {
            return res.status(404).json({ msg: 'Trade not found' });
        }

        // Make sure the user owns the trade
        if (trade.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Trade.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Trade removed' });
    } catch (err) {
        console.error('Error occurred:', err.message);

        // Check if the error is related to ObjectId casting
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Trade not found' });
        }

        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});



module.exports = router;
