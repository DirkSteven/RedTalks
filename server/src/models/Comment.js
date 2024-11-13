import mongoose from 'mongoose';

const Schema = mongoose.Schema;


const CommentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true, // Comment content is required
    },
    createdAt: {
        type: Date,
        default: Date.now, // Default to current date
    },
    parentComment: {
        type: Schema.Types.ObjectId, // Reference to another Comment if this is a reply
        ref: 'Comment', // This allows replies to comments
        default: null, // If this is null, it means this comment is not a reply
    },
});

const Comment = mongoose.model('Comment', CommentSchema); // Defining the Comment model

export { Comment, CommentSchema };