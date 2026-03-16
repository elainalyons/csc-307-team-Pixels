import React, { useCallback, useState, useEffect } from "react";
export default function QuoteOfDay({
  savedQuote,
  onSaveQuote
}) {
  const [quote, setQuote] = useState(() => savedQuote ?? null);
  const [loading, setLoading] = useState(() => !savedQuote);
  const [maxedOut, setMaxedOut] = useState(false);

  const API_PREFIX = //"http://localhost:8000"
    "https://reflekt-journal-dgdpg9a7azgfhrd8.westus-01.azurewebsites.net";

  // FIX: Call the public quote API directly instead of routing through your
  // Azure backend.
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
        const shaped = {
          text: data.text,
          author: data.author
        };
        setQuote(shaped);
        onSaveQuote?.(shaped);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setMaxedOut(true);
      });
  }, [onSaveQuote]);

  useEffect(() => {
    async function fetchQuote() {
      if (!savedQuote) {
        await getQuote();
      }
    }

    fetchQuote();
  }, [savedQuote, getQuote]);

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
