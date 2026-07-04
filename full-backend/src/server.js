import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoute from "./routes/auth_route.js";
import todoRoute from "./routes/todo_route.js";
import authMiddleware from "./middleware/auth_middleware.js";

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Routes
app.use("/auth", authRoute);
app.use("/todos", authMiddleware, todoRoute);
