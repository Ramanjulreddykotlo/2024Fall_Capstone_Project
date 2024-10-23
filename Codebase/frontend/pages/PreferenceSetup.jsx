import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PreferenceSetup.css";

const PreferenceSetup = () => {
  const [preferences, setPreferences] = useState({
    budget: "",
    weather: "",
    foodPreferences: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingInitial, setLoadingInitial] = useState(true);
  const navigate = useNavigate();

  // Fetch existing preferences on component mount
  useEffect(() => {
    fetchExistingPreferences();
  }, []);

  const fetchExistingPreferences = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5980/api/preferences", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch preferences");
      }

      const data = await response.json();
      if (data) {
        setPreferences(data);
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
      setError("Failed to load your preferences. You can still set new ones.");
    } finally {
      setLoadingInitial(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear any previous errors
  };

  const handleFoodPreference = (preference) => {
    setPreferences((prev) => ({
      ...prev,
      foodPreferences: prev.foodPreferences.includes(preference)
        ? prev.foodPreferences.filter((p) => p !== preference)
        : [...prev.foodPreferences, preference],
    }));
    setError(""); // Clear any previous errors
  };

  const validatePreferences = () => {
    if (!preferences.budget) {
      setError("Please select a budget range");
      return false;
    }
    if (!preferences.weather) {
      setError("Please select your preferred weather");
      return false;
    }
    if (preferences.foodPreferences.length === 0) {
      setError("Please select at least one food preference");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePreferences()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5980/api/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error("Failed to save preferences");
      }

      // Navigate to recommendations page
      navigate("/recommendations");
    } catch (error) {
      console.error("Error saving preferences:", error);
      setError("Failed to save preferences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="preferences-container">
        <div className="preferences-loader">
          <div className="loader"></div>
          <p>Loading your preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preferences-container">
      <div className="preferences-header">
        <h2 className="preferences-title">Set Your Travel Preferences</h2>
        <p className="preferences-subtitle">
          Help us find your perfect destination
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="preferences-form">
        <div className="form-group">
          <label>Budget Range</label>
          <select
            name="budget"
            value={preferences.budget}
            onChange={handleChange}
            className={`input-field ${!preferences.budget && error ? "error" : ""}`}
            disabled={loading}
          >
            <option value="">Select Budget Range</option>
            <option value="budget">Budget ($0-$1000)</option>
            <option value="moderate">Moderate ($1000-$3000)</option>
            <option value="luxury">Luxury ($3000+)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Preferred Weather</label>
          <select
            name="weather"
            value={preferences.weather}
            onChange={handleChange}
            className={`input-field ${!preferences.weather && error ? "error" : ""}`}
            disabled={loading}
          >
            <option value="">Select Weather Preference</option>
            <option value="tropical">Tropical</option>
            <option value="moderate">Moderate</option>
            <option value="cold">Cold</option>
          </select>
        </div>

        <div className="form-group">
          <label>Food Preferences</label>
          <div className="food-preferences">
            {["Italian", "Asian", "Mediterranean", "Local"].map((cuisine) => (
              <button
                type="button"
                key={cuisine}
                className={`food-preference-btn ${
                  preferences.foodPreferences.includes(cuisine) ? "active" : ""
                }`}
                onClick={() => handleFoodPreference(cuisine)}
                disabled={loading}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className={`btn-primary ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? (
            <span className="loader"></span>
          ) : (
            <>
              <span>Save Preferences</span>
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
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PreferenceSetup;
