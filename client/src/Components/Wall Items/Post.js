import {React, useState, useEffect} from "react";
import axios from 'axios';

function Post(){

    const [post, setPost] = useState([]);

  useEffect(() => {
    // Fetch data from the backend API
    axios.get('api/posts')
      .then(response => {
        setPost(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

    
    return(
        <div className="postItem">
            This is a post
            <h1>{post.title}</h1>
        </div>
    );
}

export default Post;