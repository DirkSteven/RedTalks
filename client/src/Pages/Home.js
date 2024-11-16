import { React, useState, useEffect } from "react";
import axios from 'axios';

function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Fetch data from the backend API
        axios.get('api/posts')
            .then(response => {
                console.log(response.data);  // Log response to inspect its structure

                // Check if the response data is an array
                if (Array.isArray(response.data)) {
                    setPosts(response.data);
                } else if (response.data && Array.isArray(response.data.posts)) {
                    setPosts(response.data.posts);  // If data is inside a 'posts' key
                } else if (response.data && Array.isArray(response.data.data)) {
                    setPosts(response.data.data);  // If data is inside a 'data' key
                } else {
                    console.error('Unexpected response structure:', response.data);
                    setPosts([]);  // Set empty array to avoid errors
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div className="postlist">
            {posts.length === 0 ? (
                <p>No posts available</p>
            ) : (
                posts.map(post => (
                    <div className="postitem">
                      <div key={post.id}>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                      </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Home;