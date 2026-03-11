const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
console.log('Contact type:', typeof Contact, Contact); // add this

// GET /api/contact/test — verify route works
router.get('/test', (req, res) => {
  res.json({ message: 'Contact route is working!' });
});

// POST /api/contact — Save contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required.' });
    }

    const contact = new Contact({
      name,
      email,
      phone: phone || '',
      message
    });

    await contact.save();
    console.log('📨 Contact message saved:', contact._id);

    res.status(201).json({
      success: true,
      message: 'Message received! We will get back to you soon.'
    });

  } catch (err) {
    console.error('Contact save error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/contact — Get all messages (admin use)
router.get('/', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ submittedAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/contact/:id
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Message not found.' });
    res.json({ success: true, message: 'Message deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;