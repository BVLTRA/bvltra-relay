const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Structure
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, 
    lowercase: true,
    trim: true
  },
  gridHash: {
    type: String,
    required: true // scrambled version of their crafting grid
  }
}, { timestamps: true }); // Automatically add 'createdAt' and 'updatedAt'

// PROCESS (Pre-save)
// Intercepts the data right BEFORE it saves to the database.
userSchema.pre('save', async function() {
  const user = this;

  if (!user.isModified('gridHash')) return;
  
  const salt = await bcrypt.genSalt(10);
  user.gridHash = await bcrypt.hash(user.gridHash, salt);
});

// Verification
// Will be used during login to check if their grid matches the hash
userSchema.methods.compareGrid = async function(candidateGridString) {
  return bcrypt.compare(candidateGridString, this.gridHash);
};

module.exports = mongoose.model('User', userSchema);