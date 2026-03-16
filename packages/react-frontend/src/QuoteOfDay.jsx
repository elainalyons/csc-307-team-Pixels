import React, { useEffect, useState } from "react";

function QuoteOfDay({ savedQuote, onSaveQuote, dateKey }) {
  const [quote, setQuote] = useState(savedQuote ?? null);
  const [loading, setLoading] = useState(true);
  const [maxedOut, setMaxedOut] = useState(false);

  const API_PREFIX = "http://localhost:8000"; // for local dev

  function getQuote() {
    setLoading(true);
    setMaxedOut(false);
    // get new quote if limit hasn't been reached (5 quote per 30 seconds)
    fetch(`${API_PREFIX}/quote`)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            console.log(data.error); // too many requests
            setMaxedOut(true);
            setLoading(false);
          });
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setQuote(data);
          onSaveQuote?.(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  // get first quote when component loads
  useEffect(() => {
    if (savedQuote) {
      setQuote(savedQuote);
      setLoading(false);
      setMaxedOut(false);
      return;
    }
    getQuote();
  }, [dateKey]);

  return (
    <div className="quote-box">
      {quote && (
        <>
          <p>"{quote.text}"</p>
          <p className="quote-author">— {quote.author}</p>
        </>
      )}

      {loading && <p>Loading...</p>}
      {maxedOut && <p>Wait to refresh</p>}

      <button className="quote-button" onClick={getQuote}>
        New Quote
      </button>
    </div>
  );
}

export default QuoteOfDay;
