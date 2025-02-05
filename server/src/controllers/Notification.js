import Post from '../models/Post.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// Get notifications for a specific user
export async function getUserNotifications(req, res) {
    try {
        const { userId } = req.params;

        // Fetch notifications for the user
        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });

        if (!notifications || notifications.length === 0) {
            return res.status(404).json({ message: 'No notifications found for this user.' });
        }

        res.status(200).json({
            message: 'Notifications fetched successfully.',
            notifications: notifications,
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications.', error: error.message });
    }
}

// Create notification for a comment on a post
export async function createCommentNotification(postId, commenterId) {
    try {
        const post = await Post.findById(postId);
        const postAuthor = await User.findById(post.author); // The user being notified

        if (!post || !postAuthor) {
            throw new Error('Post or post author not found.');
        }

        const commenter = await User.findById(commenterId);  // The user who commented

        const message = `${commenter.name} commented on your post: "${post.title}"`;

        const notification = new Notification({
            user: postAuthor._id,  // The user receiving the notification
            type: 'comment',
            message: message,
            relatedPost: postId,
            relatedUser: commenterId,
        });

        await notification.save();
        console.log('Comment notification created:', notification);
    } catch (error) {
        console.error('Error creating comment notification:', error);
    }
}


export async function createUpvoteNotification(postId, upvoterId) {
    try {
        const post = await Post.findById(postId);
        const postAuthor = await User.findById(post.author); // The user being notified

        if (!post || !postAuthor) {
            throw new Error('Post or post author not found.');
        }

        const upvoter = await User.findById(upvoterId);  // The user who upvoted

        const message = `${upvoter.name} upvoted your post: "${post.title}"`;

        const notification = new Notification({
            user: postAuthor._id,  // The user receiving the notification
            type: 'upvote',
            message: message,
            relatedPost: postId,
            relatedUser: upvoterId,
        });

        await notification.save();
        console.log('Upvote notification created:', notification);
    } catch (error) {
        console.error('Error creating upvote notification:', error);
    }
}

// Mark notifications as read for a user
export async function markNotificationsAsRead(req, res) {
    try {
        const { userId } = req.params;

        // Update notifications for the user
        const notifications = await Notification.updateMany(
            { user: userId, read: false },
            { $set: { read: true } }
        );

        res.status(200).json({ message: 'Notifications marked as read.', notifications });
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        res.status(500).json({ message: 'Error marking notifications as read.', error: error.message });
    }
}

