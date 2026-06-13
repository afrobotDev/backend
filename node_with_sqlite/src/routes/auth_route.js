import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../database.js";

const router = express.Router();

// Register a new user
router.post("/auth/register", (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    const insertUser = db.prepare(
      `INSERT INTO users (username, password) VALUES (?, ?)`,
    );
    const result = insertUser.run(username, hashedPassword);

    const defaultTodo = "Hello, add you first todo!";
    const insertTodo = db.prepare(
      `INSERT INTO todos (user_id, task) VALUES (?, ?)`,
    );
    insertTodo.run(result.lastInsertRowid, defaultTodo);

    const token = jwt.sign(
      { id: result.lastInsertRowid },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );
    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

export default router;
