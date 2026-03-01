import React from "react";

export default function EntryModal({ entry, onClose }) {
  if (!entry) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 16
      }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(900px, 95vw)",
          maxHeight: "85vh",
          overflow: "auto",
          background: "white",
          borderRadius: 12,
          padding: 18,
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
        }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12
          }}>
          <h2 style={{ margin: 0 }}>{entry.title}</h2>
          <button onClick={onClose}>Close</button>
        </div>

        <p style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>
          {entry.body}
        </p>
      </div>
    </div>
  );
}
