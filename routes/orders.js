const express = require('express');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');

// ... rest of the code remains the same
const router = express.Router();

// Create a new order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { postId, quantity } = req.body;
    const order = new Order({
      user: req.userId,
      post: postId,
      quantity,
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Get user's orders
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).populate('post');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

module.exports = router;
