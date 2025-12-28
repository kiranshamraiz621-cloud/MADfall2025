// server.js
const express = require("express");
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory "database"
let todos = [
  { id: 1, task: "Buy groceries", done: false },
  { id: 2, task: "Walk the dog", done: true }
];

// Get all todos
app.get("/todos", (req, res) => {
  res.json(todos);
});

// Add a new todo
app.post("/todos", (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({ error: "Task is required" });

  const newTodo = { id: Date.now(), task, done: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Update a todo (mark done or edit task)
app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { task, done } = req.body;

  const todo = todos.find(t => t.id == id);
  if (!todo) return res.status(404).json({ error: "Todo not found" });

  if (task !== undefined) todo.task = task;
  if (done !== undefined) todo.done = done;

  res.json(todo);
});

// Delete a todo
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const index = todos.findIndex(t => t.id == id);
  if (index === -1) return res.status(404).json({ error: "Todo not found" });

  const deleted = todos.splice(index, 1);
  res.json(deleted[0]);
});

// Start server
app.listen(3000, () => console.log("To-Do API running on http://localhost:3000"));