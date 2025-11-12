const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');

router.post('/posts', forumController.createPost);
router.get('/posts', forumController.listPosts);
router.patch('/posts/:id/status', forumController.updateStatus);

module.exports = router;

