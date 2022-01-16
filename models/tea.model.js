const mongoose = require('mongoose');

//structure de donnee d'un thé
const TeaSchema = mongoose.Schema({
    reference: { type: String, required: true },
    name: { type: String, required: true },
});

module.exports = mongoose.model('TEA_DATA', TeaSchema, 'TEA_DATA');
