import { Router } from 'express';
import * as postController from '../controllers/Post.js'

const router = Router();

router.get('/', postController.getAllPosts);

router.get('/popular', postController.getPopularPosts);
router.get('/post/:postId', postController.getPost); 

router.post('/create', postController.createPost);

export default router;