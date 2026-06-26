const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  urlCode: { type: String, index: true, unique: true },
  longUrl: String,
  shortUrl: String,
  clicks: { type: Number, required: true, default: 0 },
  date: { type: String, default: Date.now }
});

module.exports = mongoose.model('Url', urlSchema);
