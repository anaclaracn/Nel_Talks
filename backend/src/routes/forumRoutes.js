const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');

router.get('/posts', forumController.listPosts); 
router.post('/posts', forumController.createPost); 

module.exports = router;
