import express from "express";
import db from "../database.js";

const router = express.Router();

// Read all todos for the logged-in user
router.get("/", (req, res) => {
  const getTodos = db.prepare(`SELECT * FROM todos WHERE user_id = ?`);
  const todos = getTodos.all(req.userId);
  res.json(todos);
});

// Create todos
router.post("/", (req, res) => {
  const { task } = req.body;
  const insertTodo = db.prepare(
    `INSERT INTO todos (user_id, task) VALUES (?, ?)`,
  );
  const result = insertTodo.run(req.userId, task);
  res.json({ id: result.lastInsertRowid, task, completed: 0 });
});

// Update todos
router.put("/:id", (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;
  const userId = req.userId;

  const updateTodo = db.prepare(
    `UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?`,
  );
  updateTodo.run(completed, id, userId);
  res.json({ message: "Todo completed" });
});

// Delete todos
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const deleteTodo = db.prepare(
    `DELETE FROM todos WHERE id = ? AND user_id = ?`,
  );
  deleteTodo.run(id, userId);
  res.json({ message: "Todo deleted" });
});

export default router;
