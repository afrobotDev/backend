import express from "express";
import prisma from "../prisma.js";

const router = express.Router();

// Read all todos for the logged-in user
router.get("/", async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: { user_id: req.userId },
  });

  res.json(todos);
});

// Create todos
router.post("/", async (req, res) => {
  const { task } = req.body;

  const todo = await prisma.todo.create({
    data: {
      user_id: req.userId,
      task,
    },
  });

  res.json(todo);
});

// Update todos
router.put("/:id", async (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;
  const userId = req.userId;

  const updateTodo = await prisma.todo.update({
    where: {
      id: parseInt(id),
      user_id: userId,
    },
    data: { completed: !!completed },
  });

  res.json(updateTodo);
});

// Delete todos
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  await prisma.todo.delete({
    where: {
      id: parseInt(id),
      user_id: userId,
    },
  });

  res.json({ message: "Todo deleted" });
});

export default router;
