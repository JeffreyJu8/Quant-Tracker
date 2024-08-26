const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TradeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    symbol: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['stock', 'option'] 
    },
    position: {
        type: String,
        required: true,
        enum: ['long', 'short'] 
    },
    entryDate: {
        type: Date,
        required: true
    },
    exitDate: {
        type: Date,
        required: true
    },
    expirationDate: {
        type: Date, // Required only for options
    },
    strikePrice: {
        type: Number, // Required only for options
    },
    quantity: {
        type: Number,
        required: true
    },
    fillPrice: {
        type: Number,
        required: true
    },
    closePrice: {
        type: Number,
        required: true
    },
    fee: {
        type: Number,
        required: true
    },
    pl: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Trade', TradeSchema);
