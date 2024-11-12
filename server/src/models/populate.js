// populate/populate.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Import the models (adjust the path as needed)
import User from './User.js'; // Ensure users.js is in the same folder
import Post from './Post.js'; // Ensure posts.js is in the same folder
import { connectDB } from '../config/connectDB.js'; // Correct path to connectDb.js


dotenv.config(); // Check if MongoDB URI is loaded correctly

const uri = process.env.MONGODB_KEY; // Ensure this is set in your .env file

// Function to read JSON data from a file
const readDataFromFile = (filePath) => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

// Function to populate the database
const populateDatabase = async (data) => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Post.deleteMany({});

        // Create users and store the result for later use
        const users = await User.create(data.users);

        // Map users for easy access by email
        const usersMap = {};
        users.forEach(user => {
            usersMap[user.email] = user._id; // Map user emails to their MongoDB _id
        });

         // Ensure posts and comments are properly mapped to the correct user _id
        //  const postsWithAuthor = data.posts.map(post => {
        //     return {
        //         ...post,
        //         author: usersMap[post.author], // Ensure post.author is mapped to the user's _id
        //         comments: post.comments.map(comment => ({
        //             ...comment,
        //             author: usersMap[comment.author], // Map comment.author (email) to _id
        //         })),
        //         upvotes: post.upvotes.map(email => usersMap[email])
        //     };
        // });

        const commentIdsMap = {};

        const postsWithAuthor = await Promise.all(data.posts.map(async (post) => {
            // Map the post's author to user _id
            const postAuthorId = usersMap[post.author];

            // Map the comments and resolve their authors and parentComment references
            const comments = await Promise.all(post.comments.map(async (comment) => {
                const commentAuthorId = usersMap[comment.author];

                // If the comment has a parentComment, resolve it to the correct comment _id
                let parentCommentId = null;
                if (comment.parentComment) {
                    parentCommentId = commentIdsMap[comment.parentComment]; // Resolve parent comment from map
                }

                const newComment = {
                    ...comment,
                    author: commentAuthorId, // Map the comment's author to user _id
                    parentComment: parentCommentId, // Map parentComment to the correct comment _id
                };

                // Store the new comment's ObjectId for future references
                const savedComment = await Post.collection.updateOne(
                    { _id: postAuthorId },
                    { $push: { comments: newComment } }
                );
                commentIdsMap[comment.content] = savedComment.insertedId;

                return newComment;
            }));

            // Map the post's upvotes to user _ids
            const upvotes = post.upvotes.map(email => usersMap[email]);

            return {
                ...post,
                author: postAuthorId, // Map the post's author to user _id
                comments: comments, // Updated comments with correct author and parentComment references
                upvotes: upvotes, // Upvotes mapped to user _ids
            };
        }));

        // Insert posts
        await Post.insertMany(postsWithAuthor);

        console.log('Database populated successfully');
    } catch (error) {
        console.error('Error populating database:', error);
    }
};


// Connect to MongoDB and populate the database
const run = async () => {
    try {
        await connectDB(); // Await the connection to the database
        
        const __dirname = path.resolve(); 
        const dataPath = path.resolve(path.join(__dirname, '../server/src/models/data.json') ); 
        const data = readDataFromFile(dataPath);

        // Populate the database with the data
        await populateDatabase(data);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
        // Ensure this is awaited
        await mongoose.connection.close();
    }
};

run();
