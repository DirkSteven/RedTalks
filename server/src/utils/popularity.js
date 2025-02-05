// utils/popularity.js

// export function calculatePopularityScore(post) {
//     const upvoteWeight = 1;
//     const commentWeight = 0.5;
//     const recencyWeight = 0.1; // Optional, adjust to your needs

//     const now = new Date();
//     const postAgeInDays = (now - post.createdAt) / (1000 * 60 * 60 * 24); // Post age in days

//     // Adjust the recency score, give a penalty for older posts (this is just an example)
//     const recencyScore = Math.max(0, 30 - postAgeInDays) * recencyWeight;

//     // Calculate the final popularity score
//     const popularityScore = (
//         (post.upvotes.length * upvoteWeight) + 
//         (post.comments.length * commentWeight) + 
//         recencyScore
//     );

//     return popularityScore;
// }


export function calculatePopularityScore(post) {
    const upvoteWeight = 1;
    const commentWeight = 0.5;
    const recencyWeight = 0.1;

    const now = new Date();
    const postAgeInSeconds = (now - post.createdAt) / 1000; // Age in seconds
    const postAgeInDays = postAgeInSeconds / (60 * 60 * 24); // Age in days
    
    // const totalVotes = post.upvotes.length + post.downvotes.length;
    const upvotes = post.upvotes.length;
    // const downvotes = post.downvotes.length;
    // const totalVotes = upvotes;

    // Hot Score Algorithm (decaying with time)
    // const hotScore = (upvotes - downvotes) / Math.pow(postAgeInSeconds + 2, 1.5);
    const hotScore = upvotes / Math.pow(postAgeInSeconds + 2, 1.5);
    // number of upvotes by the age of the post (in seconds), with a small constant (+2) added to avoid division by zero when a post is very recent.
    // The Math.pow(..., 1.5) part introduces a decay function, where the post's "hotness" decays faster as it ages (with the exponent 1.5). This means that older posts lose their popularity score more quickly, making newer posts more relevant in terms of popularity.

    // Wilson Score (Confidence Interval for Proportions)
    // const z = 1.96; // For 95% confidence
    // const p = upvotes / totalVotes; // Proportion of upvotes
    // const n = totalVotes; // Total number of votes
    // const wilsonScore = (p + (Math.pow(z, 2) / (2 * n)) - z * Math.sqrt((p * (1 - p) + Math.pow(z, 2) / (4 * n)) / n)) / (1 + Math.pow(z, 2) / n);
    const wilsonScore = upvotes / upvotes;
    // percentage of upvotes in a voting system; account for both the number of votes and the proportion of positive votes
    // 100% upvoted

    // Calculate the recency score
    const recencyScore = Math.max(0, 30 - postAgeInDays) * recencyWeight;
    // gives newer posts a higher score; subtracts it from 30 (days) applies the recencyWeight;
    // Posts that are more recent (i.e., younger than 30 days) will have a positive recency score. Older posts will have a score of 0, effectively removing the recency effect.

    // Combine the scores
    const finalScore = hotScore + wilsonScore * upvoteWeight + post.comments.length * commentWeight + recencyScore;

    return finalScore;
}



// Hot Score = (upvotes - downvotes) / (post_age_in_seconds + 2)^s
//  Reddit-style systems to determine how "hot" a post is, and it's typically based on a combination of upvotes, post age, and sometimes comment count. 
// will focus on the positive votes and the recency of the post.
// Hot Score = upvotes / (post_age_in_seconds + 2)^s


// Wilson Score = (p + z^2 / (2n) - z * sqrt((p * (1 - p) + z^2 / (4n)) / n)) / (1 + z^2 / n)
// calculate the confidence of a vote proportion (like the percentage of upvotes in a post). It's often used in rating or voting systems to take into account both the number of votes and the proportion of positive votes. 
// Wilson Score = p
// p is the proportion of upvotes (upvotes / upvotes) — effectively, it will always be 1 if we only have upvotes.

// Hot Score:

// We're no longer subtracting downvotes, so the Hot Score now just considers the number of upvotes divided by the age of the post (with the +2 in the denominator to avoid division by zero).
// The factor 1.5 in the decay function controls how fast posts lose their score with age. You can adjust this factor as needed to control the "decay" of older posts.
// Wilson Score:

// Since we have no downvotes, the Wilson Score will always be 1 when there are upvotes. This might seem redundant, but we keep it here to preserve the structure in case you want to add more complexity later.
// If you wanted a more meaningful Wilson Score for posts with a small number of upvotes, you could add logic to calculate it based on the proportion of upvotes to total possible votes or something similar.
// Recency:

// The recency score still applies and decays for older posts. We give newer posts a higher score.
// Final Score:

// The final score is a combination of the Hot Score, Wilson Score (always 1), comment count, and recency score. You can adjust the weights (upvoteWeight, commentWeight, and recencyWeight) based on how important you want each factor to be in the final score.