import React, { useState } from "react";

function NewEntryForm(props) {
  const [entry, setEntry] = useState({
    title: "",
    body: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "body")
      setEntry({ title: entry["title"], body: value });
    else setEntry({ title: value, body: entry["body"] });
  }

  function submitEntry() {
    props.handleSubmit(entry);
    setEntry({ title: "", body: "" });
  }

  return (
    <form>
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
      <input
        type="text"
        name="body"
        id="body"
        value={entry.body}
        onChange={handleChange}
        placeholder="Write your journal entry here"
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
