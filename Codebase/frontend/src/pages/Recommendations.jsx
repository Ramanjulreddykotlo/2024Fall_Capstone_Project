import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SmartFilters from "../components/SmartFilters";
import NotificationCenter from "../components/NotificationCenter";
import PricingModal from "../components/PricingModal";
import {
  Cloud,
  Sun,
  Snowflake,
  Droplets,
  Loader2,
  Wind,
  Map,
  DollarSign,
  Utensils,
  ThermometerSun,
  ThermometerSnowflake,
  Droplet,
  Plane,
  Hotel,
  Calendar,
  Users,
  ArrowRight,
  X,
  AlertCircle,
  Check,
  Info,
} from "lucide-react";
import "./Recommendations.css";

const WeatherIcon = ({ type, size = 20 }) => {
  switch (type?.toLowerCase()) {
    case "tropical":
      return <Droplets className="weather-icon tropical" size={size} />;
    case "hot":
      return <Sun className="weather-icon hot" size={size} />;
    case "cold":
      return <Snowflake className="weather-icon cold" size={size} />;
    case "moderate":
      return <Cloud className="weather-icon moderate" size={size} />;
    default:
      return <Cloud className="weather-icon" size={size} />;
  }
};

const WeatherLegend = () => (
  <div className="weather-legend">
    <h3 className="legend-title">Weather Guide</h3>
    <div className="legend-items">
      <div className="legend-item">
        <WeatherIcon type="hot" />
        <div className="legend-content">
          <span>Hot Climate</span>
          <span className="legend-description">Above 30°C</span>
        </div>
      </div>
      <div className="legend-item">
        <WeatherIcon type="moderate" />
        <div className="legend-content">
          <span>Moderate Climate</span>
          <span className="legend-description">15-25°C</span>
        </div>
      </div>
      <div className="legend-item">
        <WeatherIcon type="cold" />
        <div className="legend-content">
          <span>Cold Climate</span>
          <span className="legend-description">Below 10°C</span>
        </div>
      </div>
      <div className="legend-item">
        <WeatherIcon type="tropical" />
        <div className="legend-content">
          <span>Tropical Climate</span>
          <span className="legend-description">Warm & Humid</span>
        </div>
      </div>
    </div>
  </div>
);

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("matchScore");
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    cuisineTypes: ["Italian", "Asian", "Mediterranean", "Local"],
    weatherPreference: "",
    landmarks: ["Beach", "City Center", "Mountains", "Historic Sites"],
    selectedCuisines: [],
    selectedLandmarks: [],
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  // Simulate price alerts
  useEffect(() => {
    const timer = setInterval(() => {
      const destinations = ["Paris", "Tokyo", "New York", "London"];
      const randomDestination =
        destinations[Math.floor(Math.random() * destinations.length)];
      const priceChange = Math.floor(Math.random() * 200) - 100;

      if (Math.random() > 0.7) {
        setNotifications((prev) => [
          {
            id: Date.now(),
            type: priceChange < 0 ? "PRICE_DROP" : "PRICE_INCREASE",
            title: `Price ${priceChange < 0 ? "Drop" : "Increase"} Alert`,
            message: `Flights to ${randomDestination} have ${
              priceChange < 0 ? "decreased" : "increased"
            } by $${Math.abs(priceChange)}`,
            timestamp: new Date(),
            read: false,
          },
          ...prev.slice(0, 4),
        ]);
      }
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5980/api/recommendations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      setError("Failed to load recommendations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortRecommendations = (recommendations) => {
    let filtered = recommendations;

    // Smart Filters
    if (filters.selectedCuisines.length > 0) {
      filtered = filtered.filter((rec) =>
        rec.cuisines.some((cuisine) =>
          filters.selectedCuisines.includes(cuisine),
        ),
      );
    }

    if (filters.weatherPreference) {
      filtered = filtered.filter(
        (rec) => rec.weather === filters.weatherPreference,
      );
    }

    // Price range filter
    filtered = filtered.filter((rec) => {
      const estimatedCost =
        rec.budget === "luxury" ? 3000 : rec.budget === "moderate" ? 1500 : 500;
      return (
        estimatedCost >= filters.priceRange[0] &&
        estimatedCost <= filters.priceRange[1]
      );
    });

    // Weather filter
    if (activeFilter !== "all") {
      filtered = filtered.filter((rec) => rec.weather === activeFilter);
    }

    // Sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "matchScore":
          return b.matchScore - a.matchScore;
        case "price":
          return getBudgetValue(a.budget) - getBudgetValue(b.budget);
        case "temperature":
          return (
            (b.currentWeather?.temperature || 0) -
            (a.currentWeather?.temperature || 0)
          );
        default:
          return 0;
      }
    });
  };

  const getBudgetValue = (budget) => {
    switch (budget) {
      case "affordable":
        return 1;
      case "moderate":
        return 2;
      case "luxury":
        return 3;
      default:
        return 1;
    }
  };

  const getBudgetIcon = (budget) => {
    switch (budget) {
      case "budget":
      case "affordable":
        return "$";
      case "moderate":
        return "$$";
      case "luxury":
        return "$$$";
      default:
        return "$";
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 70) return "excellent";
    if (score >= 50) return "good";
    return "fair";
  };

  if (loading) {
    return (
      <div className="recommendations-container">
        <div className="recommendations-loader">
          <Loader2 className="loader-icon" size={40} />
          <p>Discovering your perfect destinations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <div className="flex justify-between items-center">
          <h1 className="recommendations-title">Your Travel Recommendations</h1>
          <NotificationCenter
            notifications={notifications}
            onDismiss={(id) =>
              setNotifications((prev) => prev.filter((n) => n.id !== id))
            }
            onClearAll={() => setNotifications([])}
          />
        </div>
        <p className="recommendations-subtitle">
          Personalized destinations based on your preferences
        </p>
      </div>

      <WeatherLegend />

      {error && <div className="error-message">{error}</div>}

      <div className="flex gap-6">
        <div className="w-1/4">
          <SmartFilters
            filters={filters}
            onChange={setFilters}
            onReset={() => {
              setFilters({
                priceRange: [0, 5000],
                cuisineTypes: ["Italian", "Asian", "Mediterranean", "Local"],
                weatherPreference: "",
                landmarks: [
                  "Beach",
                  "City Center",
                  "Mountains",
                  "Historic Sites",
                ],
                selectedCuisines: [],
                selectedLandmarks: [],
              });
            }}
          />
        </div>

        <div className="flex-1">
          <div className="controls-container">
            <div className="filters-container">
              <button
                className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                <Map size={16} />
                All
              </button>
              <button
                className={`filter-btn ${
                  activeFilter === "tropical" ? "active" : ""
                }`}
                onClick={() => setActiveFilter("tropical")}
              >
                <Droplets size={16} />
                Tropical
              </button>
              <button
                className={`filter-btn ${
                  activeFilter === "moderate" ? "active" : ""
                }`}
                onClick={() => setActiveFilter("moderate")}
              >
                <Cloud size={16} />
                Moderate
              </button>
              <button
                className={`filter-btn ${
                  activeFilter === "cold" ? "active" : ""
                }`}
                onClick={() => setActiveFilter("cold")}
              >
                <Snowflake size={16} />
                Cold
              </button>
              <button
                className={`filter-btn ${activeFilter === "hot" ? "active" : ""}`}
                onClick={() => setActiveFilter("hot")}
              >
                <Sun size={16} />
                Hot
              </button>
            </div>

            <div className="sort-container">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="matchScore">Best Match</option>
                <option value="price">Price</option>
                <option value="temperature">Temperature</option>
              </select>
            </div>
          </div>

          <div className="recommendations-grid">
            {filterAndSortRecommendations(recommendations).map(
              (destination) => (
                <div key={destination.id} className="destination-card">
                  <div
                    className="destination-image"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("${destination.imageUrl}")`,
                    }}
                  >
                    <div className="destination-badge">
                      <div className="weather-badge">
                        <WeatherIcon type={destination.weather} />
                        {destination.weather}
                      </div>
                    </div>
                    <div
                      className={`match-score-badge ${getMatchScoreColor(
                        destination.matchScore,
                      )}`}
                    >
                      {destination.matchScore}% Match
                    </div>
                  </div>

                  <div className="destination-content">
                    <div className="destination-header">
                      <h3 className="destination-name">
                        {destination.name}, {destination.country}
                      </h3>
                      <span className="budget-indicator">
                        {getBudgetIcon(destination.budget)}
                      </span>
                    </div>

                    <p className="destination-description">
                      {destination.description}
                    </p>

                    <div className="cuisine-tags">
                      {destination.cuisines.map((cuisine, index) => (
                        <span key={index} className="cuisine-tag">
                          <Utensils size={14} />
                          {cuisine}
                        </span>
                      ))}
                    </div>

                    <button
                      className="btn-explore"
                      onClick={() => setSelectedDestination(destination)}
                    >
                      <span>Explore Destination</span>
                      <Wind className="btn-icon" size={18} />
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>

          {filterAndSortRecommendations(recommendations).length === 0 && (
            <div className="no-results">
              <h3>No destinations found</h3>
              <p>Try adjusting your filters or updating your preferences</p>
              <button
                className="btn-primary"
                onClick={() => navigate("/preferences")}
              >
                Update Preferences
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <PricingModal
        destination={selectedDestination}
        isOpen={!!selectedDestination}
        onClose={() => setSelectedDestination(null)}
      />
    </div>
  );
};

export default Recommendations;
