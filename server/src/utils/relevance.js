export function calculateRelevanceScore(post) {
    const upvoteWeight = 1;  // Weight for upvotes
    const commentWeight = 0.5;  // Weight for comments
    const alpha = 1.5;  // Decay factor for recency

    const now = new Date();
    const postAgeInDays = (now - post.createdAt) / (1000 * 60 * 60 * 24);  // Age in days

    // Engagement score: upvotes + comments
    const engagementScore = (post.upvotes.length * upvoteWeight) + (post.comments.length * commentWeight);

    // Time decay: penalize posts as they get older
    const timeDecay = 1 / Math.pow(postAgeInDays + 1, alpha);

    // Final relevance score: engagement score adjusted by time decay
    const relevanceScore = engagementScore * timeDecay;

    return relevanceScore;
}
