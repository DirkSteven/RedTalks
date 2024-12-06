import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaRegComment } from 'react-icons/fa6';
import AppContext from '../Contexts/AppContext';

function UserComments() {
    const { user } = useContext(AppContext);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        axios.get(`/api/user/${user._id}/comments`)
            .then(response => {
                setComments(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user comments:', error);
                setLoading(false);
            });
    }, [user]);

    return (
        <div className="list">
            <h2>Your Comments</h2>
            {loading ? (
                <p>Loading...</p>
            ) : comments.length > 0 ? (
                comments.map((comment, index) => (
                    <React.Fragment key={index}>
                        <div className="postitem">
                            <p className="postpreview">"{comment.content}"</p>
                            <div className="interact">
                                <p><FaRegComment /> On: {comment.postTitle || 'Unknown Post'}</p>
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
