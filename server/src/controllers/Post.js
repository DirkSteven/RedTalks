import Post from '../models/Post.js'
import User from '../models/User.js';
import { Comment } from '../models/Comment.js'
import { calculatePopularityScore } from '../utils/popularity.js'
import { calculateRelevanceScore } from '../utils/relevance.js'


export async function getAllPosts(req, res) {
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

export async function getRelevantPosts(req, res) {
  try {
    // Fetch all posts
    const posts = await Post.find().populate('comments');  // Include comments if needed

    // Calculate the relevance score for each post
    const postsWithScores = posts.map(post => {
        const relevanceScore = calculateRelevanceScore(post);
        return { post, relevanceScore };
    });

    // Sort posts by relevance score (descending order)
    postsWithScores.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Return the sorted posts
    res.status(200).json(postsWithScores.map(item => ({
        post: item.post,
        relevanceScore: item.relevanceScore
    })));
  } catch (error) {
      console.error('Error fetching posts by relevance:', error);
      res.status(500).json({ message: 'Server error' });
  }
}

export async function getPost(req, res) {
  try {
      const { postId } = req.params;  // Extract postId from request parameters

      // Fetch the post by its ID from the database
      const post = await Post.findById(postId)
          .populate('author', 'name email')  // Optionally populate author fields
          .populate('comments.author', 'name email');  // Optionally populate comment authors

      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      // Return the found post
      res.status(200).json({
          message: 'Post retrieved successfully',
          post
      });
  } catch (error) {
      res.status(500).json({
          message: 'Error retrieving post',
          error: error.message
      });
  }
}


export async function search(req, res) {
  try {
    console.log('/api/posts/search');

    // Extract the query parameter from the request
    const { query } = req.query;  // Search term can be found in req.query.query

    if (!query) {
      return res.status(400).json({ message: 'Search query is required.' });
    }

    // Create a regular expression for case-insensitive search
    const searchRegex = new RegExp(query, 'i');  // 'i' makes it case-insensitive

    // Search in both users and posts
    const users = await User.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex },
      ]
    });

    const posts = await Post.find({
      $or: [
        { title: searchRegex },
        { content: searchRegex },
      ]
    })
    .populate('author', 'name email')  // Optionally populate author details
    .populate('comments.author', 'name email');  // Optionally populate comment authors

    // Return the search results in the response
    return res.status(200).json({
      users,
      posts,
    });

  } catch (error) {
    console.error('Error in /search route:', error);
    res.status(500).json({ message: 'Server error while searching', error: error.message });
  }
}

export async function getPostbyTags(req, res) {
  try {
    console.log('/api/posts/filter'); // This should print to the console if the route is hit

    // Extract query parameters from the request
    const { descriptiveTag, campusTag, departmentTag, nsfw } = req.query;

    // Build the query object based on available tags
    let query = {};

    // Add conditions to the query if the respective tags are provided in the request
    if (descriptiveTag) query['tags.descriptiveTag'] = descriptiveTag;
    if (campusTag) query['tags.campusTag'] = campusTag;
    if (departmentTag) query['tags.departmentTag'] = departmentTag;
    if (nsfw !== undefined) query['tags.nsfw'] = nsfw === 'true';  // Ensure nsfw is a boolean

    console.log('Query Object:', query);  // Check the constructed query in the console

    // Query the database to get posts that match the query
    const posts = await Post.find(query)
      .populate('author')
      .populate('comments.author', 'name email')  // Optional, if you want to include comment authors
      .sort({ createdAt: -1 });  // Optional, if you want to sort the posts by creation date

    // Return the filtered posts in the response
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error in /filter route:', error);
    res.status(500).json({ message: 'Server error while fetching posts by tags', error: error.message });
  }
}


export async function getPopularTags(req, res) {
  try {
    console.log('/api/posts/popular-tags'); // For debugging to ensure the route is hit

    // Aggregation to count occurrences of descriptiveTag, campusTag, and departmentTag
    const popularDescriptiveTags = await Post.aggregate([
      { $group: { _id: "$tags.descriptiveTag", count: { $sum: 1 } } },
      { $sort: { count: -1 } },  // Sort by count in descending order
      { $limit: 10 }  // Limit to the top 10 tags
    ]);

    const popularCampusTags = await Post.aggregate([
      { $group: { _id: "$tags.campusTag", count: { $sum: 1 } } },
      { $sort: { count: -1 } },  // Sort by count in descending order
      { $limit: 10 }  // Limit to the top 10 tags
    ]);

    const popularDepartmentTags = await Post.aggregate([
      { $group: { _id: "$tags.departmentTag", count: { $sum: 1 } } },
      { $sort: { count: -1 } },  // Sort by count in descending order
      { $limit: 10 }  // Limit to the top 10 tags
    ]);

    // Format the response to return the popular tags
    // return res.status(200).json({
    //   popularDescriptiveTags,
    //   popularCampusTags,
    //   popularDepartmentTags,
    // });

    // Combine all the tags into one array
    const combinedTags = [
      ...popularDescriptiveTags,
      ...popularCampusTags,
      ...popularDepartmentTags
    ];

    // Sort the combined array by 'count' in descending order
    combinedTags.sort((a, b) => b.count - a.count);

    // Format the response to return the sorted combined tags
    return res.status(200).json({
      popularTags: combinedTags
    });
  } catch (error) {
    console.error('Error in /popular-tags route:', error);
    res.status(500).json({ message: 'Server error while fetching popular tags', error: error.message });
  }
}


