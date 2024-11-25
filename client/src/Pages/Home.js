import { React, useState, useEffect } from "react";
import axios from 'axios';
import PostModal from "../Components/Modals/Post Modal";
import { FaRegComment, FaHeart, FaRegHeart, FaRegShareFromSquare } from "react-icons/fa6";

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

    // Helper function to render tags
    const renderTags = (tags) => {
        if (!tags) return null;
        const { descriptiveTag, departmentTag, campusTag, nsfw } = tags;

        return (
            <div className="post-tags">
                {descriptiveTag && <span className="tag descriptiveTag">{descriptiveTag}</span>}
                {campusTag && <span className="tag campusTag">{campusTag}</span>}
                {departmentTag && <span className="tag departmentTag">{departmentTag}</span>}
                {nsfw && <span className="tag nsfwTag">NSFW</span>}
            </div>
        );
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
                                    
                                    {/* Render tags for each post */}
                                    {renderTags(post.tags)}

                                    <div className="interact">
                                        <p onClick={(e) => {
                                            e.stopPropagation();
                                            toggleUpvote(post);
                                        }}>
                                            {post.upvotes ? post.upvotes.length : 0} 
                                            {isUpvote ? <FaHeart /> : <FaRegHeart />}
                                        </p>
                                        <p>{post.comments ? post.comments.length : 0} <FaRegComment /></p>
                                        <p><FaRegShareFromSquare /></p>
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
