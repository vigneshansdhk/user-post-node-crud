const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const auth = require("../middleware/auth");

router.post('/register', postController.register);
router.post('/login', postController.login);
router.post('/user-create', auth, postController.userCreate);
router.get('/user-list', auth, postController.userGetAllPost);


module.exports = router;