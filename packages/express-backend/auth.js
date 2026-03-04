import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./models/user.js"; 

function generateAccessToken(username) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username },
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) reject(error);
        else resolve(token);
      }
    );
  });
}

// registerUser
export async function registerUser(req, res) {
  try {
    const { username, password } = req.body ?? {};

    if (!username || !password) {
      return res.status(400).send("Bad request: Invalid input data.");
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).send("Username already taken");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ username, passwordHash });

    const token = await generateAccessToken(username);
    return res.status(201).json({ token });
  } catch (err) {
    console.error("registerUser error:", err);

    // Optional: nicer duplicate username message from Mongo
    if (err?.code === 11000) {
      return res.status(409).send("Username already taken");
    }

    return res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
}

export async function loginUser(req, res) {
  try {
    const { username, password } = req.body ?? {};

    if (!username || !password) {
      return res.status(400).send("Bad request: Invalid input data.");
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(401).send("Unauthorized");

    const matched = await bcrypt.compare(password, user.passwordHash);
    if (!matched) return res.status(401).send("Unauthorized");

    const token = await generateAccessToken(username);
    return res.status(200).json({ token });
  } catch (err) {
    console.error("loginUser error:", err);
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
}

// authenticateUser
export function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send("Missing token");

  jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
    if (error || !decoded) return res.status(401).send("Invalid token");
    req.user = decoded;
    next();
  });
}