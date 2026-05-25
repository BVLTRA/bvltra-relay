require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const auth = require('./middleware/auth');
const Note = require('./models/Note');

// JWT library
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => console.log('✅ Connected to the Vault (MongoDB)'))
  .catch(err => console.error('❌ Database connection failed:', err));

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, gridString } = req.body;

    if (!name || !email || !gridString) {
      return res.status(400).json({ error: 'Name, email, and grid password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const newUser = new User({ name, email, gridHash: gridString });
    await newUser.save();

    // Generate the Token
    // Sign the user's unique database ID and set the token to expire in 7 days
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account secured and created successfully!',
      user: {
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt // Added this so React can see it
      },
      token: token // Sending token back
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, gridString } = req.body;

    if (!email || !gridString) {
      return res.status(400).json({ error: 'Email and grid password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or crafting key.' });
    }

    const isMatch = await user.compareGrid(gridString);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or crafting key.' });
    }

    // Generate the Token for returning users
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Authentication successful! Access granted.',
      user: { 
        name: user.name, 
        email: user.email, 
        createdAt: user.createdAt,
        updatedAt: user.updatedAt // Added this so React can see it
      },
      token: token // Sending the real token back
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// UPDATE PROFILE: Modify the user's name
app.put('/api/user/name', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name cannot be empty.' });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId, 
      { name: name },
      { new: true } 
    );

    res.status(200).json({ 
      message: 'Profile updated.',
      user: { 
        name: updatedUser.name, 
        email: updatedUser.email, 
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// --- PROTECTED NOTEBOOK ROUTES ---

// FETCH ALL: Get every note owned by this user, sorted by newest first
app.get('/api/notes', auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId }).sort({ updatedAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes.' });
  }
});

// CREATE NEW: Generate a fresh note document
app.post('/api/notes', auth, async (req, res) => {
  try {
    const { content } = req.body;

    // Auto-generate a title by extracting the first line of the content. 
    // If it's blank, default to 'Untitled'
    const title = content.trim().split('\n')[0].substring(0, 40) || 'Untitled';

    const newNote = new Note({
      userId: req.user.userId,
      title: title,
      content: content
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note.' });
  }
});

// UPDATE EXISTING: Modify a specific note via its unique ID
app.put('/api/notes/:id', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const title = content.trim().split('\n')[0].substring(0, 40) || 'Untitled';

    // Pass the userId into the filter alongside the note ID as a security 
    // stuff so users cannot overwrite notes belonging to someone else.
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { content, title },
      { new: true } // Tells Mongoose to return the freshly updated document
    );

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});