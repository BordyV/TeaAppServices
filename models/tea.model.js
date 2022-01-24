const mongoose = require('mongoose');

// sub structrure d'un stock
const stock = mongoose.Schema({
    location: {
        type: String
    },
    dateExp: {
        type: Date
    },
    quantity: {
        type: Number,
        default: 0
    },
});

//structure de donnee d'un thé
const TeaSchema = mongoose.Schema({
    reference: { type: Number, required: true },
    name: { type: String, required: true },
    stocks: [stock],
});

module.exports = mongoose.model('TEA_DATA', TeaSchema, 'TEA_DATA');
