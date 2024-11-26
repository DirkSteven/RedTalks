import React, { useState, useEffect, useContext } from 'react';
import { FaArrowLeft, FaRegComment, FaHeart, FaRegHeart, FaRegShareFromSquare } from 'react-icons/fa6';
import AppContext from '../../Contexts/AppContext'; 
import axios from 'axios';

function PostModal({ post, onClose }) {
  const { user } = useContext(AppContext);
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  // const [upvoted, setUpvoted] = useState(false); // Track upvote status
  // const [upvoteCount, setUpvoteCount] = useState(post.upvotes ? post.upvotes.length : 0);


  useEffect(() => {
    setComments(post.comments);
    // setUpvoteCount(post.upvotes ? post.upvotes.length : 0);
    // setUpvoted(post.upvotes && post.upvotes.includes(user?._id));
  }, [post]);

  const handleCommentChange = (e) => {
    setCommentContent(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentContent) return; // Don't submit empty comments

    if (!user) {
      alert('You must be logged in to post a comment.');
      return;
    }

    const token = localStorage.getItem('token');
  
    if (!token) {
      alert('You must be logged in to post a comment.');
      return;
    }

    try {
      const response = await axios.post(`/api/posts/${post._id}/comment`, {
        content: commentContent,
        author: user._id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Include the token in the headers
        }
      });
      setComments([response.data.comment, ...comments]);
      setCommentContent('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`/api/posts/${post._id}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Send the token for authorization
        },
      });
  
      // Filter out the deleted comment from the comments state
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
  
      alert(response.data.message); // Show success message
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  if (!post) return null; // If no post is available, return null

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
          <div className="comments-list">
            <h4>Comments:</h4>
            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={commentContent}
                onChange={handleCommentChange}
                placeholder="Add your comment..."
                required
              />
              <button type="submit">Post</button>
            </form>

            {comments && comments.length > 0 ? (
              <ul>
                {comments.map((comment) => (
                  <li key={comment._id}>
                    <p>
                      <strong>{comment.author?.name}</strong>: {comment.content}
                      </p>
                      {comment.author?._id === user._id && (
                        <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                      )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    );
}

export default PostModal;
