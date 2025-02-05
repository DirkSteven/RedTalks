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
        <div className="list">
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
