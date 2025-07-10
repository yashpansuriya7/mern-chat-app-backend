const express = require('express');
const Message = require('../models/Message');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');



// Save message
router.post('/', async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;
    const msg = await Message.create({ sender, receiver, content });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get messages between two users
router.get('/:user1/:user2',verifyToken, async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ timestamp: 1 }); // sort by time
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
