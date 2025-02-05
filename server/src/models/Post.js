import mongoose from 'mongoose';
import { CommentSchema } from './Comment.js';


const Schema = mongoose.Schema;


const descriptiveTags = ['discussion', 'general', 'announcement', 'memes/fun', 'rants', 'help', 'admission/shifting/transferring', 'rateProf', 'others'].map(tag => tag.toLowerCase());

const campusTags = ['Alangilan', 'ARASOF-Nasugbu', 'Balayan', 'JPLPC-Malvar', 'Lemery', 'Lipa', 'Lobo', 'Mabini', 'Malvar', 'Pablo Borbon', 'Rosario', 'San Juan'].map(tag => tag.toLowerCase());
const departmentTags = ['College of Engineering', 'College of Architecture', 'College of Fine Arts, and Design', 'College of Accountancy, Business, Economics, and International Hospitality Management', 'College of Arts and Sciences', 'College of Informatics and Computing Sciences', 'College of Industrial Technology', 'College of Nursing and Allied Health Sciences', 'College of Law', 'College of Agriculture and Forestry', 'College of Teacher Education', 'College of Medicine'].map(tag => tag.toLowerCase()); 



const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 200,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    imageUrl: String,
    tags: {
        descriptiveTag: {
            type: String,
            enum: descriptiveTags,
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
