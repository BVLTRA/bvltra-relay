const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  // Linking this note to a specific user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'Untitled'
  },
  content: {
    type: String,
    default: ''
  }
}, { timestamps: true }); // Automatically generates 'createdAt' and 'updatedAt'

module.exports = mongoose.model('Note', noteSchema);