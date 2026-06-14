const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// this is route becuase like only four apis thatwhy i havent added controller it is managable in route folder 
// Create post
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;
    const imageUrl = req.file ? req.file.path : '';

    if (!text && !imageUrl)
      return res.status(400).json({ message: 'Post must have text or image' });

    const post = await Post.create({
      author: {
        userId: req.user.userId,
        username: req.user.username,
        name: req.user.name
      },
      text: text || '',
      imageUrl
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all posts for feed
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// like/unlike toggle
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likes.find(
      l => l.userId.toString() === req.user.userId
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        l => l.userId.toString() !== req.user.userId
      );
    } else {
      post.likes.push({
        userId: req.user.userId,
        username: req.user.username,
        name: req.user.name
      });
    }

    await post.save();
    res.json({ likes: post.likes, likesCount: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// add comment
router.post('/:id/comment', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment cannot be empty' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = {
      userId: req.user.userId,
      username: req.user.username,
      name: req.user.name,
      text
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json({
      comments: post.comments,
      commentsCount: post.comments.length
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;