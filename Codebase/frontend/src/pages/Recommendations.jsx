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

// Pricing Modal Components
const FlightCard = ({ flight }) => {
  const date = new Date(flight.date);

  return (
    <div className="pricing-card">
      <div className="pricing-card-header">
        <div className="airline-info">
          <span className="airline-name">{flight.airline}</span>
          {flight.stops === 0 && <span className="direct-badge">Direct</span>}
        </div>
        <span className="price">${flight.price}</span>
      </div>

      <div className="flight-details">
        <div className="flight-route">
          <div className="flight-point">
            <div className="airport">{flight.from}</div>
            <div className="time">
              {date.getHours()}:{date.getMinutes().toString().padStart(2, "0")}
            </div>
          </div>
          <ArrowRight className="route-arrow" size={16} />
          <div className="flight-point">
            <div className="airport">{flight.to}</div>
            <div className="duration">{flight.duration}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AccommodationCard = ({ accommodation }) => {
  return (
    <div className="pricing-card">
      <div className="pricing-card-header">
        <div>
          <h3 className="accommodation-name">{accommodation.name}</h3>
          <p className="accommodation-type">{accommodation.type}</p>
        </div>
        <div className="price-container">
          <div className="price">${accommodation.pricePerNight}</div>
          <div className="price-subtitle">per night</div>
        </div>
      </div>

      <div className="rating">
        {Array(accommodation.rating)
          .fill(null)
          .map((_, i) => (
            <svg key={i} className="star-icon" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
      </div>

      <div className="amenities">
        {accommodation.amenities.map((amenity, index) => (
          <span key={index} className="amenity-tag">
            {amenity}
          </span>
        ))}
      </div>
    </div>
  );
};

const PricingModal = ({ destination, isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [travelers, setTravelers] = useState(2);
  const [activeTab, setActiveTab] = useState("flights");

  // Generate dummy flight data
  const generateFlightData = () => {
    const basePrice = {
      luxury: { min: 800, max: 1500 },
      moderate: { min: 400, max: 800 },
      affordable: { min: 200, max: 400 },
    }[destination.budget] || { min: 400, max: 800 };

    const flights = [];
    const startDate = new Date(selectedDate);

    for (let i = 0; i < 3; i++) {
      const hours = 6 + Math.floor(Math.random() * 12);
      const price =
        basePrice.min +
        Math.floor(Math.random() * (basePrice.max - basePrice.min));

      flights.push({
        id: `flight-${i}`,
        from: "EWR",
        to: destination.name,
        date: new Date(startDate.setHours(hours, 0, 0)),
        duration: "8h 30m",
        airline: ["United", "American", "Delta", "Emirates"][
          Math.floor(Math.random() * 4)
        ],
        price: price * travelers,
        stops: Math.random() > 0.7 ? 1 : 0,
      });
    }

    return flights.sort((a, b) => a.price - b.price);
  };

  // Generate dummy accommodation data
  const generateAccommodationData = () => {
    const basePricePerNight = {
      luxury: { min: 300, max: 1000 },
      moderate: { min: 150, max: 300 },
      affordable: { min: 50, max: 150 },
    }[destination.budget] || { min: 150, max: 300 };

    return [
      {
        id: 1,
        name: `${destination.name} Luxury Resort`,
        type: "Resort",
        rating: 5,
        pricePerNight: Math.floor(
          basePricePerNight.max * 0.8 +
            Math.random() * (basePricePerNight.max * 0.4),
        ),
        amenities: ["Pool", "Spa", "Restaurant", "Gym"],
      },
      {
        id: 2,
        name: `${destination.name} Downtown Hotel`,
        type: "Hotel",
        rating: 4,
        pricePerNight: Math.floor(
          basePricePerNight.min +
            Math.random() * (basePricePerNight.max - basePricePerNight.min),
        ),
        amenities: ["Restaurant", "Business Center", "Gym"],
      },
      {
        id: 3,
        name: `${destination.name} Boutique Inn`,
        type: "Boutique",
        rating: 4,
        pricePerNight: Math.floor(
          basePricePerNight.min * 1.2 +
            Math.random() * (basePricePerNight.max * 0.6),
        ),
        amenities: ["Free Breakfast", "WiFi", "Room Service"],
      },
    ];
  };

  const flights = generateFlightData();
  const accommodations = generateAccommodationData();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>
            Travel Details: {destination.name}, {destination.country}
          </h2>
          <button onClick={onClose} className="close-button">
            <X size={24} />
          </button>
        </div>

        <div className="modal-filters">
          <div className="filter-grid">
            <div className="filter-item">
              <label>Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="filter-item">
              <label>Travelers</label>
              <select
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Person" : "People"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-button ${activeTab === "flights" ? "active" : ""}`}
            onClick={() => setActiveTab("flights")}
          >
            <Plane size={20} />
            Flights
          </button>
          <button
            className={`tab-button ${activeTab === "accommodations" ? "active" : ""}`}
            onClick={() => setActiveTab("accommodations")}
          >
            <Hotel size={20} />
            Accommodations
          </button>
        </div>

        <div className="modal-content">
          {activeTab === "flights" && (
            <div className="flights-container">
              {flights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          )}

          {activeTab === "accommodations" && (
            <div className="accommodations-container">
              {accommodations.map((accommodation) => (
                <AccommodationCard
                  key={accommodation.id}
                  accommodation={accommodation}
                />
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="disclaimer">
            <Info size={16} />
            <span>Prices are indicative and subject to change</span>
          </div>
          <button onClick={onClose} className="close-button-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("matchScore");
  const [selectedDestination, setSelectedDestination] = useState(null);
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

  // ... (keep existing helper functions like getBudgetValue, formatTemperature, etc.)

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

      <WeatherLegend />

      {error && <div className="error-message">{error}</div>}

      {/* Keep existing controls-container and filters-container code */}

      <div className="recommendations-grid">
        {filterAndSortRecommendations(recommendations).map((destination) => (
          <div key={destination.id} className="destination-card">
            {/* Keep existing destination card structure, but update the explore button */}
            <button
              className="btn-explore"
              onClick={() => setSelectedDestination(destination)}
            >
              <span>Explore Destination</span>
              <Wind className="btn-icon" size={18} />
            </button>
          </div>
        ))}
      </div>

      {selectedDestination && (
        <PricingModal
          destination={selectedDestination}
          isOpen={!!selectedDestination}
          onClose={() => setSelectedDestination(null)}
        />
      )}

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
