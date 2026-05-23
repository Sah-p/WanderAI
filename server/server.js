import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Contact from "./models/Contact.js";
import Trip from "./models/Trip.js";
import User from "./models/User.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* =========================
   MONGODB CONNECTION
========================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

/* =========================
   OPENROUTER AI CLIENT
========================= */

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

/* =========================
   AUTH MIDDLEWARE
   Verifies JWT from header
========================= */

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

/* =========================
   ADMIN MIDDLEWARE
   Ensures user is admin
========================= */

const adminMiddleware = (req, res, next) => {
  if (req.user?.id !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};

/* =========================
   HOME ROUTE
========================= */

app.get("/", (req, res) => {
  res.send("WanderAI Backend Running");
});

/* =========================
   SIGNUP
========================= */

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Signup Successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Signup Failed" });
  }
});

/* =========================
   LOGIN
========================= */

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    /* ---- ADMIN LOGIN (from .env) ---- */
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ id: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.json({
        token,
        user: {
          id: "admin",
          name: "Admin",
          email: process.env.ADMIN_EMAIL,
          isAdmin: true,
        },
      });
    }

    /* ---- NORMAL USER LOGIN ---- */
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: false,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login Failed" });
  }
});

/* =========================
   GENERATE AI TRIP
   Protected — logged-in users
========================= */

app.post("/generate-trip", authMiddleware, async (req, res) => {
  try {
    const { destination, budget, days, style } = req.body;

    if (!destination || !budget || !days || !style) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const prompt = `
Create a detailed ${days}-day travel itinerary for ${destination} with a budget of ₹${budget}.
Travel Style: ${style}

Include:
- Day-wise itinerary
- Places to visit
- Food recommendations
- Estimated expenses
- Travel tips
- Hidden gems
`;

    const completion = await client.chat.completions.create({
      model: "deepseek/deepseek-chat",
      messages: [{ role: "user", content: prompt }],
    });

    const trip = completion.choices[0].message.content;
    res.json({ trip });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error generating trip" });
  }
});

/* =========================
   SAVE TRIP
   Protected — logged-in users
========================= */

app.post("/save-trip", authMiddleware, async (req, res) => {
  try {
    const { userId, destination, budget, days, style, trip } = req.body;

    const newTrip = new Trip({ userId, destination, budget, days, style, trip });
    await newTrip.save();

    res.json({ message: "Trip Saved Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error saving trip" });
  }
});

/* =========================
   GET TRIPS
   Admin: all trips
   User: only their own
========================= */

app.get("/trips", authMiddleware, async (req, res) => {
  try {
    const filter = req.user.id === "admin" ? {} : { userId: req.user.id };
    const trips = await Trip.find(filter).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching trips" });
  }
});

/* =========================
   DELETE TRIP
   Owner or Admin only
========================= */

app.delete("/trips/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (req.user.id !== "admin" && trip.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: "Trip Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting trip" });
  }
});

/* =========================
   CONTACT FORM
   Public
========================= */

app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.json({ message: "Message Sent Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error saving contact" });
  }
});

/* =========================
   GET ALL USERS
   Admin only
========================= */

app.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

/* =========================
   DELETE USER
   Admin only
========================= */

app.delete("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

/* =========================
   GET ALL CONTACTS
   Admin only
========================= */

app.get("/contacts", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching contacts" });
  }
});

/* =========================
   DELETE CONTACT
   Admin only
========================= */

app.delete("/contacts/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Contact Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting contact" });
  }
});

/* =========================
   CHATBOT
   Protected — logged-in users
========================= */

app.post("/chat", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "Message required" });

    const completion = await client.chat.completions.create({
      model: "deepseek/deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are WanderAI, an expert AI travel assistant for India. Help users with travel planning, hotels, food, budget, attractions, hidden gems, and travel tips. Be friendly, concise, and helpful.",
        },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Chatbot Error" });
  }
});

/* =========================
   FORGOT PASSWORD CHECK
========================= */

app.post("/forgot-password/check", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    res.json({
      message: "Email exists",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* =========================
   RESET PASSWORD
========================= */

app.post("/forgot-password/reset", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { password: hashedPassword }
    );

    res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Reset failed",
    });
  }
});
/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
