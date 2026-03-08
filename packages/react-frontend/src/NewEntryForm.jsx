import React, { useState } from "react";
import "./NewEntryForm.css";

function NewEntryForm(props) {
  const getTodayDate = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };

  const [entry, setEntry] = useState({
    title: "",
    body: "",
    date: props.selectedDate || getTodayDate()
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
      date: props.selectedDate || getTodayDate()
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