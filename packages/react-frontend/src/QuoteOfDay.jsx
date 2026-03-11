import React, { useEffect, useState } from "react";

function QuoteOfDay() {
  const [quote, setQuote] = useState(null);
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
          setQuote(data); // formatted in backend
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
    /*     setLoading(true);
     */ fetch(`${API_PREFIX}/quote`)
      .then((res) => res.json())
      .then((data) => {
        setQuote(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
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
      {maxedOut && <p>Wait to refresh</p>}

      <button className="quote-button" onClick={getQuote}>
        New Quote
      </button>
    </div>
  );
}

export default QuoteOfDay;
