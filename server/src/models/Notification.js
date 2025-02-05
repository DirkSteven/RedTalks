import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const notificationTypes = ['comment', 'upvote', 'follow', 'mention', 'like']; // You can expand as needed

const NotificationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,  // The user receiving the notification
    },
    type: {
        type: String,
        enum: notificationTypes,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    relatedPost: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: false,  // This will be optional depending on the notification type
    },
    relatedUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,  // This will be optional depending on the notification type
    },
    read: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Notification = mongoose.model('Notification', NotificationSchema);

export default Notification;
