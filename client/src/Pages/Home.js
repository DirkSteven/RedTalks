import { React, useState, useEffect } from "react";
import axios from 'axios';
import PostModal from "../Components/Modals/Post Modal";
import { FaHeart, FaHeartPulse } from "react-icons/fa6";

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [isUpvote, setIsUpvote] = useState(false);

    useEffect(() => {
        // Fetch posts from the backend API
        axios.get('api/posts')
            .then(response => {
                console.log(response.data);  // Log the response to inspect its structure
                const postsData = Array.isArray(response.data) ? response.data : [];
                setPosts(postsData);
                setLoading(false);  // Set loading to false after fetching data
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                setLoading(false);  // Set loading to false in case of error
            });
    }, []);

    const toggleUpvote = () => {
        setIsUpvote(prevState => !prevState);
    }

    // Handle click on a post
    const postClick = (post) => {
        setSelected(post);
    };

    const closePost = () => {
        setSelected(null);
    };

    return (
        <>
            {selected === null ? (
                <>
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
                                    onClick={() => postClick(post)}  
                                >
                                    <h3>{post.title}</h3>
                                    <p className="postpreview">{post.content}</p>
                                    <div className="interact">
                                        <button onClick={(e) =>{
                                            e.stopPropagation();
                                            toggleUpvote(post);
                                        }}
                                        >
                                            {post.upvotes ? post.upvotes.length : 0} 
                                            {isUpvote ? <FaHeartPulse/> : <FaHeart/>}
                                        </button>
                                        <p>{post.comments ? post.comments.length : 0} comments</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="schinfo">
                        <img alt="School Logo" />
                        <h3>Batangas State University</h3>
                        <p>sch desc</p>
                        <div className="divider"></div>
                        <div className="schSocials">
                            <ul>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                    </div>
                </>
            ) : (
                <PostModal post={selected} onClose={closePost} />
            )}
        </>
    );
}

export default Home;
