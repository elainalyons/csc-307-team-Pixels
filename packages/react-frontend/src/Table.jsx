import { useState } from "react";
import "./Table.css";

function TableHeader() {
  return (
    <thead>
      <tr>
        <th>Title</th>
        <th>Body</th>
        <th>Date</th>
        <th className="tableActionsHeader">Actions</th>
      </tr>
    </thead>
  );
}

const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(
    `${value.toString().slice(0, 10)}T12:00:00`
  );
  return !isNaN(d)
    ? d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit"
      })
    : "";
};

const toDateInputValue = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d)) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const getTodayDate = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const localDate = new Date(
    today.getTime() - offset * 60 * 1000
  );
  return localDate.toISOString().split("T")[0];
};

function TableBody({
  journalData,
  onDelete,
  onUpdate,
  onRowClick
}) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({
    title: "",
    body: "",
    date: ""
  });

  const startEdit = (entry) => {
    setEditingId(entry._id);
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
    onUpdate(id, {
      title: draft.title,
      body: draft.body,
      date: draft.date || getTodayDate()
    });
    setEditingId(null);
  };

  return (
    <tbody>
      {journalData.map((row) => {
        const isEditing = editingId === row._id;

        return (
          <tr
            key={row._id}
            onClick={() => {
              if (!isEditing && onRowClick) onRowClick(row._id);
            }}
            className={
              !isEditing && onRowClick
                ? "tableRowClickable"
                : ""
            }>
            <td>
              {isEditing ? (
                <input
                  className="tableField"
                  value={draft.title}
                  onClick={(e) => e.stopPropagation()}
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

            <td className="body-cell">
              {isEditing ? (
                <textarea
                  className="tableField"
                  value={draft.body}
                  onClick={(e) => e.stopPropagation()}
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
                <div className="entry-preview">{row.body}</div>
              )}
            </td>

            <td>
              {isEditing ? (
                <input
                  className="tableField"
                  type="date"
                  value={draft.date}
                  onClick={(e) => e.stopPropagation()}
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
              className="tableActionsCell"
              onClick={(e) => e.stopPropagation()}>
              {isEditing ? (
                <div className="tableInlineActions">
                  <button
                    type="button"
                    className="tableInlineBtn"
                    onClick={() => saveEdit(row._id)}>
                    Save
                  </button>
                  <button
                    type="button"
                    className="tableInlineBtn tableInlineBtnCancel"
                    onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    className="tableDotsBtn"
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === row._id ? null : row._id
                      )
                    }
                    aria-label="Actions"
                    title="Actions">
                    ⋯
                  </button>

                  {openMenuId === row._id && (
                    <div className="tableMenu">
                      <button
                        type="button"
                        className="tableMenuBtn"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          startEdit(row);
                        }}>
                        Edit
                      </button>

                      <button
                        type="button"
                        className="tableMenuBtn"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onDelete(row._id);
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
      })}
    </tbody>
  );
}

function Table(props) {
  return (
    <table className="tableRoot">
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
