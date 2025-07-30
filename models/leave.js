const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  teacher: String,
  date: String,
  reason: String
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);