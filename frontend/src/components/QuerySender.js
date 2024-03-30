import React, { useState } from "react";

const QuerySender = () => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAnswer("Thinking...");
    const response = await fetch("http://localhost:3001", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    console.log("Response from server: ", data);
    setAnswer(data.response);
  };
  return (
    <div>
      <h1>Ask a question: </h1>
      <form>
        <input
          id="query"
          type="text"
          value={query}
          onChange={handleChange}
          className="input"
        />
        <button type="submit" onClick={handleSubmit} className="btn">
          Query
        </button>
      </form>
      <div id="answer" className="card">
        {answer}
      </div>
    </div>
  );
};

export default QuerySender;
