import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import axios from "axios";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsModalOpen, setTagsModalOpen] = useState(false); // For controlling the tag modal visibility
  const [selectedTags, setSelectedTags] = useState({
    descriptiveTag: "discussion",
    campusTag: "Alangilan",
    departmentTag: "Computer Science",
    nsfw: false, // Checkbox state for NSFW
  });

  // Predefined tag options
  const availableTags = {
    descriptiveTag: ['discussion', 'general', 'announcement', 'memes/fun', 'rants', 'help', 'admission/shifting/transferring', 'rateProf', 'others'],
    campusTag: ['Alangilan', 'ARASOF-Nasugbu', 'Balayan', 'JPLPC-Malvar', 'Lemery', 'Lipa', 'Lobo', 'Mabini', 'Malvar', 'Pablo Borbon', 'Rosario', 'San Juan'],
    departmentTag: ['College of Engineering', 'College of Architecture', 'College of Fine Arts, and Design', 'College of Accountancy, Business, Economics, and International Hospitality Management', 'College of Arts and Sciences', 'College of Informatics and Computing Sciences', 'College of Industrial Technology', 'College of Nursing and Allied Health Sciences', 'College of Law', 'College of Agriculture and Forestry', 'College of Teacher Education', 'College of Medicine'],
  };

  // Handle form submission
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
          author: "user._id", // Replace with actual user ID
          imageUrl: "", // Optionally handle image URL
          tags: selectedTags,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Handle successful post creation, perhaps redirect or show a success message
    } catch (error) {
      console.error("Error creating post", error);
      // Optionally show an error message to the user
    }
  };

  // Handle opening and closing of the tag selection modal
  const handleTagModalToggle = () => {
    setTagsModalOpen(!tagsModalOpen);
  };

  // Handle tag selection
  const handleTagChange = (tagType, tagValue) => {
    setSelectedTags({
      ...selectedTags,
      [tagType]: tagValue,
    });
  };

  // Handle NSFW checkbox change
  const handleNSFWChange = (e) => {
    setSelectedTags({
      ...selectedTags,
      nsfw: e.target.checked, // Update nsfw based on checkbox state
    });
  };

  return (
    <>
      <Link to="/" className="modalClose">
        <FaArrowLeft />
      </Link>
      <div className="postcreation">
        <h1>Create Post</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="inputPostTitle"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="tags-display">
            <button
              type="button"
              className="formbtn"
              onClick={handleTagModalToggle}
            >
              Add tags
            </button>
            <div className="selected-tags">
              {Object.entries(selectedTags).map(([key, value]) => {
                if (key === "nsfw" && value) {
                  return (
                    <span key={key} className="tag nsfwTag">
                      NSFW
                    </span>
                  );
                }
                // Skip the NSFW tag if false
                if (key === "nsfw") return null;

                // Assign different classes based on tag type
                const tagClass =
                  key === "descriptiveTag"
                    ? "descriptiveTag"
                    : key === "campusTag"
                    ? "campusTag"
                    : key === "departmentTag"
                    ? "departmentTag"
                    : "";

                return (
                  <span key={key} className={`tag ${tagClass}`}>
                    {value.toString()}
                  </span>
                );
              })}
            </div>
          </div>

          <textarea
            placeholder="Body"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>

          <button type="submit" className="formbtn doneCreate">
            Post
          </button>
        </form>
      </div>

      {/* Tag selection modal (overlay) */}
      {tagsModalOpen && (
        <div className="tagsModalOverlay">
          <div className="tagsModal">
            <h3>Select Tags</h3>
            <div>
              <label>Descriptive Tag:</label>
              <select
                value={selectedTags.descriptiveTag}
                onChange={(e) =>
                  handleTagChange("descriptiveTag", e.target.value)
                }
              >
                {availableTags.descriptiveTag.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Campus Tag:</label>
              <select
                value={selectedTags.campusTag}
                onChange={(e) => handleTagChange("campusTag", e.target.value)}
              >
                {availableTags.campusTag.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Department Tag:</label>
              <select
                value={selectedTags.departmentTag}
                onChange={(e) =>
                  handleTagChange("departmentTag", e.target.value)
                }
              >
                {availableTags.departmentTag.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>NSFW:</label>
              <input
                type="checkbox"
                checked={selectedTags.nsfw}
                onChange={handleNSFWChange} // Update the state when checked/unchecked
              />
            </div>

            <button
              type="button"
              onClick={handleTagModalToggle}
              className="formbtn"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CreatePost;
