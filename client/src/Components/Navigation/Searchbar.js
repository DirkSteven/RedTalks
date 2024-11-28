import React, { useState, useEffect } from "react";

// Debounce function to delay API call after typing stops
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up timeout on component unmount or when value changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

function Searchbar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce query for live search
  const debouncedQuery = useDebounce(query, 500); // Wait for 500ms after the user stops typing

  // Function to handle the change in search input
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setQuery(query);
  };

  // Function to fetch search results from the server
  const fetchSearchResults = async (query) => {
    if (!query) return; // Don't search if the query is empty

    setLoading(true); // Set loading state

    try {
      const response = await fetch(`/api/posts/search?query=${query}`);
      const data = await response.json();
      console.log("API Response:", data);

      // Combine users and posts into a single results array
      const combinedResults = [
        ...data.users.map(user => ({ ...user, type: 'user' })), // Add a "type" field to distinguish users
        ...data.posts.map(post => ({ ...post, type: 'post' })) // Add a "type" field to distinguish posts
      ];

      setResults(combinedResults); // Update the state with the combined results
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Effect hook to fetch results when the debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      fetchSearchResults(debouncedQuery); // Fetch results for the debounced query
    } else {
      setResults([]); // Clear results if the query is empty
    }
  }, [debouncedQuery]);

  // Function to highlight the matching text
  const highlightText = (text) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, index) =>
      regex.test(part) ? <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span> : part
    );
  };

  return (
    <div className="searchFunction">
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          className="searchbar"
          placeholder="Search"
          value={query}
          onChange={handleSearchChange}
        />
      </form>

      {loading && <div className="searchResult">Loading...</div>}

      {results.length > 0 && (
        <div className="searchResult">
          {results.map((result, index) => (
            <p key={index}>
              {result.type === 'user' ? (
                // Render user information (e.g., name, email)
                highlightText(result.name || result.email || "No name available")
              ) : (
                // Render post information (e.g., title, content)
                highlightText(result.title || result.content || "No title available")
              )}
            </p>
          ))}
        </div>
      )}

      {results.length === 0 && query && !loading && (
        <div className="searchResult">No results found</div>
      )}
    </div>
  );
}

export default Searchbar;
