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
