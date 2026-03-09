import React, { useEffect, useState } from "react";
import "./NewEntryForm.css";

function HomeEditor({ entry, selectedDate, onSave }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    setTitle(entry?.title ?? "");
    setBody(entry?.body ?? "");
  }, [entry]);

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
        type="text"
        id="home-editor-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a title..."
      />

      <label htmlFor="home-editor-body">Body</label>
      <textarea
        id="home-editor-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your journal entry here"
      />

      <input
        type="button"
        value="Save"
        onClick={handleSave}
      />
    </div>
  );
}

export default HomeEditor;