import JournalEntry from "../models/journal-entry.js";

export async function createEntry({ title, body }) {
  return JournalEntry.create({ title, body });
}

export async function getAllEntries() {
  return JournalEntry.find({}).sort({ createdAt: -1 });
}
