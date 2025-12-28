import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import Menu from "./models/Menu.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🌿 MongoDB Connected"))
  .catch((err) => console.error(err));

app.get("/menu", async (req, res) => {
  try {
    const items = await Menu.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/menu/random", async (req, res) => {
  try {
    const count = await Menu.countDocuments();
    const random = Math.floor(Math.random() * count);
    const item = await Menu.findOne().skip(random);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () =>
  console.log("✅ Server running on http://localhost:3000")
);
