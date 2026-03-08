import JournalEntry from "../models/journal-entry.js";

function normalizeDateKey(inputDate) {
  if (!inputDate) {
    throw new Error("date is required");
  }

  if (typeof inputDate === "string") {
    return inputDate.slice(0, 10);
  }

  const d = new Date(inputDate);
  if (Number.isNaN(d.getTime())) {
    throw new Error("invalid date");
  }

  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function dateFromDateKey(dateKey) {
  return new Date(`${dateKey}T12:00:00.000Z`);
}

export async function upsertEntryByDateForOwner({
  title,
  body,
  date,
  owner
}) {
  const dateKey = normalizeDateKey(date);

  return JournalEntry.findOneAndUpdate(
    { owner, dateKey },
    {
      title,
      body,
      owner,
      dateKey,
      date: dateFromDateKey(dateKey)
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    }
  );
}

export async function getEntriesByOwner(owner) {
  return JournalEntry.aggregate([
    { $match: { owner } },
    {
      $addFields: {
        date: { $ifNull: ["$date", "$createdAt"] }
      }
    },
    { $sort: { date: -1 } }
  ]);
}

export async function getEntryByIdForOwner(id, owner) {
  return JournalEntry.findOne({ _id: id, owner });
}

export async function getEntryByDateForOwner(date, owner) {
  const dateKey = normalizeDateKey(date);
  return JournalEntry.findOne({ owner, dateKey });
}

export async function deleteEntryByIdForOwner(id, owner) {
  return JournalEntry.findOneAndDelete({ _id: id, owner });
}

export async function updateEntryByIdForOwner(
  id,
  owner,
  updates
) {
  const allowed = {};
  if (updates.title !== undefined)
    allowed.title = updates.title;
  if (updates.body !== undefined) allowed.body = updates.body;

  if (updates.date !== undefined) {
    const dateKey = normalizeDateKey(updates.date);
    allowed.dateKey = dateKey;
    allowed.date = dateFromDateKey(dateKey);
  }

  return JournalEntry.findOneAndUpdate(
    { _id: id, owner },
    allowed,
    { new: true, runValidators: true }
  );
}
