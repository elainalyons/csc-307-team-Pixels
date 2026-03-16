import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./EntryDetailsPage.css";

export default function EntryDetailsPage({ apiPrefix, token }) {
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

        const res = await fetch(`${apiPrefix}/entries/${id}`, {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {}
        });

        if (!res.ok) throw new Error("Entry not found");

        const json = await res.json();
        const actualEntry = json.entry ?? json;

        if (!cancelled) setEntry(actualEntry);
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
  }, [id, apiPrefix, token]);

  if (loading)
    return <p className="entryDetailsLoading">Loading…</p>;
  if (err) return <p className="entryDetailsError">{err}</p>;
  if (!entry)
    return <p className="entryDetailsError">Entry not found</p>;

  return (
    <div className="entryDetailsPage">
      <Link to="/entries" className="entryDetailsBack">
        ← Back
      </Link>

      <div className="entryDetailsCard">
        <h1 className="entryDetailsTitle">{entry.title}</h1>

        <div className="entryDetailsMeta">
          {new Date(
            entry.date || entry.createdAt
          ).toLocaleDateString()}
        </div>

        <p className="entryDetailsBody">{entry.body}</p>
      </div>
    </div>
  );
}
