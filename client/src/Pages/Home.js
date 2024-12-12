import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { Link, useOutletContext, useNavigate } from 'react-router-dom';
import { FaRegComment, FaHeart, FaRegHeart, FaRegShareFromSquare } from "react-icons/fa6";
import AppContext from '../Contexts/AppContext'; 
import UserAvatar from '../Assets/UserAvatar.png';
import homepic from '../Assets/homepic.png';

function Home() {
  const { user } = useContext(AppContext);
  const { selectedTag, campusTag, departmentTag, nsfw } = useOutletContext(); // Use the context to access selectedTag
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upvotedPosts, setUpvotedPosts] = useState({});
  const [refreshPosts, setRefreshPosts] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  const buildUrl = () => {
    let url = '/api/posts/filter?';

    // Add selected tags only if they are not null or undefined
    if (selectedTag) url += `descriptiveTag=${encodeURIComponent(selectedTag)}&`;
    if (campusTag) url += `campusTag=${encodeURIComponent(campusTag)}&`;
    if (departmentTag) url += `departmentTag=${encodeURIComponent(departmentTag)}&`;
    if (nsfw !== undefined && nsfw !== null) url += `nsfw=${encodeURIComponent(nsfw)}&`;

    // Remove the last '&' if present
    if (url.endsWith('&')) {
        url = url.slice(0, -1);
    }

    return url;
};

  useEffect(() => {
    setLoading(true);
    const url = buildUrl();

    axios.get(url)
      .then(response => {
        console.log(response.data);
        const postsData = Array.isArray(response.data) ? response.data : [];
        setPosts(postsData);

        const upvotedPosts = postsData.reduce((acc, post) => {
          if (post.upvotes && post.upvotes.includes(user._id)) {
            acc[post._id] = true;
          }
          return acc;
        }, {});
        setUpvotedPosts(upvotedPosts);    

        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });
  }, [user, refreshPosts, selectedTag, campusTag, departmentTag, nsfw]);

  const toggleUpvote = (postId) => {
    if (!user) {
      alert('You must be logged in to upvote.');
      return;
    }

    const isUpvoted = upvotedPosts[postId] || false;
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to upvote.');
      return;
    }

    const url = isUpvoted
      ? `/api/posts/${postId}/downvote`
      : `/api/posts/${postId}/upvote`;

    const method = isUpvoted ? 'delete' : 'post';

    axios({
      method,
      url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { userId: user._id }
    })
    .then((response) => {
      const updatedPost = response.data.post;

      setPosts(prevPosts => {
        return prevPosts.map(post => {
          if (post._id === postId) {
            return updatedPost;
          }
          return post;
        });
      });

      setUpvotedPosts(prevState => ({
        ...prevState,
        [postId]: !isUpvoted,
      }));
    })
    .catch((error) => {
      console.error('Error toggling upvote:', error.response ? error.response.data : error.message);
      alert('Failed to update upvote status');
    });
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

  const handlePostClick = (postId) => {
    // Navigate to the post's detailed page using its ID
    navigate(`/Post/${postId}`);
  };

  return (
    <div className="list">
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        posts.map(post => {
          const postId = post._id;
          return (
            <div 
              className="postitem" 
              key={postId} 
              onClick={() => handlePostClick(postId)} // Add the click handler
            >
              <div className="postAuthor">
                <img src={UserAvatar} className="user-pic" alt="pfp"></img>
                {post.author && <p className="post-author">{post.author.name || 'Unknown Author'}</p>}
              </div>
              <h3>{post.title}</h3>
              {renderTags(post.tags)}
              <p className="postpreview">{post.content}</p>
              <div className="interact">
                <p onClick={(e) => {
                  e.stopPropagation();
                  toggleUpvote(postId);
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
      <div className="schinfo">
        <img alt="School img" src={homepic}></img>
        <h3>Batangas State University</h3>
        <p className="schdesc"><b>RedTalks</b> is an exclusive online platform for BATANGAS STATE UNIVERSITY students, faculty, and staff to connect, share ideas, and engage in meaningful discussions. Whether you're looking for academic advice, campus news, or a place to chat with fellow BatSU members, RedTalks is here to bring the community together. Where Red Spartans share, engage, and rise. Join today and be part of the conversation!</p>
        <div className="divider"></div>
        <p>BATSTATEU OFFICIAL LINKS</p>
          <div className="links batsu">
            <Link to='https://batstateu.edu.ph/' target="_blank">Official Website</Link>
            <Link to='https://batstateu.edu.ph/academic-calendar/2023-2024/' target="_blank">Academic Calendar 2023-2024</Link>
            <Link to='https://dione.batstate-u.edu.ph/student/#/' target="_blank">Student Portal</Link>
          </div>
        <p>BATSTATEU SOCIAL MEDIA LINKS</p>
          <div className="links socmed">
            <Link to='https://www.facebook.com/BatStateUTheNEU' target="_blank">fb</Link>
            <Link to='https://twitter.com/BatStateUTheNEU' target="_blank">X</Link>
            <Link to='https://www.instagram.com/batstateu_/' target="_blank">insta</Link>
          </div>
      </div>
    </div>
  );
}

export default Home;