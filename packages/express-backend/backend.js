import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import * as journalService from "./services/journal-service.js";

//to run back end: npm run dev
//alt way to run: npm run start --workspace=express-backend
dotenv.config();

console.log(
  "MONGO_CONNECTION_STRING =",
  process.env.MONGO_CONNECTION_STRING
);

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "journal")
  .then(() => console.log("✅ MongoDB connected to journal DB"))
  .catch((error) => console.log("❌ MongoDB error:", error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Hello World!"));

// GET /entries
app.get("/entries", async (req, res) => {
  try {
    const entries = await journalService.getAllEntries();
    res.status(200).json({ entries });
  } catch (error) {
    console.error("GET /entries error:", error);
    res.status(500).send("An error occurred in the server.");
  }
});

// POST /entries
app.post("/entries", async (req, res) => {
  try {
    console.log("POST /entries hit");
    console.log("content-type:", req.headers["content-type"]);
    console.log("body:", req.body);

    const { title, body, date } = req.body ?? {};
    if (!title || !body || !date)
      return res
        .status(400)
        .send("title and body and date are required.");

    const saved = await journalService.createEntry({
      title,
      body,
      date
    });
    res.status(201).json(saved);
  } catch (error) {
    console.error("POST /entries error:", error);
    console.error(error?.stack);
    res.status(500).send("An error occurred in the server.");
  }
});

app.get("/entries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await journalService.getEntryById(id);
    if (!entry) return res.status(404).send("Entry not found.");
    return res.status(200).json(entry);
  } catch (error) {
    console.error("GET /entries/:id error:", error);
    return res
      .status(500)
      .send("An error occurred in the server.");
  }
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

// DELETE /entries/:id
app.delete("/entries/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await journalService.deleteEntryById(id);

    if (!deleted) {
      return res.status(404).send("Entry not found.");
    }

    // either return the deleted doc or just a success message
    return res
      .status(200)
      .json({ message: "Entry deleted.", id });
  } catch (error) {
    console.error("DELETE /entries/:id error:", error);
    return res
      .status(500)
      .send("An error occurred in the server.");
  }
});

// PUT /entries/:id  (edit an entry)
app.put("/entries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body, date } = req.body ?? {};

    // Optional: basic validation (title/body required for your schema)
    if (!title || !body) {
      return res
        .status(400)
        .send("title and body are required.");
    }

    const updated = await journalService.updateEntryById(id, {
      title,
      body,
      date
    });

    if (!updated)
      return res.status(404).send("Entry not found.");

    return res.status(200).json(updated);
  } catch (error) {
    console.error("PUT /entries/:id error:", error);
    return res
      .status(500)
      .send("An error occurred in the server.");
  }
});
