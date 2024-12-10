import React, { useState, useEffect } from "react";
import {
  Plane,
  Hotel,
  Calendar,
  DollarSign,
  Users,
  ArrowRight,
  X,
  AlertCircle,
  Check,
  Loader,
} from "lucide-react";

const FlightSearchForm = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    origin: "",
    destination: "",
    date: "",
    passengers: 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Origin
          </label>
          <input
            type="text"
            value={searchParams.origin}
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, origin: e.target.value }))
            }
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="City or Airport"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destination
          </label>
          <input
            type="text"
            value={searchParams.destination}
            onChange={(e) =>
              setSearchParams((prev) => ({
                ...prev,
                destination: e.target.value,
              }))
            }
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="City or Airport"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={searchParams.date}
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, date: e.target.value }))
            }
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Passengers
          </label>
          <select
            value={searchParams.passengers}
            onChange={(e) =>
              setSearchParams((prev) => ({
                ...prev,
                passengers: parseInt(e.target.value),
              }))
            }
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Passenger" : "Passengers"}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        <Plane className="w-5 h-5" />
        Search Flights
      </button>
    </form>
  );
};

const FlightCard = ({ flight }) => (
  <div className="bg-white p-4 border rounded-lg mb-3 hover:border-blue-500 transition-colors">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2">
        <span className="font-semibold">{flight.airline}</span>
        {flight.stops === 0 && (
          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
            Direct
          </span>
        )}
      </div>
      <span className="font-bold text-lg">${flight.price}</span>
    </div>
    <div className="flex justify-between text-sm text-gray-600">
      <div className="flex items-center gap-6">
        <div>
          <div className="font-semibold">{flight.departure?.airport}</div>
          <div>{flight.departure?.time}</div>
        </div>
        <ArrowRight className="text-gray-400" size={16} />
        <div>
          <div className="font-semibold">{flight.arrival?.airport}</div>
          <div>{flight.duration}</div>
        </div>
      </div>
    </div>
  </div>
);

const PricingModal = ({ destination, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("flights");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchFlights = async (searchParams) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        origin: searchParams.origin,
        destination: destination.name,
        date: searchParams.date,
        passengers: searchParams.passengers,
      });

      const response = await fetch(
        `http://localhost:5980/api/flights/search?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch flights");
      }

      const data = await response.json();
      setFlights(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Travel Details: {destination.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === "flights"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("flights")}
          >
            <div className="flex items-center justify-center gap-2">
              <Plane size={20} />
              Flights
            </div>
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === "accommodations"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("accommodations")}
          >
            <div className="flex items-center justify-center gap-2">
              <Hotel size={20} />
              Accommodations
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "flights" && (
            <div className="space-y-6">
              <FlightSearchForm onSearch={searchFlights} />

              {loading && (
                <div className="text-center py-8">
                  <Loader className="animate-spin w-8 h-8 mx-auto mb-2" />
                  <p>Searching for flights...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              {!loading && !error && flights.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Available Flights
                  </h3>
                  {flights.map((flight, index) => (
                    <FlightCard key={index} flight={flight} />
                  ))}
                </div>
              )}

              {!loading && !error && flights.length === 0 && (
                <div className="text-center py-8 text-gray-600">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                  <p>No flights found for the selected criteria.</p>
                  <p className="text-sm">
                    Try adjusting your search parameters.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "accommodations" && (
            <div className="text-center py-8 text-gray-600">
              <Hotel className="w-8 h-8 mx-auto mb-2" />
              <p>Accommodation booking coming soon!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              * Prices are indicative and subject to change
            </div>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
