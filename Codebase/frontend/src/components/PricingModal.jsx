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
  Clock,
  MapPin,
  Info,
} from "lucide-react";

// City mappings for SkyScanner API
const CITY_MAPPINGS = {
  London: {
    skyId: "LOND",
    entityId: "27544008",
  },
  "New York": {
    skyId: "NYCA",
    entityId: "27537542",
  },
  Bali: {
    skyId: "DPSB",
    entityId: "27536766",
  },
  Tokyo: {
    skyId: "TYOA",
    entityId: "27542699",
  },
  Paris: {
    skyId: "PARI",
    entityId: "27539733",
  },
  Dubai: {
    skyId: "DXBA",
    entityId: "27537447",
  },
};

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const FlightSearchForm = ({ onSearch, destination }) => {
  const [searchParams, setSearchParams] = useState({
    origin: "",
    destination: destination?.name || "",
    date: "",
    returnDate: "",
    passengers: 1,
  });

  useEffect(() => {
    if (destination?.name) {
      setSearchParams((prev) => ({
        ...prev,
        destination: destination.name,
      }));
    }
  }, [destination]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Origin
          </label>
          <input
            type="text"
            list="cities"
            value={searchParams.origin}
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, origin: e.target.value }))
            }
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Select city (e.g. London)"
            required
          />
          <datalist id="cities">
            {Object.keys(CITY_MAPPINGS).map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destination
          </label>
          <input
            type="text"
            value={searchParams.destination}
            disabled
            className="w-full p-2 border rounded bg-gray-50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Departure Date
          </label>
          <input
            type="date"
            value={searchParams.date}
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, date: e.target.value }))
            }
            min={today}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Return Date
          </label>
          <input
            type="date"
            value={searchParams.returnDate}
            onChange={(e) =>
              setSearchParams((prev) => ({
                ...prev,
                returnDate: e.target.value,
              }))
            }
            min={searchParams.date || today}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
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
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-lg">{flight.airline}</span>
        {flight.stops === 0 && (
          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
            Direct
          </span>
        )}
        {flight.tags?.includes("cheapest") && (
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
            Best Price
          </span>
        )}
      </div>
      <div className="text-right">
        <span className="font-bold text-xl">${flight.price}</span>
        <p className="text-sm text-gray-500">per person</p>
      </div>
    </div>

    <div className="flex flex-col gap-4">
      {/* Outbound Flight */}
      <div className="border-b pb-4">
        <div className="text-sm text-gray-500 mb-2">Outbound Flight</div>
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="font-medium">
              {flight.departure.city} ({flight.departure.airport})
            </div>
            <div className="text-gray-500">
              {formatDateTime(flight.departure.time)}
            </div>
          </div>
          <div className="flex flex-col items-center px-4">
            <div className="text-sm text-gray-500">
              {formatDuration(flight.duration)}
            </div>
            <div className="relative w-24 h-px bg-gray-300 my-2">
              <div className="absolute top-1/2 right-0 w-2 h-2 bg-blue-500 rounded-full transform -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-0 w-2 h-2 bg-blue-500 rounded-full transform -translate-y-1/2"></div>
            </div>
            <div className="text-sm text-gray-500">
              {flight.stops === 0
                ? "Direct"
                : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
            </div>
          </div>
          <div className="flex-1 text-right">
            <div className="font-medium">
              {flight.arrival.city} ({flight.arrival.airport})
            </div>
            <div className="text-gray-500">
              {formatDateTime(flight.arrival.time)}
            </div>
          </div>
        </div>
      </div>

      {/* Return Flight */}
      {flight.return && (
        <div>
          <div className="text-sm text-gray-500 mb-2">Return Flight</div>
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="font-medium">
                {flight.return.departure.city} (
                {flight.return.departure.airport})
              </div>
              <div className="text-gray-500">
                {formatDateTime(flight.return.departure.time)}
              </div>
            </div>
            <div className="flex flex-col items-center px-4">
              <div className="text-sm text-gray-500">
                {formatDuration(flight.return.duration)}
              </div>
              <div className="relative w-24 h-px bg-gray-300 my-2">
                <div className="absolute top-1/2 right-0 w-2 h-2 bg-blue-500 rounded-full transform -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-0 w-2 h-2 bg-blue-500 rounded-full transform -translate-y-1/2"></div>
              </div>
              <div className="text-sm text-gray-500">
                {flight.return.stops === 0
                  ? "Direct"
                  : `${flight.return.stops} stop${flight.return.stops > 1 ? "s" : ""}`}
              </div>
            </div>
            <div className="flex-1 text-right">
              <div className="font-medium">
                {flight.return.arrival.city} ({flight.return.arrival.airport})
              </div>
              <div className="text-gray-500">
                {formatDateTime(flight.return.arrival.time)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-4 pt-4 border-t">
        <div className="flex gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>Seats: {flight.available_seats}</span>
          </div>
          {flight.score && (
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>Score: {(flight.score * 100).toFixed(0)}%</span>
            </div>
          )}
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
          Select
        </button>
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
      const { origin, date, returnDate, passengers } = searchParams;

      // Get origin city mappings
      const originCity = CITY_MAPPINGS[origin];
      const destinationCity = CITY_MAPPINGS[destination.name];

      if (!originCity) {
        throw new Error(
          `Origin city "${origin}" not supported. Please choose from: ${Object.keys(CITY_MAPPINGS).join(", ")}`,
        );
      }

      if (!destinationCity) {
        throw new Error(
          `Destination city "${destination.name}" not supported. Please choose from: ${Object.keys(CITY_MAPPINGS).join(", ")}`,
        );
      }

      const queryParams = new URLSearchParams({
        originSkyId: originCity.skyId,
        destinationSkyId: destinationCity.skyId,
        originEntityId: originCity.entityId,
        destinationEntityId: destinationCity.entityId,
        date,
        ...(returnDate && { returnDate }),
        adults: passengers || 1,
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
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch flights");
      }

      const data = await response.json();
      setFlights(data);
    } catch (err) {
      setError(err.message);
      console.error("Flight search error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Travel Details: {destination.name}, {destination.country}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

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

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "flights" && (
            <div className="space-y-6">
              <FlightSearchForm
                onSearch={searchFlights}
                destination={destination}
              />

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
                  <p>Search for available flights to {destination.name}</p>
                  <p className="text-sm">
                    Enter your departure city and dates above
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

        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Info size={16} />* Prices are indicative and may vary based on
              availability
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
              {flights.length > 0 && (
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <span>Save Search</span>
                  <Check size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Price Alert Dialog */}
      {flights.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm border border-gray-200">
          <div className="flex items-start gap-3">
            <DollarSign className="text-green-500 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-gray-900">Set Price Alert</h4>
              <p className="text-sm text-gray-600 mt-1">
                Get notified when prices drop for flights to {destination.name}
              </p>
              <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium">
                Create Alert
              </button>
            </div>
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => {
                /* Handle close alert */
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingModal;
