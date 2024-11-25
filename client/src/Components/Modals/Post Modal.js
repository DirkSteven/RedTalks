import React from 'react';
import { FaArrowLeft, FaRegComment, FaHeart, FaRegHeart, FaRegShareFromSquare } from 'react-icons/fa6';

function PostModal({ post, onClose }) {
    if (!post) return null; 

    return (
        <div className="postmodal-overlay" onClick={onClose}> 
            <FaArrowLeft className="modalClose" onClick={onClose}/>
            <div className="postmodal-content" onClick={(e) => e.stopPropagation()}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <div className="interact">
                    <p>
                        {post.upvotes ? post.upvotes.length : 0} 
                        <FaRegHeart/>
                    </p>
                    <p>{post.comments ? post.comments.length : 0} <FaRegComment/> </p>
                    <p><FaRegShareFromSquare/></p>
                 </div>
                {post.comments && post.comments.length > 0 ? (
                    <div className="comments-list">
                        <h4>Comments:</h4>
                        <div className='addComment'>
                        <input type='text' placeholder='Add comment'></input>
                        <button>post</button>
                        </div>
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
