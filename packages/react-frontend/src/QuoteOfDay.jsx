import React, { useCallback, useState } from "react";

export default function QuoteOfDay({
  savedQuote,
  onSaveQuote
}) {
  const API_PREFIX = "http://localhost:8000";

  const [quote, setQuote] = useState(() => savedQuote ?? null);
  const [loading, setLoading] = useState(() => !savedQuote);
  const [maxedOut, setMaxedOut] = useState(false);

  const getQuote = useCallback(() => {
    setLoading(true);
    setMaxedOut(false);

    fetch(`${API_PREFIX}/quote`)
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
        setQuote(data);
        onSaveQuote?.(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
