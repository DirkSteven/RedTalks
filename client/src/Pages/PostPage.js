import React, { useState, useEffect, useContext, useCallback } from 'react';
import { FaArrowLeft, FaRegComment, FaHeart, FaRegHeart, FaRegShareFromSquare } from 'react-icons/fa6';
import AppContext from '../Contexts/AppContext'; 
import UserAvatar from '../Assets/UserAvatar.png';
import Sidebar from '../Components/Navigation/Sidebar';
import Header from '../Components/Navigation/Header';
import HomeNav from '../Components/Navigation/HomeNav';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function PostPage() {
  const { user } = useContext(AppContext);
  const [post, setPost] = useState(null);
  const [commentContent, setCommentContent] = useState(''); // Main comment
  const [replyContent, setReplyContent] = useState(''); // Reply content
  const [comments, setComments] = useState([]);
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [parentId, setParentId] = useState(null);
  const [shareStatus, setShareStatus] = useState('');
  const [loading, setLoading] = useState(true);  // Added loading state
  const [error, setError] = useState(null);  // Added error state
  const navigate = useNavigate();
  const { postId } = useParams(); // Extract postId from the URL parameters
  const [sidebar, setSidebar] = useState(false);

  const toggle = () => {
    setSidebar(prevState => !prevState);
  };

  // Fetch the specific post by postId
  const fetchPostData = useCallback(async () => {
    try {
      const response = await axios.get(`/api/posts/${postId}`);
      const fetchedPost = response.data.post;
      setPost(fetchedPost);
      setComments(fetchedPost.comments || []);
      setUpvoted(fetchedPost.upvotes && fetchedPost.upvotes.includes(user?._id));
      fetchUpvoteCount();
      setLoading(false);  // Set loading to false once data is fetched
    } catch (error) {
      console.error('Error fetching post data:', error);
      setError('Failed to fetch post data');
      setLoading(false);  // Set loading to false in case of error
    }
  }, [postId, user?._id]);

  const fetchUpvoteCount = useCallback(async () => {
    try {
      const response = await axios.get(`/api/posts/${postId}/upvote-count`);
      setUpvoteCount(response.data.upvoteCount); // Set upvote count from response
    } catch (error) {
      console.error('Error fetching upvote count:', error);
    }
  }, [postId]);

  useEffect(() => {
    fetchPostData();
  }, [fetchPostData]); // Fetch post data on component mount or postId change

  const handleCommentChange = (e) => {
    setCommentContent(e.target.value); // Set main comment content
  };

  const handleReplyChange = (e) => {
    setReplyContent(e.target.value); // Set reply content
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentContent) return;

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
      const response = await axios.post(`/api/posts/${post._id}/comment`, 
        { content: commentContent, author: user._id, parentCommentId: parentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([response.data.comment, ...comments]);
      setCommentContent(''); // Clear the comment input after submission
      setParentId(null); // Reset parentId after submission
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    if (!replyContent) {
      alert('Cannot post empty reply.');
      return;
    };

    if (!user) {
      alert('You must be logged in to post a reply.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to post a reply.');
      return;
    }

    try {
      const response = await axios.post(`/api/posts/${post._id}/comment`, 
        { content: replyContent, author: user._id, parentCommentId: parentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prevComments) => {
        return prevComments.map((comment) => {
          if (comment._id === parentId) {
            return {
              ...comment,
              replies: [response.data.comment, ...comment.replies],
            };
          }
          return comment;
        });
      });
      setReplyContent(''); // Clear the reply input after submission
      setParentId(null); // Reset parentId after submission
    } catch (error) {
      console.error('Error adding reply:', error);
      alert('Failed to add reply');
    }
  };

  const handleUpvote = async () => {
    if (!user) {
      alert('You must be logged in to upvote.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to upvote.');
      return;
    }

    try {
      if (upvoted) {
        const response = await axios.delete(`/api/posts/${post._id}/downvote`, {
          data: { userId: user._id },
          headers: { Authorization: `Bearer ${token}` },
        });
        setUpvoted(false);
        fetchUpvoteCount();
      } else {
        const response = await axios.post(`/api/posts/${post._id}/upvote`, 
          { userId: user._id }, 
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setUpvoted(true);
        fetchUpvoteCount();
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error handling upvote:', error);
    }
  };

  const handleReply = (commentId) => {
    setParentId(commentId);  // Set parentId to commentId to track the reply
    setReplyContent('');  // Clear the previous reply content when selecting a new comment
  };

  const handleCancelReply = () => {
    setParentId(null);  // Reset the parentId when cancelling the reply
    setReplyContent('');  // Clear the reply content when cancelling the reply
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`/api/posts/${post._id}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
  
      alert(response.data.message);
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  const renderComments = (comments, level = 0) => {
    return comments.map((comment) => (
      <li 
        key={comment._id}
        style={{
          marginLeft: `${level * 20}px`, // For nested comments
          padding: '10px',
          borderLeft: level > 0 ? '2px solid #ccc' : 'none',
          backgroundColor: level > 0 ? '#f9f9f9' : 'transparent' 
        }}
      >
        <p>
          <strong>{comment.author?.name}</strong>: {comment.content}
        </p>
        {comment.author?._id === user._id && (
          <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
        )}
        <button onClick={() => handleReply(comment._id)}>Reply</button>
  
        {/* Show reply input only if this comment is selected for replying */}
        {parentId === comment._id && (
          <form className='addComment reply' onSubmit={handleReplySubmit}>
            <textarea
              value={replyContent}  // Use replyContent for replies
              onChange={handleReplyChange}
              placeholder="Add your reply..."
              required
            />
            <button type="submit">Post</button>
            <button type="button" onClick={handleCancelReply}>Cancel</button>  {/* Cancel reply */}
          </form>
        )}
  
        {/* Check if replies exist and render them */}
        {Array.isArray(comment.replies) && comment.replies.length > 0 && (
          <ul style={{ marginLeft: '20px' }}>
            {renderComments(comment.replies, level + 1)}
          </ul>
        )}
      </li>
    ));
  };

  const handleShare = () => {
    const postUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content,
        url: postUrl
      })
      .then(() => setShareStatus('Post shared successfully!'))
      .catch((error) => {
        console.error('Error sharing via Web Share API', error);
        setShareStatus('Failed to share post.');
      });
    } else {
      navigator.clipboard.writeText(postUrl)
        .then(() => setShareStatus('Post link copied to clipboard!'))
        .catch((error) => {
          console.error('Error copying to clipboard', error);
          setShareStatus('Failed to copy link.');
        });
    }
  };

  const renderTags = (tags) => {
    if (!tags) return null;
    const { descriptiveTag, departmentTag, campusTag, nsfw } = tags;

    const abbrTags = {
      "College of Engineering":"CoE",
      "College of Architecture":"CoA",
      "College of Fine Arts and Design":"CFAD",
      "College of Accountancy, Business, Economics, and International Hospitality Management":"CABEIHM",
      "College of Arts and Sciences":"CAS",
      "College of Informatics and Computing Sciences":"CICS",
      "College of Industrial Technology":"CIT",
      "College of Nursing and Allied Health Sciences":"CoNAHS",
      "College of Agriculture and Forestry":"CAF",
      "College of Teacher Education":"CTE",
      "College of Medicine":"Med",
      "college of engineering":"CoE",
      "college of architecture":"CoA",
      "college of fine arts and design":"CFAD",
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

  const handleAuthorClick = () => {
    navigate(`/Profile/${post.author._id}`);
  };

  if (loading) {
    return <div>Loading post...</div>; // Loading state
  }

  if (error) {
    return <div>{error}</div>; // Error state
  }

  if (!post) {
    return <div>Post not found.</div>; // If no post is available
  }
  
  return (
    <div className="container">
      <Header toggle={toggle}/>
      <div className='contents'>
        <Sidebar isCollapsed={sidebar} />
        <div className={`wall ${sidebar ? 'collapsed' : ''}`}>
          <HomeNav />
          <div className="page">
            <div className="postmodal-overlay"> 
              <FaArrowLeft className="modalClose" onClick={() => navigate(-1)}/>
              <div className="postmodal-content" onClick={(e) => e.stopPropagation()}>
                <div className="postAuthor" onClick={handleAuthorClick}>
                  <img src={UserAvatar} className="user-pic" alt="pfp"></img>
                  {post.author && <p className="post-author">{post.author.name}</p>}
                </div>
                <h3>{post.title}</h3>
                {renderTags(post.tags)}
                <p>{post.content}</p>
                <div className="interact">
                  <p>
                    {upvoteCount} 
                    {upvoted ? (
                      <FaHeart onClick={handleUpvote} />
                    ) : (
                      <FaRegHeart onClick={handleUpvote} />
                    )}
                  </p>
                  <p>{post.comments ? post.comments.length : 0} <FaRegComment/> </p>
                  <p><FaRegShareFromSquare onClick={handleShare}/></p>
                  {shareStatus && <span>{shareStatus}</span>}
                </div>
                <div className="comments-list">
                  <h4>Comments:</h4>
                  <form className='addComment' onSubmit={handleCommentSubmit}>
                    <textarea
                      value={commentContent}  // Use commentContent for main comments
                      onChange={handleCommentChange}
                      placeholder="Add your comment..."
                      required
                    />
                    <button type="submit">Post</button>
                  </form>

                  {comments && comments.length > 0 ? (
                    <ul>
                      {renderComments(comments)}
                    </ul>
                  ) : (
                    <p>No comments yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostPage;