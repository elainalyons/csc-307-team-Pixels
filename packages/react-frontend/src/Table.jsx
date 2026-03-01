import { useState } from "react";
function TableHeader() {
  return (
    <thead>
      <tr>
        <th>Title</th>
        <th>Body</th>
        <th>Date</th>
        <th style={{ width: "90px", textAlign: "right" }}>
          Actions
        </th>
      </tr>
    </thead>
  );
}

const formatDate = (value) => {
  const d = new Date(value);
  return value && !isNaN(d)
    ? d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit"
      })
    : "";
};

// Convert ISO date -> YYYY-MM-DD (needed for <input type="date">)
const toDateInputValue = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d)) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

function TableBody(props) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({
    title: "",
    body: "",
    date: ""
  });

  const startEdit = (entry) => {
    setEditingId(entry._id);
    console.log("EDIT clicked", entry._id);
    setDraft({
      title: entry.title ?? "",
      body: entry.body ?? "",
      date: toDateInputValue(entry.date || entry.createdAt)
    });
    setOpenMenuId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({ title: "", body: "", date: "" });
  };

  const saveEdit = (id) => {
    props.onUpdate(id, {
      title: draft.title,
      body: draft.body,
      date: draft.date ? new Date(draft.date) : new Date()
    });
    setEditingId(null);
  };

  const rows = props.journalData.map((row) => {
    return (
      <tr
        key={row._id}
        onClick={() => {
          if (editingId) return;
          props.onRowClick?.(row._id);
        }}
        style={{
          cursor: props.onRowClick ? "pointer" : "default"
        }}>
        <td>
          {editingId === row._id ? (
            <input
              value={draft.title}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  title: e.target.value
                }))
              }
              placeholder="Title"
            />
          ) : (
            row.title
          )}
        </td>
        <td>
          {editingId === row._id ? (
            <textarea
              value={draft.body}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  body: e.target.value
                }))
              }
              placeholder="Body"
              rows={2}
            />
          ) : (
            row.body
          )}
        </td>
        <td>
          {editingId === row._id ? (
            <input
              type="date"
              value={draft.date}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  date: e.target.value
                }))
              }
            />
          ) : (
            formatDate(row.date || row.createdAt)
          )}
        </td>
        <td
          style={{ textAlign: "right", position: "relative" }}>
          {editingId === row._id ? (
            <>
              <button onClick={() => saveEdit(row._id)}>
                Save
              </button>
              <button
                onClick={cancelEdit}
                style={{ marginLeft: 8 }}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenMenuId(
                    openMenuId === row._id ? null : row._id
                  );
                }}
                aria-label="Actions"
                title="Actions"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  border: "1px solid #ddd",
                  background: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: "bold",
                  lineHeight: "0"
                }}>
                ⋯
              </button>
              {openMenuId === row._id && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "40px",
                    background: "white",
                    borderRadius: 10,
                    padding: 8,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    zIndex: 10,
                    minWidth: 140,
                    boxShadow: "0 6px 18px rgba(0,0,0,0.15)"
                  }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("EDIT clicked", row._id);
                      startEdit(row);
                    }}
                    style={{
                      background: "#ff4fa3",
                      color: "white",
                      border: "none",
                      padding: "8px 10px",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontWeight: 600
                    }}>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("DELETE clicked", row._id);
                      props.onDelete(row._id);
                    }}
                    style={{
                      background: "#ff4fa3",
                      color: "white",
                      border: "none",
                      padding: "8px 10px",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontWeight: 600
                    }}>
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </td>
      </tr>
    );
  });

  return <tbody>{rows}</tbody>;
}

function Table(props) {
  return (
    <table style={{ width: "100%", tableLayout: "fixed" }}>
      <TableHeader />
      <TableBody
        journalData={props.journalData}
        onDelete={props.onDelete}
        onUpdate={props.onUpdate}
        onRowClick={props.onRowClick}
      />
    </table>
  );
}

export default Table;
