import React, { useEffect, useState } from "react";

function QuoteOfDay() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  function getQuote() {
    setLoading(true);

    fetch("https://api.quotable.io/random")
      .then((res) => res.json())
      .then((data) => {
        setQuote({
          text: data.content,
          author: data.author
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  // get first quote when component loads
  useEffect(() => {
    getQuote();
  }, []);

  return (
    <div className="quote-box">
      <h3>Quote of the Day</h3>

      {quote && (
        <>
          <p>"{quote.text}"</p>
          <p className="quote-author">— {quote.author}</p>
        </>
      )}

      {loading && <p>Loading...</p>}

      <button className="quote-button" onClick={getQuote}>
        New Quote
      </button>
    </div>
  );
}

export default QuoteOfDay;
