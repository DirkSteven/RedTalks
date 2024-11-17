import { React, useState, useEffect } from "react";
import axios from 'axios';
import PostModal from "../Components/Modals/Post Modal";

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null)  // Loading state to show loading message

    useEffect(() => {
        // Fetch posts from the backend API
        axios.get('api/posts')
            .then(response => {
                console.log(response.data);  // Log the response to inspect its structure

                // Assuming response.data contains an array of posts with comments included
                const postsData = Array.isArray(response.data) ? response.data : [];

                // Update the state with the fetched posts
                setPosts(postsData);
                setLoading(false);  // Set loading to false after fetching data
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                setLoading(false);  // Set loading to false in case of error
            });
    }, []);

    // Handle click on a post
    const postClick = (post) => {
        setSelected(post);
    };

    const closePost = () => {
        setSelected(null);
    };

    return (
        <>
        {selected === null?(
        <div className="list">
            {loading ? (
                <p>Loading posts...</p>
            ) : posts.length === 0 ? (
                <p>No posts available</p>
            ) : (
                posts.map(post => (
                    <div 
                        className="postitem" 
                        key={post.id} 
                        onClick={() => postClick(post)}  // Add click handler
                    >
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        <div className="interact">
                            <p>{post.upvotes ? post.upvotes.length : 0} upvotes</p>
                            <p>{post.comments ? post.comments.length : 0} comments</p>
                        </div>
                    </div>
                ))
            )}
        </div>
        ) : (
            <PostModal post={selected} onClose={closePost}/>
        )}
        </>
    );
}

export default Home;