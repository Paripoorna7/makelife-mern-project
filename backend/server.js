const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes     = require('./routes/authRoutes');
const donationRoutes = require('./routes/donationRoutes');
const childRoutes    = require('./routes/childRoutes');
const uploadRoutes   = require('./routes/uploadRoutes');
const adoptionRoutes = require('./routes/adoptionRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));

mongoose.connect('mongodb://127.0.0.1:27017/makelife')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log(err));

app.use('/api/auth',      authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/children',  childRoutes);
app.use('/api/upload',    uploadRoutes);
app.use('/api/adoptions', adoptionRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.listen(5000, () => console.log('🚀 Server running on port 5000'));