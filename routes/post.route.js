const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const auth = require("../middleware/auth");

router.post('/register', postController.register);
router.post('/login', postController.login);
router.post('/user-create', auth, postController.userCreate);
router.get('/user-list', auth, postController.userGetAllPost);
router.get('/:postId/edit', auth, postController.userEdit);
router.post('/:postId/update', auth, postController.userUpdate);
router.delete('/:postId/delete', auth, postController.userDelete);




module.exports = router;