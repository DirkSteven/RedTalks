import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaRegComment, FaHeart, FaRegShareFromSquare } from 'react-icons/fa6';
import AppContext from '../Contexts/AppContext';

function UserLikes() {
    const { user } = useContext(AppContext);
    const { userId } = useParams(); 
    const [likedPosts, setLikedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        axios.get(`/api/user/${userId}/upvotes`)
            .then(response => {
                setLikedPosts(response.data || []); // Ensure a fallback to an empty array
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching liked posts:', error);
                setLoading(false);
            });
    }, [user]);

    const renderTags = (tags) => {
        if (!tags) return null;
        return (
            <div className="post-tags">
                {tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                ))}
            </div>
        );
    };

    return (
        <div className="list">
            <h2>Liked Posts</h2>
            {loading ? (
                <p>Loading...</p>
            ) : likedPosts.length > 0 ? (
                likedPosts.map((post, index) => (
                    <React.Fragment key={post._id}>
                        <div className="postitem">
                            <h3>{post.title}</h3>
                            {renderTags(post.tags)}
                            <p className="postpreview">{post.content.substring(0, 100)}...</p>
                            <div className="interact">
                                <p>{post.upvotes?.length || 0} <FaHeart /></p>
                                <p>{post.comments?.length || 0} <FaRegComment /></p>
                                <p><FaRegShareFromSquare /></p>
                            </div>
                        </div>
                        {index < likedPosts.length - 1 && <div className="divider"></div>}
                    </React.Fragment>
                ))
            ) : (
                <p>No liked posts found.</p>
            )}
        </div>
    );
}

export default UserLikes;
