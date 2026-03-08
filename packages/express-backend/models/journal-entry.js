import mongoose from "mongoose";

const journalEntrySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    date: { type: Date, required: true },
    dateKey: { type: String, required: true },
    owner: { type: String, required: true }
  },
  { timestamps: true }
);

journalEntrySchema.index(
  { owner: 1, dateKey: 1 },
  { unique: true }
);

export default mongoose.model(
  "JournalEntry",
  journalEntrySchema
);
