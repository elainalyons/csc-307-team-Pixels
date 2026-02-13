import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import * as journalService from "./services/journal-service.js";

//to run back end: npm run dev 

dotenv.config();

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

    const { title, body } = req.body ?? {};
    if (!title || !body)
      return res
        .status(400)
        .send("title and body are required.");

    const saved = await journalService.createEntry({
      title,
      body
    });
    res.status(201).json(saved);
  } catch (error) {
    console.error("POST /entries error:", error);
    console.error(error?.stack);
    res.status(500).send("An error occurred in the server.");
  }
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
