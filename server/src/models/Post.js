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
});

const PostSchema = new Schema({
    title: {
        type: String,
        required: true, // Title is required
    },
    content: {
        type: String,
        required: true, // Content is required
    },
    author: {
        type: Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true, // Author is required
    },
    createdAt: {
        type: Date,
        default: Date.now, // Default to current date
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Default to current date
    },
    imageUrl: String, // Optional image URL
    tags: [String], // Optional array of tags
    comments: [CommentSchema], // Array of comments
    upvotes: [{
        type: Schema.Types.ObjectId, // Array of user IDs who upvoted
        ref: 'User',
    }],
});

// Middleware to update the updatedAt timestamp before saving
PostSchema.pre('save', function(next) {
    this.updatedAt = Date.now(); // Set updatedAt to current date
    next();
});

const Post = mongoose.model('Post', PostSchema);
export default Post;
