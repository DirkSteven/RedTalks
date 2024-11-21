import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import * as userController from '../controllers/User.js'
const router = Router();

router.get('/init', userController.initUser);
router.get('/verify-email/:verificationToken', userController.verifyEmail);

router.get('/:userId/posts', userController.getUserPosts);
router.get('/:userId/comments', userController.getUserComments);
router.get('/:userId/upvotes', userController.getUserUpvotes);

router.post('/register', userController.register);  
router.post('/login', userController.login);

// router.post('/request-password-reset', userController.requestPasswordReset);
router.post('/request-verification-code', userController.requestVerificationCode);
router.post('/reset-password-with-code', userController.resetPasswordWithCode);

// router.post('/changepassword', authenticate, userController.resetPasword);

// Route to update user details
router.put('/updateuser', authenticate, userController.updateUser);
// Invoke-RestMethod -Uri "http://localhost:5000/api/user/updateuser" -Method PUT -Headers @{ "Content-Type" = "application/json" } -Body '{"name": "Bobbb Smith", "email": "bob@example.com", "imageUrl": "https://example.com/images/bob.jpg"}'


export default router;