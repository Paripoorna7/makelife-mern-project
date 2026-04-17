const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'makelife_secret_key_2024';

/* ── POST /api/auth/signup ── */
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(409).json({ error: 'An account with this email already exists.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName: fullName || '',
      name:     fullName || email.split('@')[0],
      email:    email.toLowerCase().trim(),
      password: hashed,
    });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { _id: user._id, name: user.fullName || user.name, fullName: user.fullName, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── POST /api/auth/signin ── */
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ error: 'No account found with this email.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Incorrect password.' });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { _id: user._id, name: user.fullName || user.name, fullName: user.fullName, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── POST /api/auth/admin/signin ── */
router.post('/admin/signin', async (req, res) => {
  const { username, password } = req.body;
  const ADMIN_USER  = process.env.ADMIN_USERNAME || 'admin';
  const ADMIN_PASS  = process.env.ADMIN_PASSWORD || 'admin123';
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL    || 'admin@makelife.org';

  const isMatch = (username === ADMIN_USER || username === ADMIN_EMAIL) && password === ADMIN_PASS;
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials.' });

  return res.json({
    token: 'admin-token-' + Date.now(),
    admin: { name: 'Admin', email: ADMIN_EMAIL, role: 'admin' }
  });
});

/* ── Legacy aliases ── */
router.post('/register', (req, res, next) => { req.url = '/signup'; router.handle(req, res, next); });
router.post('/login',    (req, res, next) => { req.url = '/signin'; router.handle(req, res, next); });

module.exports = router;
