
const router = require('express').Router();
const User = require('../models/User');

router.post('/signup', async (req,res)=>{
  const user = await User.create(req.body);
  res.json(user);
});

router.post('/signin', async (req,res)=>{
  const user = await User.findOne({email:req.body.email});
  res.json(user);
});

// Admin signin — used by the admin portal
router.post('/admin/signin', async (req, res) => {
  const { username, password } = req.body;

  // Hardcoded fallback admin credentials
  const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@makelife.org';

  const isUsernameMatch = username === ADMIN_USER || username === ADMIN_EMAIL;

  if (isUsernameMatch && password === ADMIN_PASS) {
    return res.json({
      token: 'admin-token-' + Date.now(),
      admin: { name: 'Admin', email: ADMIN_EMAIL, role: 'admin' }
    });
  }

  return res.status(401).json({ error: 'Invalid credentials.' });
});

module.exports = router;
