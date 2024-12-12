import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import axios from "axios";
import AppContext from '../Contexts/AppContext';

function CreatePost() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsModalOpen, setTagsModalOpen] = useState(false); // For controlling the tag modal visibility
  const [selectedTags, setSelectedTags] = useState({
    descriptiveTag: "Discussion",
    campusTag: "Alangilan",
    departmentTag: "College of Engineering",
    nsfw: false, // Checkbox state for NSFW
  });

  // Department abbreviation mapping
  const abbrTags = {
    "College of Engineering": "CoE",
    "College of Architecture": "CoA",
    "College of Fine Arts, and Design": "CFAD",
    "College of Accountancy, Business, Economics, and International Hospitality Management": "CABEIHM",
    "College of Arts and Sciences": "CAS",
    "College of Informatics and Computing Sciences": "CICS",
    "College of Industrial Technology": "CIT",
    "College of Nursing and Allied Health Sciences": "CONAHS",
    "College of Law": "COL",
    "College of Agriculture and Forestry": "CAF",
    "College of Teacher Education": "CTE",
    "College of Medicine": "COM",
  };

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

    const formattedTags = {
      descriptiveTag: selectedTags.descriptiveTag.toLowerCase(),
      campusTag: selectedTags.campusTag.toLowerCase(),
      departmentTag: selectedTags.departmentTag.toLowerCase(),
      nsfw: selectedTags.nsfw,
    };

    try {
      await axios.post(
        "/api/posts/create",
        {
          title,
          content,
          author: user._id,
          imageUrl: "", // Optionally handle image URL
          tags: formattedTags,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Post Successful");
      navigate(-1);
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
    if (tagType === "departmentTag") {
      // For departmentTag, store the full department name in state
      setSelectedTags({
        ...selectedTags,
        [tagType]: tagValue,
      });
    } else {
      // For other tags, directly update state
      setSelectedTags({
        ...selectedTags,
        [tagType]: tagValue,
      });
    }
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
      <FaArrowLeft className="modalClose" onClick={() => navigate(-1)} />
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

                // For departmentTag, display the abbreviation
                const displayValue =
                  key === "departmentTag"
                    ? abbrTags[value] || value // Fallback to full value if abbreviation not found
                    : value;

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
                    {displayValue}
                  </span>
                );
              })}
            </div>
            <button
              type="button"
              className="formbtn"
              onClick={handleTagModalToggle}
            >
              Edit tags
            </button>
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
                className="tagselect descriptiveTag"
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
                className="tagselect campusTag"
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
                className="tagselect departmentTag"
                value={selectedTags.departmentTag}
                onChange={(e) =>
                  handleTagChange("departmentTag", e.target.value)
                }
              >
                {availableTags.departmentTag.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag} {/* Show full department names in the modal */}
                  </option>
                ))}
              </select>
            </div>

            <div className="tagselect nsfwTag">
              <label>NSFW</label>
              <input
                type="checkbox"
                className="nsfwCheckbox"
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