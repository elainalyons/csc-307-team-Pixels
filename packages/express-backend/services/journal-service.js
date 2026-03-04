import JournalEntry from "../models/journal-entry.js";

export async function createEntry({
  title,
  body,
  date,
  owner
}) {
  return JournalEntry.create({ title, body, date, owner });
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
  if (updates.date !== undefined) allowed.date = updates.date;

  return JournalEntry.findOneAndUpdate(
    { _id: id, owner },
    allowed,
    { new: true, runValidators: true }
  );
}
