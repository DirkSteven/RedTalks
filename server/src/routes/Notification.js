import { Router } from 'express';
import * as notifController from '../controllers/Notification.js'
const router = Router();

// Get notifications for a user
router.get('/:userId', notifController.getUserNotifications);

// Mark notifications as read
router.post('/:userId/mark-as-read', notifController.markNotificationsAsRead);

export default router;