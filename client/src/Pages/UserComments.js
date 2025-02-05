import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaRegComment } from 'react-icons/fa6';
import AppContext from '../Contexts/AppContext';

function UserComments() {
    const { user } = useContext(AppContext);
    const { userId } = useParams();
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        axios.get(`/api/user/${userId}/comments`)
            .then(response => {
                setComments(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user comments:', error);
                setLoading(false);
            });
    }, [user, userId]);

    // Handle navigation to the post detail page
    const handleNavigateToPost = (postId) => {
        navigate(`/post/${postId}`); // Assuming the URL for a post is `/post/:postId`
    };

    return (
        <div className="list">
            {loading ? (
                <p>Loading...</p>
            ) : comments.length > 0 ? (
                comments.map((comment, index) => (
                    <React.Fragment key={comment._id}>
                        <div className="postitem">
                            <p className="postpreview">"{comment.content}"</p>
                            <div className="interact">
                                <p onClick={() => handleNavigateToPost(comment.postId)}>
                                    <FaRegComment /> On: {comment.postTitle || 'Unknown Post'}
                                </p>
                            </div>
                        </div>
                        {index < comments.length - 1 && <div className="divider"></div>}
                    </React.Fragment>
                ))
            ) : (
                <p>No comments found.</p>
            )}
        </div>
    );
}

export default UserComments;