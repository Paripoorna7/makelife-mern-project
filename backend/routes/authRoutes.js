const router   = require('express').Router();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');

// ── User Model ──────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  fullName:  { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true },
  // reset fields — stored temporarily until password is changed
  resetCode:       { type: String,  default: null },
  resetCodeExpiry: { type: Date,    default: null },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

const JWT_SECRET = process.env.JWT_SECRET || 'makelife_secret_change_in_production';

// ── SIGN UP  POST /api/auth/signup ──────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password)
      return res.status(400).json({ error: 'All fields are required.' });

    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ error: 'An account with this email already exists.' });

    const hashed = await bcrypt.hash(password, 12);
    const user   = await User.create({ fullName, email, password: hashed });
    const token  = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.fullName, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// ── SIGN IN  POST /api/auth/signin ──────────────────────────
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required.' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: 'No account found with this email.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.fullName, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// ── FORGOT PASSWORD  POST /api/auth/forgot-password ─────────
// Generates a 6-digit code and saves it to the user document.
// In production you'd email this code; here it's logged to console
// and also returned in the response so you can test without email setup.
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ error: 'Email is required.' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user)
      return res.status(404).json({ error: 'No account found with this email.' });

    // Generate a 6-digit numeric code
    const code   = Math.floor(100000 + Math.random() * 900000).toString();
    // Code is valid for 15 minutes
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    user.resetCode       = code;
    user.resetCodeExpiry = expiry;
    await user.save();

    // Log to console so you can grab it without an email service
    console.log(`\n🔑 Password reset code for ${email}: ${code}  (expires in 15 min)\n`);

    res.status(200).json({
      message: 'Reset code generated.',
      // ⬇ remove "code" from the response once you wire up a real email service
      code,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// ── VERIFY RESET CODE  POST /api/auth/verify-reset-code ─────
router.post('/verify-reset-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code)
      return res.status(400).json({ error: 'Email and code are required.' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !user.resetCode)
      return res.status(400).json({ error: 'No reset request found for this email.' });

    if (user.resetCode !== String(code))
      return res.status(400).json({ error: 'Invalid code. Please try again.' });

    if (new Date() > user.resetCodeExpiry)
      return res.status(400).json({ error: 'Code has expired. Please request a new one.' });

    res.status(200).json({ message: 'Code verified.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// ── RESET PASSWORD  POST /api/auth/reset-password ───────────
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword)
      return res.status(400).json({ error: 'Email, code and new password are required.' });

    if (newPassword.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !user.resetCode)
      return res.status(400).json({ error: 'No reset request found for this email.' });

    if (user.resetCode !== String(code))
      return res.status(400).json({ error: 'Invalid code.' });

    if (new Date() > user.resetCodeExpiry)
      return res.status(400).json({ error: 'Code has expired. Please request a new one.' });

    // Hash and save the new password, then clear the reset fields
    user.password        = await bcrypt.hash(newPassword, 12);
    user.resetCode       = null;
    user.resetCodeExpiry = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// ── OLD ALIASES (keep for compatibility) ────────────────────
router.post('/register', (req, res, next) => { req.url = '/signup'; router.handle(req, res, next); });
router.post('/login',    (req, res, next) => { req.url = '/signin'; router.handle(req, res, next); });

module.exports = router;