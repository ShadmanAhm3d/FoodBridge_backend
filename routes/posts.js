const express = require('express');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');

const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, image } = req.body;
    const post = new Post({ title, description, image, user: req.userId });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' });
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

module.exports = router;
