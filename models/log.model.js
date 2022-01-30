const mongoose = require('mongoose');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//structure de donnee d'un thé
const LogSchema = mongoose.Schema({
  action: { type: String, required: true }, // action effectuée
  category: { type: String, required: true }, // categorie de l'action
  createdBy: { type: String, required: true },
  message: { type: String, required: true },
  _idOperationDocument: { type: String, required: false }, // exemple _id tea ou user
  commentaire: { type: String, required: false }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});

LogSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('LOG_DATA', LogSchema, 'LOG_DATA');