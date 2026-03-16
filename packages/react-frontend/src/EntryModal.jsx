import React from "react";
import "./EntryModal.css";

export default function EntryModal({ entry, onClose }) {
  if (!entry) return null;

  return (
    <div
      className="entryModalOverlay"
      role="dialog"
      aria-modal="true"
      onClick={onClose}>
      <div
        className="entryModalContent"
        onClick={(e) => e.stopPropagation()}>
        <div className="entryModalHeader">
          <h2 className="entryModalTitle">{entry.title}</h2>
          <button
            className="closeBtn"
            type="button"
            onClick={onClose}>
            Close
          </button>
        </div>

        <p className="entryModalBody">{entry.body}</p>
      </div>
    </div>
  );
}
