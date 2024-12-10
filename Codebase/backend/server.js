const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const WeatherService = require("./weatherService");
const FlightService = require("./flightService");
const destinations = require("./destinations");

const app = express();
const PORT = process.env.PORT || 5980;
const JWT_SECRET = "your-secret-key"; // In production, use environment variable

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage
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

// Flight Routes
app.get("/api/flights/search", authenticateToken, async (req, res) => {
  try {
    const { origin, destination, date, passengers } = req.query;

    if (!origin || !destination || !date) {
      return res
        .status(400)
        .json({ error: "Origin, destination, and date are required" });
    }

    // Get airport codes for origin and destination cities
    const originAirports = await FlightService.getNearbyAirports(origin);
    const destAirports = await FlightService.getNearbyAirports(destination);

    if (!originAirports.length || !destAirports.length) {
      return res
        .status(404)
        .json({ error: "No airports found for the specified cities" });
    }

    // Search flights using the first airport from each city
    const flights = await FlightService.searchFlights(
      originAirports[0],
      destAirports[0],
      date,
      parseInt(passengers) || 1,
    );

    res.json(flights);
  } catch (error) {
    console.error("Error searching flights:", error);
    res.status(500).json({ error: "Error searching flights" });
  }
});

app.get("/api/airports/search", authenticateToken, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const airports = await FlightService.getAirports(query);
    res.json(airports);
  } catch (error) {
    console.error("Error searching airports:", error);
    res.status(500).json({ error: "Error searching airports" });
  }
});

// Existing Auth Routes
app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (users.find((user) => user.email === email)) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      id: users.length + 1,
      email,
      password: hashedPassword,
    };

    users.push(user);
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Error creating user" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find((user) => user.email === email);
    if (!user) {
      return res.status(400).json({ error: "Email not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error logging in" });
  }
});

// Existing Preferences Routes
app.post("/api/preferences", authenticateToken, (req, res) => {
  try {
    const { budget, weather, foodPreferences } = req.body;
    const userId = req.user.id;

    if (!budget || !weather || !foodPreferences) {
      return res
        .status(400)
        .json({ error: "All preference fields are required" });
    }

    preferences = preferences.filter((pref) => pref.userId !== userId);

    const userPreferences = {
      userId,
      budget,
      weather,
      foodPreferences,
      timestamp: Date.now(),
    };

    preferences.push(userPreferences);
    res.json(userPreferences);
  } catch (error) {
    console.error("Error saving preferences:", error);
    res.status(500).json({ error: "Error saving preferences" });
  }
});

app.get("/api/preferences", authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const userPreferences = preferences.find((pref) => pref.userId === userId);
    res.json(userPreferences || null);
  } catch (error) {
    console.error("Error fetching preferences:", error);
    res.status(500).json({ error: "Error fetching preferences" });
  }
});

// Existing Weather Route
app.get("/api/weather/:destinationId", authenticateToken, async (req, res) => {
  try {
    const destination = destinations.find(
      (d) => d.id === parseInt(req.params.destinationId),
    );
    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }

    const weatherData = await WeatherService.getDestinationWeather(destination);
    if (!weatherData) {
      return res.status(404).json({ error: "Weather data not available" });
    }

    res.json(weatherData);
  } catch (error) {
    console.error("Error fetching weather:", error);
    res.status(500).json({ error: "Error fetching weather data" });
  }
});

// Existing Recommendations Route
app.get("/api/recommendations", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userPreferences = preferences.find((pref) => pref.userId === userId);

    if (!userPreferences) {
      return res.json([]);
    }

    console.log("Fetching recommendations for preferences:", userPreferences);

    const destinationsWithWeather = await Promise.all(
      destinations.map(async (destination) => {
        try {
          const weatherData =
            await WeatherService.getDestinationWeather(destination);
          console.log(`Weather data for ${destination.name}:`, weatherData);

          return {
            ...destination,
            currentWeather: weatherData,
          };
        } catch (error) {
          console.error(
            `Error fetching weather for ${destination.name}:`,
            error,
          );
          return {
            ...destination,
            currentWeather: null,
          };
        }
      }),
    );

    const scoredDestinations = destinationsWithWeather
      .map((destination) => {
        let score = 0;
        const matchDetails = [];

        if (
          destination.currentWeather &&
          WeatherService.matchesPreference(
            destination.currentWeather.type,
            userPreferences.weather,
          )
        ) {
          score += 40;
          matchDetails.push("weather");
        }

        if (destination.budget === userPreferences.budget) {
          score += 30;
          matchDetails.push("budget");
        }

        const matchingCuisines = destination.cuisines.filter((cuisine) =>
          userPreferences.foodPreferences.includes(cuisine),
        );
        if (matchingCuisines.length > 0) {
          score += 10 * matchingCuisines.length;
          matchDetails.push("cuisine");
        }

        return {
          ...destination,
          matchScore: score,
          matchDetails,
        };
      })
      .filter((destination) => destination.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json(scoredDestinations);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({ error: "Error generating recommendations" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
