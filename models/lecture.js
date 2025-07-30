const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  teacher: String,
  day: String,
  slot: String
}, { timestamps: true });

module.exports = mongoose.model('Lecture', lectureSchema);