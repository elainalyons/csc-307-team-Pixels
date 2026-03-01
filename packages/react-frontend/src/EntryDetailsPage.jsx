import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function EntryDetailsPage() {
  const { id } = useParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(
          `http://localhost:8000/entries/${id}`
        );
        if (!res.ok) throw new Error("Entry not found");
        const data = await res.json();
        if (!cancelled) setEntry(data);
      } catch (e) {
        if (!cancelled) setErr(e.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <p style={{ padding: 16 }}>Loading…</p>;
  if (err)
    return <p style={{ padding: 16, color: "red" }}>{err}</p>;

  return (
    <div className="left-panel">
      <Link
        to="/entries"
        style={{ display: "inline-block", marginBottom: 12 }}>
        ← Back to all entries
      </Link>

      <h1>{entry.title}</h1>
      <p style={{ whiteSpace: "pre-wrap" }}>{entry.body}</p>
    </div>
  );
}
