const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
  },
  date: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);