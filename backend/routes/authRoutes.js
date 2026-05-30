const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'makelife_secret_key_2024';

// In-memory store for reset codes (keyed by email)
// Fine for single-instance local/Replit use; swap for Redis/DB in multi-instance prod
const resetCodes = {};

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

/* ── POST /api/auth/forgot-password ── */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ error: 'No account found with this email.' });

    // Generate a 6-digit code, store with 15-min expiry
    const code = String(Math.floor(100000 + Math.random() * 900000));
    resetCodes[email.toLowerCase().trim()] = { code, expires: Date.now() + 15 * 60 * 1000 };

    // Return code in response (no email service — admin/dev flow)
    res.json({ message: 'Reset code generated.', code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── POST /api/auth/verify-reset-code ── */
router.post('/verify-reset-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: 'Email and code are required.' });

    const entry = resetCodes[email.toLowerCase().trim()];
    if (!entry) return res.status(400).json({ error: 'No reset code found. Please request a new one.' });
    if (Date.now() > entry.expires) {
      delete resetCodes[email.toLowerCase().trim()];
      return res.status(400).json({ error: 'Reset code has expired. Please request a new one.' });
    }
    if (String(entry.code) !== String(code)) {
      return res.status(400).json({ error: 'Invalid code. Please try again.' });
    }

    res.json({ message: 'Code verified.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── POST /api/auth/reset-password ── */
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) return res.status(400).json({ error: 'Email, code and new password are required.' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const entry = resetCodes[email.toLowerCase().trim()];
    if (!entry) return res.status(400).json({ error: 'No reset code found. Please request a new one.' });
    if (Date.now() > entry.expires) {
      delete resetCodes[email.toLowerCase().trim()];
      return res.status(400).json({ error: 'Reset code has expired. Please request a new one.' });
    }
    if (String(entry.code) !== String(code)) {
      return res.status(400).json({ error: 'Invalid code.' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { password: hashed }
    );

    delete resetCodes[email.toLowerCase().trim()];
    res.json({ message: 'Password reset successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Legacy aliases ── */
router.post('/register', (req, res, next) => { req.url = '/signup'; router.handle(req, res, next); });
router.post('/login',    (req, res, next) => { req.url = '/signin'; router.handle(req, res, next); });

module.exports = router;
