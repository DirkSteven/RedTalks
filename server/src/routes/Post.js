import { Router } from 'express';
import * as postController from '../controllers/Post.js'

const router = Router();

router.get('/', postController.getPosts);

router.get('/popular', postController.getPopularPosts);

export default router;