// utils/popularity.js

export function calculatePopularityScore(post) {
    const upvoteWeight = 1;
    const commentWeight = 0.5;
    const recencyWeight = 0.1; // Optional, adjust to your needs

    const now = new Date();
    const postAgeInDays = (now - post.createdAt) / (1000 * 60 * 60 * 24); // Post age in days

    // Adjust the recency score, give a penalty for older posts (this is just an example)
    const recencyScore = Math.max(0, 30 - postAgeInDays) * recencyWeight;

    // Calculate the final popularity score
    const popularityScore = (
        (post.upvotes.length * upvoteWeight) + 
        (post.comments.length * commentWeight) + 
        recencyScore
    );

    return popularityScore;
}
