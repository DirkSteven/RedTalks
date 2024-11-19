import { React, useState, useEffect } from "react";
import axios from 'axios';
import PostModal from "../Components/Modals/Post Modal";

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [sortOption, setSortOption] = useState("date"); // Default sort option

    useEffect(() => {
        // Fetch posts from the backend API
        axios.get('api/posts')
            .then(response => {
                console.log(response.data);  // Log the response to inspect its structure
                const postsData = Array.isArray(response.data) ? response.data : [];
                setPosts(postsData);
                setLoading(false);  // Set loading to false after fetching data
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                setLoading(false);  // Set loading to false in case of error
            });
    }, []);

    // Handle click on a post
    const postClick = (post) => {
        setSelected(post);
    };

    const closePost = () => {
        setSelected(null);
    };

    // Sorting function
    const sortPosts = (posts, option) => {
        switch (option) {
            case "upvotes":
                return [...posts].sort((a, b) => (b.upvotes ? b.upvotes.length : 0) - (a.upvotes ? a.upvotes.length : 0));
            case "title":
                return [...posts].sort((a, b) => a.title.localeCompare(b.title));
            case "date":
            default:
                return [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Assuming there's a createdAt field
        }
    };

    // Get sorted posts based on the selected sort option
    const sortedPosts = sortPosts(posts, sortOption);

    return (
        <>
            {selected === null ? (
                <>
                    <div className="sort-options">
                        <label htmlFor="sortSelect">Sort By: </label>
                        <select
                            id="sortSelect"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="date">Date</option>
                            <option value="upvotes">Upvotes</option>
                            <option value="title">Title</option>
                        </select>
                    </div>

                    <div className="list">
                        {loading ? (
                            <p>Loading posts...</p>
                        ) : sortedPosts.length === 0 ? (
                            <p>No posts available</p>
                        ) : (
                            sortedPosts.map(post => (
                                <div 
                                    className="postitem" 
                                    key={post.id} 
                                    onClick={() => postClick(post)}  
                                >
                                    <h3>{post.title}</h3>

                                    {post.tag && (
                                        <div className="tags">
                                            <h4>Tags:</h4>
                                            {post.tag.descriptiveTag && <p className="tag">{post.tag.descriptiveTag}</p>}
                                            {post.tag.campusTag && <p className="tag">{post.tag.campusTag}</p>}
                                            {post.tag.departmentTag && <p className="tag">{post.tag.departmentTag}</p>}
                                            {post.tag.nsfw && <p className="tag nsfw">NSFW</p>}
                                        </div>
                                    )}

                                    <p>{post.content}</p>
                                    <div className="interact">
                                        <p>{post.upvotes ? post.upvotes.length : 0} upvotes</p>
                                        <p>{post.comments ? post.comments.length : 0} comments</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="schinfo">
                        <img alt="School Logo" />
                        <h3>Batangas State University</h3>
                        <p>sch desc</p>
                        <div className="divider"></div>
                        <div className="schSocials">
                            <ul>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                    </div>
                </>
            ) : (
                <PostModal post={selected} onClose={closePost} />
            )}
        </>
    );
}

export default Home;
