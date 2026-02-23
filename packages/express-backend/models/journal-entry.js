import mongoose from "mongoose";

const journalEntrySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    date: { type: Date, required: true }
  },
  { timestamps: true }
);

export default mongoose.model(
  "JournalEntry",
  journalEntrySchema
);
