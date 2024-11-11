// populate/populate.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Import the models (adjust the path as needed)
import User from './User.js'; // Ensure users.js is in the same folder
import Post from './Post.js'; // Ensure posts.js is in the same folder
import { connectDB } from '../../db/connectDB.js'; // Correct path to connectDb.js


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
        
        // Map users for easy access
        const usersMap = {};
        users.forEach(user => {
            usersMap[user.email] = user._id; // Map user emails to IDs
        });

        // Prepare posts with author and comments
        const postsWithAuthor = data.posts.map(post => ({
            ...post,
            author: usersMap['alice@example.com'], // Assigning Alice as the author
            comments: post.comments.map(comment => ({
                ...comment,
                author: usersMap['bob@example.com'], // Assigning Bob as the author
            }))
        }));

        // Create posts
        await Post.create(postsWithAuthor);

        console.log('Database populated successfully:');
        console.log('Users:', users);
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
