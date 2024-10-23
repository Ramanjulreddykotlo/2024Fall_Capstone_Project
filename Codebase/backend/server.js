const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const destinations = require("./destinations"); // Import destinations from separate file

const app = express();
const PORT = process.env.PORT || 5980;
const JWT_SECRET = "your-secret-key"; // In production, use environment variable

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage (replace with a proper database in production)
let users = [];
let preferences = [];

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// Auth Routes
app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    if (users.find((user) => user.email === email)) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = {
      id: users.length + 1,
      email,
      password: hashedPassword,
    };

    users.push(user);

    // Create and assign token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find((user) => user.email === email);
    if (!user) {
      return res.status(400).json({ error: "Email not found" });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Create and assign token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

// Preferences Routes
app.post("/api/preferences", authenticateToken, (req, res) => {
  try {
    const { budget, weather, foodPreferences } = req.body;
    const userId = req.user.id;

    // Remove existing preferences for user
    preferences = preferences.filter((pref) => pref.userId !== userId);

    // Add new preferences
    const userPreferences = {
      userId,
      budget,
      weather,
      foodPreferences,
    };

    preferences.push(userPreferences);
    res.json(userPreferences);
  } catch (error) {
    res.status(500).json({ error: "Error saving preferences" });
  }
});

app.get("/api/preferences", authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const userPreferences = preferences.find((pref) => pref.userId === userId);
    res.json(userPreferences || null);
  } catch (error) {
    res.status(500).json({ error: "Error fetching preferences" });
  }
});

// Recommendations Route
app.get("/api/recommendations", authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const userPreferences = preferences.find((pref) => pref.userId === userId);

    if (!userPreferences) {
      return res.json([]);
    }

    // Filter destinations based on preferences
    const recommendations = destinations.filter((destination) => {
      const budgetMatch = destination.budget === userPreferences.budget;
      const weatherMatch = destination.weather === userPreferences.weather;
      const foodMatch = destination.cuisines.some((cuisine) =>
        userPreferences.foodPreferences.includes(cuisine),
      );

      return budgetMatch || weatherMatch || foodMatch;
    });

    // Sort by number of matching criteria
    recommendations.sort((a, b) => {
      const aMatches = [
        a.budget === userPreferences.budget,
        a.weather === userPreferences.weather,
        a.cuisines.some((cuisine) =>
          userPreferences.foodPreferences.includes(cuisine),
        ),
      ].filter(Boolean).length;

      const bMatches = [
        b.budget === userPreferences.budget,
        b.weather === userPreferences.weather,
        b.cuisines.some((cuisine) =>
          userPreferences.foodPreferences.includes(cuisine),
        ),
      ].filter(Boolean).length;

      return bMatches - aMatches;
    });

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: "Error generating recommendations" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