export async function createPost(req, res){
  try {
    const { title, content, author, imageUrl, tags } = req.body;

    // Validate incoming data
    if (!title || !content || !author || !tags || !tags.descriptiveTag) {
        return res.status(400).json({ message: 'Missing required fields: title, content, author, or descriptiveTag' });
    }

    const user = await User.findById(author);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    // If the descriptiveTag is 'others', campusTag and departmentTag are optional
    if (tags.descriptiveTag !== 'others') {
        if (!tags.campusTag || !tags.departmentTag) {
            return res.status(400).json({ message: 'Missing campusTag or departmentTag' });
        }
    }

    // Create a new post instance
    const newPost = new Post({
        title,
        content,
        author,
        imageUrl: imageUrl || '',  // Default to empty string if no image URL provided
        tags: {
            descriptiveTag: tags.descriptiveTag,
            campusTag: tags.campusTag || '',
            departmentTag: tags.departmentTag || '',
            nsfw: tags.nsfw || false, // Default to false if nsfw not provided
        },
        upvotes: []  // Initialize with an empty array of upvotes
    });

    // Save the post to the database
    await newPost.save();

    // Respond with the newly created post
    res.status(201).json({
        message: 'Post created successfully',
        post: newPost
    });
  } catch (error) {
      res.status(500).json({
          message: 'Error creating post',
          error: error.message
      });
  }
}

export async function commentOnPost(req, res) {
    try {
      const postId = req.params.postId;
      const { content, author, parentCommentId } = req.body; // Capture the parentCommentId

      
      // Find the post by ID and populate its comments
      const post = await Post.findById(postId).populate("comments");
      if (!post) {
          return res.status(404).json({ message: "Post not found" });
      }

      // Check if there's a parent comment to reply to
      let parentComment = null;
      if (parentCommentId) {
          parentComment = post.comments.id(parentCommentId); // Find the comment by its ID in the post
          if (!parentComment) {
              return res.status(404).json({ message: "Parent comment not found" });
          }
      }

      await newComment.save(); //delete?

      // Create a new comment
      const newComment = new Comment({
          content,
          author,
          parentComment: parentCommentId || null,  // If no parent comment, this stays null
      });

      // Push the new comment into the post's comments array
      post.comments.push(newComment);
      await post.save();

      return res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
}


export async function upvotePost(req, res){
    try {
        const { postId } = req.params;  // Get postId from the URL params
        const { userId } = req.body;   // Get userId from the request body
    
        // Find the post by its ID
        const post = await Post.findById(postId);
        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }
    
        // Check if the user has already upvoted the post
        if (post.upvotes.includes(userId)) {
          return res.status(400).json({ message: 'You have already upvoted this post' });
        }
    
        // Add the user's ID to the upvotes array
        post.upvotes.push(userId);
    
        // Save the post with the new upvote
        await post.save();
    
        // Respond with the updated post
        res.status(200).json({
          message: 'Post upvoted successfully',
          post: post,
        });
    } catch (error) {
        res.status(500).json({
          message: 'Error upvoting post',
          error: error.message,
        });
    }
      
}

export async function deleteComment(req,res) {
    try {
        const { postId, commentId } = req.params;  // Get postId and commentId from the URL params
    
        // Find the post by its ID
        const post = await Post.findById(postId);
        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }
    
        // Find the comment index by commentId
        const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);
    
        // If the comment is not found, return an error
        if (commentIndex === -1) {
          return res.status(404).json({ message: 'Comment not found' });
        }
    
        // Remove the comment from the comments array
        post.comments.splice(commentIndex, 1);
    
        // Save the updated post
        await post.save();
    
        // Respond with the updated post
        res.status(200).json({
          message: 'Comment deleted successfully',
          post: post,
        });
      } catch (error) {
        res.status(500).json({
          message: 'Error deleting comment',
          error: error.message,
        });
      }
}

export async function downvote(req, res){
    try {
        const { postId } = req.params;  // Get postId from URL params
        const userId = req.body.userId; // Assuming userId is passed in the body (or from authenticated user session)
    
        // Check if userId is provided
        if (!userId) {
          return res.status(400).json({ message: 'User ID is required' });
        }
    
        // Find the post by its ID
        const post = await Post.findById(postId);
        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }
    
        // Check if the user has already upvoted the post
        const upvoteIndex = post.upvotes.indexOf(userId);
    
        // If user hasn't upvoted the post, return an error
        if (upvoteIndex === -1) {
          return res.status(400).json({ message: 'User has not upvoted this post' });
        }
    
        // Remove the user's upvote
        post.upvotes.splice(upvoteIndex, 1);
    
        // Save the updated post
        await post.save();
    
        // Respond with the updated post
        res.status(200).json({
          message: 'Upvote removed successfully',
          post: post,
        });
      } catch (error) {
        res.status(500).json({
          message: 'Error removing upvote',
          error: error.message,
        });
      }
}