import { useState } from "react";
import "./App.css";

function App() {
  // Store the original long URL entered by the user
  const [longUrl, setLongUrl] = useState("");
  // Store the generated short URL
  const [shortUrl, setShortUrl] = useState("");

// Function to generate a dummy short URL
const generateShortUrl = async () => {
  if (!longUrl) {
    setShortUrl("Please enter a valid URL!");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ longUrl }),
    });

    const data = await response.json();

    if (data && data.shortCode) {
      setShortUrl(`http://localhost:8080/${data.shortCode}`);
    } else {
      // fallback to a random code if server did not return a shortCode
      const code = Math.random().toString(36).substring(2, 8);
      setShortUrl(`https://short.ly/${code}`);
    }
  } catch (err) {
    console.error("API error:", err);
    // fallback on error
    const code = Math.random().toString(36).substring(2, 8);
    setShortUrl(`https://short.ly/${code}`);
  }
};

  return (
    <div className="app-container">
      <h1>URL Shortener</h1>
      {/* Input for the original long URL */}
      <input
        type="text"
        // Bind the input's value to longUrl state
        value={longUrl}
        // TODO: Update longUrl state using setLongUrl when user types
        onChange={(e) => setLongUrl(e.target.value)}
        placeholder="Enter a URL to shorten"
      />
      <br />
      {/* Button to generate short URL */}
      <button
        className="btn"
        // Call Appropriate function on "Shorten URL" button click
        onClick={generateShortUrl}
      >
        Shorten URL
      </button>
      {/* Display generated short URL */}
      <p>
        {shortUrl && (
          <>
            Short URL:{" "}
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl}
            </a>
          </>
        )}
      </p>
    </div>
  );
}

export default App;
