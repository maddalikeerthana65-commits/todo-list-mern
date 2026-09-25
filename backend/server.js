require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./models/User");
const Todo = require("./models/Todo");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

// Test route
app.get("/", (req, res) => {
  res.send("Todo API is running!");
});

// REGISTER ROUTE
app.post("/api/register", async (req, res) => {
  try {
    console.log("Register request received");

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    console.log("User registered successfully");

    res.status(201).json({
      message: "Registration successful",
    });
  } catch (error) {
  console.error("Registration error:", error);

  res.status(500).json({
    message: "Server error",
    error: error.message,
  });
}
});
// LOGIN ROUTE
app.post("/api/login", async (req, res) => {
  try {
    console.log("Login request received");

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "No account found",
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }

    console.log("Login successful");

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});
// GET TODOS FOR LOGGED-IN USER
app.get("/api/todos/:userId", async (req, res) => {
  try {
    const todos = await Todo.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(todos);
 } catch (error) {
  console.error("Delete todo error:", error);

  res.status(500).json({
    message: "Server error",
  });
}
});

// ADD TODO FOR USER
app.post("/api/todos", async (req, res) => {
  try {
    const { text, userId } = req.body;

    if (!text || !userId) {
      return res.status(400).json({
        message: "Task and user are required",
      });
    }

    const todo = new Todo({
      text,
      userId,
    });

    await todo.save();

    console.log("Todo added:", todo.text);

    res.status(201).json(todo);
  } catch (error) {
    console.error("Add todo error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// UPDATE TODO
app.put("/api/todos/:id", async (req, res) => {
  try {
    const { completed } = req.body;

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { completed },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.status(200).json(todo);
  } catch (error) {
    console.error("Update todo error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// DELETE TODO
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    console.log("Todo deleted:", todo.text);

    res.status(200).json({
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.error("Delete todo error:", error);

    res.status(500).json({
      message: "Todo deleted successfully",
    });
  }
});
// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});