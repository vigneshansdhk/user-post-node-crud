const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');

router.post('/register',postController.register);
router.post('/login',postController.login);


module.exports = router;