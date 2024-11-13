import mongoose from 'mongoose';
import { CommentSchema } from './Comment.js';


const Schema = mongoose.Schema;


const descriptiveTags = ['discussion', 'general', 'announcement', 'memes/fun', 'rants', 'help', 'admission/shifting/transferring', 'rateProf', 'others'];

const campusTags = ['Alangilan', 'ARASOF-Nasugbu', 'Balayan', 'JPLPC-Malvar', 'Lemery', 'Lipa', 'Lobo', 'Mabini', 'Malvar', 'Pablo Borbon', 'Rosario', 'San Juan'];
const departmentTags = ['Engineering', 'Industrial Technology', 'Fine Arts and Design', 'Arts and Science', 'Accountancy', 'Computer Science', 'Law', 'Hospitality', 'Business Administration', 'Education', 'Agriculture', 'Forestry', 'Criminilogy', 'Psychology', 'Development Communication', 'Nursing']; // Add all departments here


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
    tags: {
        descriptiveTag: {
            type: String,
            enum: descriptiveTags, // Enforce predefined descriptive tags
            required: true,
        },
        campusTag: {
            type: String,
            enum: campusTags,
            required: function() { return this.descriptiveTag !== 'others'; } // Campus tag required if descriptiveTag is not 'others'
        },
        departmentTag: {
            type: String,
            enum: departmentTags,
            required: function() { return this.descriptiveTag !== 'others'; } // Department tag required if descriptiveTag is not 'others'
        },
        nsfw: {
            type: Boolean,
            default: false, // Optional NSFW flag
        }
    },
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
