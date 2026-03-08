import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import * as journalService from "./services/journal-service.js";
import {
  authenticateUser,
  loginUser,
  registerUser
} from "./auth.js";

//to run back end: npm run dev
//alt way to run: npm run start --workspace=express-backend
dotenv.config();

console.log(
  "MONGO_CONNECTION_STRING =",
  process.env.MONGO_CONNECTION_STRING
);

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
const base = MONGO_CONNECTION_STRING.replace(/\/+$/, "");
mongoose
  .connect(`${base}/journal`)
  .then(() => console.log("✅ MongoDB connected to journal DB"))
  .catch((error) => console.log("❌ MongoDB error:", error));

//express setup
const app = express();
const port = 8000;

app.use(
  cors({
    origin:
      "https://witty-desert-068c7511e.6.azurestaticapps.net",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// // Respond to preflight OPTIONS requests
// app.options("*", (req, res) => {
//   res.header("Access-Control-Allow-Origin", allowedOrigin);
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET,POST,PUT,DELETE,OPTIONS"
//   );
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Content-Type,Authorization"
//   );
//   res.sendStatus(200); // immediately respond
// });

app.use(express.json());

// ----
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.path}`);
  next();
});
//---

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/signup", registerUser);
app.post("/login", loginUser);

app.get("/me", authenticateUser, (req, res) => {
  return res.status(200).json({ ok: true });
});

// GET /entries
app.get("/entries", authenticateUser, async (req, res) => {
  try {
    const owner = req.user.username;
    const entries =
      await journalService.getEntriesByOwner(owner);
    res.status(200).json({ entries });
  } catch (error) {
    console.error("GET /entries error:", error);
    res.status(500).send("An error occurred in the server.");
  }
});

// GET /entries/by-date/:date
app.get(
  "/entries/by-date/:date",
  authenticateUser,
  async (req, res) => {
    try {
      const owner = req.user.username;
      const { date } = req.params;

      const entry =
        await journalService.getEntryByDateForOwner(
          date,
          owner
        );

      if (!entry) {
        return res.status(200).json({ entry: null });
      }

      return res.status(200).json({ entry });
    } catch (error) {
      console.error("GET /entries/by-date/:date error:", error);
      return res
        .status(500)
        .send("An error occurred in the server.");
    }
  }
);

// POST /entries
app.post("/entries", authenticateUser, async (req, res) => {
  try {
    console.log("POST /entries hit");
    console.log("content-type:", req.headers["content-type"]);
    console.log("body:", req.body);

    const { title, body, date } = req.body ?? {};
    if (!title || !body || !date) {
      return res
        .status(400)
        .send("title and body and date are required.");
    }

    const owner = req.user.username;
    const saved = await journalService.upsertEntryByDateForOwner({
      title,
      body,
      date,
      owner
    });

    res.status(200).json(saved);
  } catch (error) {
    console.error("POST /entries error:", error);
    console.error(error?.stack);
    res.status(500).send("An error occurred in the server.");
  }
});


app.get("/entries/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const owner = req.user.username;

    const entry = await journalService.getEntryByIdForOwner(
      id,
      owner
    );

    if (!entry) return res.status(404).send("Entry not found.");
    return res.status(200).json(entry);
  } catch (error) {
    console.error("GET /entries/:id error:", error);
    return res
      .status(500)
      .send("An error occurred in the server.");
  }
});

// DELETE /entries/:id
app.delete(
  "/entries/:id",
  authenticateUser,
  async (req, res) => {
    try {
      const { id } = req.params;
      const owner = req.user.username;

      const deleted =
        await journalService.deleteEntryByIdForOwner(id, owner);

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
  }
);

// PUT /entries/:id  (edit an entry)
// backend.js — verbose safe PUT route
app.put("/entries/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body, date } = req.body ?? {};

    console.log("PUT /entries/:id called, id=", id);
    console.log("Request body:", { title, body, date });
    console.log("req.user (from auth):", req.user);

    if (!req.user) {
      console.error("No req.user — token missing or invalid");
      return res.status(401).send("Unauthorized: no user");
    }

    if (!title || !body) {
      return res
        .status(400)
        .send("title and body are required.");
    }

    // call the correctly-named service function
    const updated =
      await journalService.updateEntryByIdForOwner(
        id,
        req.user.username,
        { title, body, date }
      );

    if (!updated) {
      console.log(
        "Update returned null -> not found or not owner"
      );
      return res.status(404).send("Entry not found.");
    }

    console.log("Update success:", updated._id);
    return res.status(200).json(updated);
  } catch (error) {
    console.error("🔥 PUT /entries/:id error:", error);
    // expose error message & stack to help debugging (remove in prod)
    return res
      .status(500)
      .json({ error: error.message, stack: error.stack });
  }
});

//---
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res
    .status(500)
    .json({ error: err.message || "Server error" });
});
//----

app.listen(process.env.PORT || port, () => {
  console.log(console.log("REST API is listening."));
});
