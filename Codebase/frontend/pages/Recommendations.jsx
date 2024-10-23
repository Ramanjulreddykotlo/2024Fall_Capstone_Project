import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Recommendations.css";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
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

  const filterRecommendations = (recommendations) => {
    if (activeFilter === "all") return recommendations;
    return recommendations.filter((rec) => rec.weather === activeFilter);
  };

  const getBudgetIcon = (budget) => {
    switch (budget) {
      case "budget":
        return "$";
      case "moderate":
        return "$$";
      case "luxury":
        return "$$$";
      default:
        return "$";
    }
  };

  if (loading) {
    return (
      <div className="recommendations-container">
        <div className="recommendations-loader">
          <div className="loader"></div>
          <p>Loading your personalized recommendations...</p>
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

      <div className="filters-container">
        <button
          className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          All
        </button>
        <button
          className={`filter-btn ${activeFilter === "tropical" ? "active" : ""}`}
          onClick={() => setActiveFilter("tropical")}
        >
          Tropical
        </button>
        <button
          className={`filter-btn ${activeFilter === "moderate" ? "active" : ""}`}
          onClick={() => setActiveFilter("moderate")}
        >
          Moderate
        </button>
        <button
          className={`filter-btn ${activeFilter === "cold" ? "active" : ""}`}
          onClick={() => setActiveFilter("cold")}
        >
          Cold
        </button>
      </div>

      <div className="recommendations-grid">
        {filterRecommendations(recommendations).map((destination) => (
          <div key={destination.id} className="destination-card">
            <div
              className="destination-image"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("${destination.imageUrl}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="destination-badge">{destination.weather}</div>
            </div>
            <div className="destination-content">
              <h3 className="destination-name">{destination.name}</h3>
              <p className="destination-description">
                {destination.description}
              </p>
              <div className="destination-details">
                <span className="budget-indicator">
                  {getBudgetIcon(destination.budget)}
                </span>
                <div className="cuisine-tags">
                  {destination.cuisines.map((cuisine, index) => (
                    <span key={index} className="cuisine-tag">
                      {cuisine}
                    </span>
                  ))}
                </div>
              </div>
              <button className="btn-explore">
                <span>Explore</span>
                <svg
                  className="btn-arrow"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4L20 12L12 20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 12H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filterRecommendations(recommendations).length === 0 && (
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
