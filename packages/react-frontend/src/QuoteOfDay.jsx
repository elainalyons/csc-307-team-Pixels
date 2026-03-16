import React, { useCallback, useState } from "react";

export default function QuoteOfDay({ savedQuote, onSaveQuote }) {
  const [quote, setQuote] = useState(() => savedQuote ?? null);
  const [loading, setLoading] = useState(() => !savedQuote);
  const [maxedOut, setMaxedOut] = useState(false);

  // FIX: Call the public quote API directly instead of routing through your
  // Azure backend.
  const getQuote = useCallback(() => {
    setLoading(true);
    setMaxedOut(false);

    fetch("https://api.quotable.io/random")
      .then(async (res) => {
        if (!res.ok) {
          setMaxedOut(true);
          setLoading(false);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        const shaped = { text: data.content, author: data.author };
        setQuote(shaped);
        onSaveQuote?.(shaped);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setMaxedOut(true);
      });
  }, [onSaveQuote]);

  return (
    <div className="quote-box">
      {quote ? (
        <>
          <p>"{quote.text}"</p>
          <p className="quote-author">— {quote.author}</p>
        </>
      ) : (
        <p>{loading ? "Loading..." : "No quote yet."}</p>
      )}
      {maxedOut && <p>Wait to refresh</p>}
      <button className="quote-button" onClick={getQuote}>
        {quote ? "New Quote" : "Load Quote"}
      </button>
    </div>
  );
}