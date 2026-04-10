require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');


const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// ✅ Logger
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

// ✅ MongoDB Connection (FIXED)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB error:', err));

// ✅ Routes (ONLY ONCE — removed duplicates)
const authRoutes      = require('./routes/authRoutes');
const donationRoutes  = require('./routes/donationRoutes');
const childRoutes     = require('./routes/childRoutes');
const uploadRoutes    = require('./routes/uploadRoutes');
const adoptionRoutes  = require('./routes/adoptionRoutes');
const contactRoutes   = require('./routes/contactRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const memberRoutes    = require('./routes/memberRoutes');
const goodsDonationRoutes = require('./routes/goodsDonationRoutes');

app.use('/api/auth',       authRoutes);
app.use('/api/donations',  donationRoutes);
app.use('/api/children',   childRoutes);
app.use('/api/upload',     uploadRoutes);
app.use('/api/adoptions',  adoptionRoutes);
app.use('/api/contact',    contactRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/members',    memberRoutes);

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.message);
  res.status(500).json({ error: err.message });
});

// ✅ Dynamic PORT (VERY IMPORTANT)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));