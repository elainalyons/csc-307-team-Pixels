import React, { useState } from "react";
import "./NewEntryForm.css";

function NewEntryForm(props) {
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const [entry, setEntry] = useState({
    title: "",
    body: "",
    date: getTodayDate()
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setEntry({
      ...entry,
      [name]: value
    });
  }

  function submitEntry() {
    props.handleSubmit(entry);
    setEntry({
      title: "",
      body: "",
      date: getTodayDate()
    });
  }

  return (
    <form className="entry-form">
      <label htmlFor="title">Title</label>
      <input
        type="text"
        name="title"
        id="title"
        value={entry.title}
        onChange={handleChange}
        placeholder="Enter a title..."
      />

      <label htmlFor="body">Body</label>
      <textarea
        name="body"
        id="body"
        value={entry.body}
        onChange={handleChange}
        placeholder="Write your journal entry here"
      />

      <label htmlFor="date">Date (optional)</label>
      <input
        type="date"
        name="date"
        id="date"
        value={entry.date}
        onChange={handleChange}
      />

      <input
        type="button"
        value="Submit"
        onClick={submitEntry}
      />
    </form>
  );
}

export default NewEntryForm;