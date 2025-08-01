const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  subjectName : {
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  day: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  lectureNumber: {
    type: String,
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Lecture', lectureSchema);