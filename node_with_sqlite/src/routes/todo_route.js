import express from "express";
import db from "../database.js";

const router = express.Router();

// Read all todos for the logged-in user
router.get("/", (req, res) => {
  const getTodos = db.prepare(`SELECT * FROM todos WHERE username = ?`);
  const todos = getTodos.all(req.userId);
  res.json(todos);
});

// Create todos
router.post("/", (req, res) => {
  const { task } = req.body;
  const insertTodo = db.prepare(
    `INSER INTO todos (user_id, task) VALUES (?, ?)`,
  );
  const result = insertTodo.run(req.userId, task);
  res.json({ id: result.lastInsertRowId, task, completed: 0 });
});

// Update todos
router.put("/:id", (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;
  const userId = req.userId;

  const updateTodo = db.prepare(
    `UPDATE todos SET completed = ? WHERE id = ? AND userId = ?`,
  );
  updateTodo.run(completed, id, userId);
  res.json({ message: "Todo completed" });
});

// Delete todos
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const deleteTodo = db.prepare(
    `DELETE FROM todos WHERE id = ? AND userId = ?`,
  );
  deleteTodo.run(id, userId);
  res.json({ message: "Todo deleted" });
});

export default router;
