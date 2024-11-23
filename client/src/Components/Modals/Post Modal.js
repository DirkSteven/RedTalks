import React from 'react';
import { FaArrowLeft } from 'react-icons/fa6';

function PostModal({ post, onClose }) {
    if (!post) return null; 

    return (
        <div className="postmodal-overlay" onClick={onClose}> 
            <FaArrowLeft className="modalClose" onClick={onClose}/>
            <div className="postmodal-content" onClick={(e) => e.stopPropagation()}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <div className="interact">
                    <p>{post.upvotes ? post.upvotes.length : 0} upvotes</p>
                    <p>{post.comments ? post.comments.length : 0} comments</p>
                </div>
                {post.comments && post.comments.length > 0 ? (
                    <div className="comments-list">
                        <h4>Comments:</h4>
                        <input type='text' className='addComment' placeholder='Add comment'></input>
                        <ul>
                            {post.comments.map((comment) => (
                                <li key={comment.id}>
                                    <p>{comment.content}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>No comments yet.</p>
                )}

            </div>
        </div>
    );
}

export default PostModal;
