import { Router } from 'express';
import * as postController from '../controllers/Post.js'

const router = Router();

router.get('/', postController.getAllPosts);

router.get('/popular', postController.getPopularPosts);
router.get('/relevance', postController.getRelevantPosts);
router.get('/:postId', postController.getPost); 
// router.get('/tags', postController.getPostbyTags);

router.post('/create', postController.createPost);
// Invoke-RestMethod -Uri "http://localhost:5000/api/posts/create" -Method Post -Headers @{ "Content-Type" = "application/json" } -Body '{"title": "Exploring the Basics of Git", "content": "Git is a distributed version control system that helps track changes in your codebase. In this post, we will explore basic Git commands and how to set up a repository.", "author": "60d34567f1b2c7d0e1234569", "imageUrl": "http://example.com/git-image.jpg", "tags": {"descriptiveTag": "discussion","campusTag": "Alangilan","departmentTag": "Computer Science","nsfw": false}}'
router.post('/:postId/comment', postController.commentOnPost);
// Invoke-RestMethod -Uri "http://localhost:5000/api/posts/67349cefe9cf1f5fa59aacdc/comment" -Method Post -Headers @{ "Content-Type" = "application/json" } -Body '{    "content": "Great article! This really helped me understand Git better.",    "author": "60d34567f1b2c7d0e1234569"}'
//  Invoke-RestMethod -Uri "http://localhost:5000/api/posts/67349cefe9cf1f5fa59aacdc/comment" -Method Post -Headers @{ "Content-Type" = "application/json" } -Body '{    "content": "I agree with you! This was really insightful.",    "author": "60d34567f1b2c7d0e1234570",    "parentCommentId": "6734a44c4461cf55ecf77fed"}'
router.post('/:postId/upvote', postController.upvotePost);
// Invoke-RestMethod -Uri "http://localhost:5000/api/posts/67349cefe9cf1f5fa59aacdc/upvote" -Method Post -Headers @{ "Content-Type" = "application/json" } -Body '{"userId": "60d34567f1b2c7d0e1234569"}'

router.delete('/:postId/comments/:commentId', postController.deleteComment);
// Invoke-RestMethod -Uri "http://localhost:5000/api/posts/67349cefe9cf1f5fa59aacdc/comments/67349e6728ea9b8ac614ec5c" -Method Delete -Headers @{ "Content-Type" = "application/json" }
router.delete('/:postId/downvote', postController.downvote);
// Invoke-RestMethod -Uri "http://localhost:5000/api/posts/67349cefe9cf1f5fa59aacdc/downvote" -Method Delete -Headers @{    "Content-Type" = "application/json"} -Body '{"userId": "60d34567f1b2c7d0e1234569"}'

export default router;