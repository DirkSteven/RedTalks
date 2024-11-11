import Post from '../models/Post.js'
import { calculatePopularityScore } from '../utils/popularity.js'

export async function getPosts(req, res) {
    try {
        const posts = await Post.find()
        .populate('author', 'name email') // Populate author details
        .populate('comments.author', 'name email') // Populate comment authors
        .sort({ createdAt: -1 });  // Sort by creation date, most recent first
  
      // Return the posts as JSON
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
};


export async function getPopularPosts(req, res) {
    // Popularity Score = (Upvote Count * upvoteWeight) + (Comment Count * commentWeight) + (Recency Factor * recencyWeight)
    try {
        // Get all posts from the database
        const posts = await Post.find()
          .populate('author', 'name email')  // Populate author details (optional)
          .populate('comments.author', 'name email')  // Populate comment authors (optional)
          .sort({ createdAt: -1 });  // Sort posts by creation date (you can adjust this sorting logic based on your needs)

        // Calculate the popularity score for each post
        const postsWithPopularity = posts.map(post => ({
          ...post.toObject(),
          popularityScore: calculatePopularityScore(post), // Assuming this function calculates the score
        }));

        // Sort posts by popularity score in descending order
        const sortedPosts = postsWithPopularity.sort((a, b) => b.popularityScore - a.popularityScore);

        // Send the sorted posts as a JSON response
        return res.status(200).json(sortedPosts);
    } catch (error) {
        console.error('Error fetching popular posts:', error);
        // Send an error response
        return res.status(500).json({ message: 'Error fetching popular posts', error: error.message });
    }
};
