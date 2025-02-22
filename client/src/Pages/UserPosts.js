import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaRegComment, FaHeart, FaRegHeart, FaRegShareFromSquare } from "react-icons/fa6";
import AppContext from '../Contexts/AppContext'; 

function UserPosts() {
    const { user } = useContext(AppContext);
    const { userId } = useParams(); 
    const navigate = useNavigate();  // Initialize navigate for redirection
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [upvotedPosts, setUpvotedPosts] = useState({});  // Keep track of upvoted posts by postId
    const [refreshPosts, setRefreshPosts] = useState(false); // State to trigger re-fetch

    useEffect(() => {
        setLoading(true);
        // Fetch posts from the backend API
        axios.get(`/api/user/${userId}/posts`)
            .then(response => {
                console.log(response.data);  // Log the response to inspect its structure
                const postsData = Array.isArray(response.data) ? response.data : [];
                setPosts(postsData);

                const upvotedPosts = postsData.reduce((acc, post) => {
                    if (post.upvotes && post.upvotes.includes(userId)) {
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

        })
        .catch((error) => {
            console.error('Error toggling upvote:', error.response ? error.response.data : error.message);
            alert('Failed to update upvote status');
        });
    };
    
    // Helper function to render tags
    const renderTags = (tags) => {
        if (!tags) return null;
        const { descriptiveTag, departmentTag, campusTag, nsfw } = tags;
    
        const abbrTags = {
          "College of Engineering":"CoE",
          "College of Architecture":"Archi",
          "College of Fine Arts and Design":"CAFAD",
          "College of Accountancy, Business, Economics, and International Hospitality Management":"CABEIHM",
          "College of Arts and Sciences":"CAS",
          "College of Informatics and Computing Sciences":"CICS",
          "College of Industrial Technology":"CIT",
          "College of Nursing and Allied Health Sciences":"CoNAHS",
          "College of Agriculture and Forestry":"CAF",
          "College of Teacher Education":"CTE",
          "College of Medicine":"Med",
          "college of engineering":"CoE",
          "college of architecture":"Archi",
          "college of fine arts and design":"CAFAD",
          "college of accountancy, business, economics, and international hospitality management":"CABEIHM",
          "college of arts and sciences":"CAS",
          "college of informatics and computing sciences":"CICS",
          "college of industrial technology":"CIT",
          "college of nursing and allied health sciences":"CoNAHS",
          "college of agriculture and forestry":"CAF",
          "college of teacher education":"CTE",
          "college of medicine":"Med"
        };
    
        const shorten = abbrTags[departmentTag] || departmentTag;
    
        return (
          <div className="post-tags">
            {descriptiveTag && <span className="tag descriptiveTag">{descriptiveTag}</span>}
            {campusTag && <span className="tag campusTag">{campusTag}</span>}
            {departmentTag && <span className="tag departmentTag">{shorten}</span>}
            {nsfw && <span className="tag nsfwTag">NSFW</span>}
          </div>
        );
    };

    return (
        <>
            <div className="list">
                {loading ? (
                    <p>Loading posts...</p>
                ) : posts.length === 0 ? (
                    <p>No posts available</p>
                ) : (
                    posts.map((post) => {
                        const postId = post._id;  // Ensure you're using _id consistently
                        return (
                            <React.Fragment key={postId}>
                                <div 
                                    className="postitem" 
                                    key={postId} 
                                    onClick={() => navigate(`/Post/${postId}`)}  // Redirect to the individual post page
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
                                {post !== posts[posts.length - 1] && <div className="divider"></div>}
                            </React.Fragment>
                        );
                    })
                )}
            </div>
        </>
    );
}

export default UserPosts;