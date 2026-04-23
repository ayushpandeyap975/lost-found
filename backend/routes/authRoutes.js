const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      token: generateToken(user._id)
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      _id: user._id, name: user.name, email: user.email,
      token: generateToken(user._id)
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;