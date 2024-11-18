import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
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
} from "lucide-react";
import "./Recommendations.css";

const WeatherIcon = ({ type, size = 20 }) => {
  switch (type) {
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

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("matchScore"); // New sorting state
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
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

    // Apply filter
    if (activeFilter !== "all") {
      filtered = recommendations.filter((rec) => {
        if (rec.currentWeather) {
          return rec.currentWeather.type === activeFilter;
        }
        return rec.weather === activeFilter;
      });
    }

    // Apply sorting
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

  const formatTemperature = (temp) => {
    return temp ? `${Math.round(temp)}°C` : "N/A";
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
        <h1 className="recommendations-title">Your Travel Recommendations</h1>
        <p className="recommendations-subtitle">
          Personalized destinations based on your preferences
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

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
            className={`filter-btn ${activeFilter === "tropical" ? "active" : ""}`}
            onClick={() => setActiveFilter("tropical")}
          >
            <Droplets size={16} />
            Tropical
          </button>
          <button
            className={`filter-btn ${activeFilter === "moderate" ? "active" : ""}`}
            onClick={() => setActiveFilter("moderate")}
          >
            <Cloud size={16} />
            Moderate
          </button>
          <button
            className={`filter-btn ${activeFilter === "cold" ? "active" : ""}`}
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
        {filterAndSortRecommendations(recommendations).map((destination) => (
          <div key={destination.id} className="destination-card">
            <div
              className="destination-image"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("${destination.imageUrl}")`,
              }}
            >
              <div className="destination-badge">
                {destination.currentWeather ? (
                  <div className="weather-badge">
                    <WeatherIcon type={destination.currentWeather.type} />
                    <span>
                      {formatTemperature(
                        destination.currentWeather.temperature,
                      )}
                    </span>
                  </div>
                ) : (
                  <WeatherIcon type={destination.weather} />
                )}
              </div>
              <div
                className={`match-score-badge ${getMatchScoreColor(destination.matchScore)}`}
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

              {destination.currentWeather && (
                <div className="weather-details">
                  <div className="weather-stats">
                    <div className="weather-stat">
                      <ThermometerSun size={16} />
                      <span>
                        High:{" "}
                        {formatTemperature(destination.currentWeather.maxTemp)}
                      </span>
                    </div>
                    <div className="weather-stat">
                      <ThermometerSnowflake size={16} />
                      <span>
                        Low:{" "}
                        {formatTemperature(destination.currentWeather.minTemp)}
                      </span>
                    </div>
                    <div className="weather-stat">
                      <Droplet size={16} />
                      <span>
                        Humidity: {destination.currentWeather.humidity}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="cuisine-tags">
                {destination.cuisines.map((cuisine, index) => (
                  <span key={index} className="cuisine-tag">
                    <Utensils size={14} />
                    {cuisine}
                  </span>
                ))}
              </div>

              <button className="btn-explore">
                <span>Explore Destination</span>
                <Wind className="btn-icon" size={18} />
              </button>
            </div>
          </div>
        ))}
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
  );
};

export default Recommendations;
