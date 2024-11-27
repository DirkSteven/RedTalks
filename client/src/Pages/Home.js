import { React, useState, useEffect, useContext } from "react";
import axios from 'axios';
import PostModal from "../Components/Modals/Post Modal";
import { FaRegComment, FaHeart, FaRegHeart, FaRegShareFromSquare } from "react-icons/fa6";
import AppContext from '../Contexts/AppContext'; 

function Home() {
    const { user } = useContext(AppContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [upvotedPosts, setUpvotedPosts] = useState({});  // Keep track of upvoted posts by postId
    const [refreshPosts, setRefreshPosts] = useState(false); // State to trigger re-fetch


    useEffect(() => {
        setLoading(true);
        // Fetch posts from the backend API
        axios.get('api/posts')
            .then(response => {
                console.log(response.data);  // Log the response to inspect its structure
                const postsData = Array.isArray(response.data) ? response.data : [];
                setPosts(postsData);

                const upvotedPosts = postsData.reduce((acc, post) => {
                    if (post.upvotes && post.upvotes.includes(user._id)) {
                        acc[post._id] = true;
                    }
                    return acc;
                }, {});
                setUpvotedPosts(upvotedPosts);    

                setLoading(false);  // Set loading to false after fetching data
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                setLoading(false);  // Set loading to false in case of error
            });
    }, [user, refreshPosts]);

    const toggleUpvote = (postId) => {
        if (!user) {
            alert('You must be logged in to upvote.');
            return;
          }

        const isUpvoted = upvotedPosts[postId] || false;
    
        // Ensure that token exists
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to upvote.');
            return;
        }
    
        // Set the URL based on whether the post is currently upvoted
        const url = isUpvoted
            ? `/api/posts/${postId}/downvote`   // If already upvoted, send DELETE request (downvote)
            : `/api/posts/${postId}/upvote`;    // Otherwise, send POST request (upvote)
    
        // Determine the HTTP method (POST for upvote, DELETE for downvote)
        const method = isUpvoted ? 'delete' : 'post';
    
        // Send the request to the backend
        axios({
            method,  // Use POST or DELETE depending on the action
            url,
            headers: {
                Authorization: `Bearer ${token}`,
                 // Add token for authorization if needed
            },
            data: { userId: user._id } 
        })
        .then((response) => {
            // Get the updated post object from the response
            const updatedPost = response.data.post; // Assuming the updated post is returned in response.data.post

            // Update the posts state with the new upvote count and status
            setPosts(prevPosts => {
                return prevPosts.map(post => {
                    if (post._id === postId) {
                        return updatedPost; // Replace the post with the updated one
                    }
                    return post;
                });
            });

            // If upvote/downvote is successful, update local state
            setUpvotedPosts(prevState => ({
                ...prevState,
                [postId]: !isUpvoted,  // Toggle the upvote status
            }));
    
            // Show a message indicating success
            alert(response.data.message || (isUpvoted ? 'Downvoted!' : 'Upvoted!'));
        })
        .catch((error) => {
            console.error('Error toggling upvote:', error.response ? error.response.data : error.message);
            alert('Failed to update upvote status');
        });
    };
    
    // Handle click on a post
    const postClick = (post) => {
        setSelected(post);
    };

    const closePost = () => {
        setSelected(null);
        setRefreshPosts(Date.now()); // Toggle refreshPosts state to trigger re-fetch of posts
    };

    // Helper function to render tags
    const renderTags = (tags) => {
        if (!tags) return null;
        const { descriptiveTag, departmentTag, campusTag, nsfw } = tags;

        return (
            <div className="post-tags">
                {descriptiveTag && <p className="tag descriptiveTag">{descriptiveTag}</p>}
                {campusTag && <p className="tag campusTag">{campusTag}</p>}
                {departmentTag && <p className="tag departmentTag">{departmentTag}</p>}
                {nsfw && <p className="tag nsfwTag">NSFW</p>}
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
                            posts.map(post => {
                                const postId = post._id;  // Ensure you're using _id consistently
                                return (
                                    <div 
                                        className="postitem" 
                                        key={postId} 
                                        onClick={() => postClick(post)}  
                                    >
                                        <h3>{post.title}</h3>
                                        {renderTags(post.tags)}
                                        <p className="postpreview">{post.content}</p>

                                        <div className="interact">
                                            <p onClick={(e) => {
                                                e.stopPropagation();
                                                toggleUpvote(postId);  // Pass the correct ID
                                            }}>
                                                {post.upvotes ? post.upvotes.length : 0} 
                                                {upvotedPosts[postId] ? <FaHeart /> : <FaRegHeart />}
                                            </p>
                                            <p>{post.comments ? post.comments.length : 0} <FaRegComment /></p>
                                            <p><FaRegShareFromSquare /></p>
                                        </div>
                                    </div>
                                );
                            })
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
