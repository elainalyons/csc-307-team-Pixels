import React, { useState } from "react";
import "./NewEntryForm.css";

function HomeEditor({ entry, selectedDate, onSave }) {
  const [title, setTitle] = useState(entry?.title ?? "");
  const [body, setBody] = useState(entry?.body ?? "");

  function handleSave() {
    onSave({
      title,
      body,
      date: selectedDate
    });
  }

  return (
    <div className="entry-form">
      <label htmlFor="home-editor-title">Title</label>
      <input
        data-cy="home-editor-title"
        type="text"
        id="home-editor-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a title..."
      />

      <label htmlFor="home-editor-body">Body</label>
      <textarea
        data-cy="home-editor-body"
        id="home-editor-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your journal entry here"
      />

      <input
        data-cy="home-editor-save"
        type="button"
        value="Save"
        onClick={handleSave}
      />
    </div>
  );
}

export default HomeEditor;