import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import axios from "axios";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return; // Handle case where token is missing

    try {
      await axios.post(
        "/api/posts/create",
        {
          title,
          content,
          author: 'user._id', // Replace with the actual user ID
          imageUrl: "", // Optionally handle image URL
          tags: {
            descriptiveTag: "discussion",
            campusTag: "Alangilan",
            departmentTag: "Computer Science",
            nsfw: false,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Handle successful post creation
    } catch (error) {
      console.error("Error creating post", error);
      // Optionally show an error message to the user
    }
  };

  return (
    <>
      <Link to="/" className="modalClose">
        <FaArrowLeft />
      </Link>
      <div className="postcreation">
        <div className="publish">
          <h1>Create Post</h1>
          <button type="submit">Post</button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="inputPostTitle"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button>Add tags</button>

          <textarea
            placeholder="Body"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </form>
      </div>
    </>
  );
}

export default CreatePost;
