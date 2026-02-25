import JournalEntry from "../models/journal-entry.js";

export async function createEntry({ title, body, date }) {
  return JournalEntry.create({ title, body, date });
}

export async function getAllEntries() {
  // If date field exists, keep it
  // If date field is not populated, add it with value of createdAt
  // Display in order of date
  return JournalEntry.aggregate([
    {
      $addFields: {
        date: { $ifNull: ["$date", "$createdAt"] }
      }
    },
    {
      $sort: { date: -1 }
    }
  ]);
}

export async function deleteEntryById(id) {
  return JournalEntry.findByIdAndDelete(id);
}

export async function updateEntryById(id, updates) {
  // Only allow fields we expect (keeps it safe)
  const allowed = {};
  if (updates.title !== undefined) allowed.title = updates.title;
  if (updates.body !== undefined) allowed.body = updates.body;
  if (updates.date !== undefined) allowed.date = updates.date;

  return JournalEntry.findByIdAndUpdate(id, allowed, {
    new: true,
    runValidators: true
  });
}