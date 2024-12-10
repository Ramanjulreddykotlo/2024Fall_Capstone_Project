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

const CITY_MAPPINGS = {
  London: { skyId: "LOND", entityId: "27544008" },
  "New York": { skyId: "NYCA", entityId: "27537542" },
  Bali: { skyId: "DPSB", entityId: "27536766" },
  Tokyo: { skyId: "TYOA", entityId: "27542699" },
  Paris: { skyId: "PARI", entityId: "27539733" },
  Dubai: { skyId: "DXBA", entityId: "27537447" },
  Rome: { skyId: "ROME", entityId: "27539793" },
  Reykjavik: { skyId: "REK", entityId: "27546312" },
  Singapore: { skyId: "SINS", entityId: "27546235" },
  Barcelona: { skyId: "BCN", entityId: "27548283" },
  Kyoto: { skyId: "UKY", entityId: "27542699" },
  Cairo: { skyId: "CAIR", entityId: "27539681" },
  Sydney: { skyId: "SYDA", entityId: "27544008" },
  Maui: { skyId: "OGG", entityId: "27546067" },
  "Buenos Aires": { skyId: "BUEA", entityId: "27536819" },
  Cusco: { skyId: "CUZ", entityId: "27536953" },
  "Cape Town": { skyId: "CPT", entityId: "27539684" },
  Lisbon: { skyId: "LISB", entityId: "27544347" },
  Athens: { skyId: "ATH", entityId: "27539733" },
  Istanbul: { skyId: "ISTA", entityId: "27539689" },
  Bangkok: { skyId: "BKKT", entityId: "27536542" },
  Marrakech: { skyId: "RAK", entityId: "27544847" },
  Vancouver: { skyId: "VANC", entityId: "27546023" },
  Prague: { skyId: "PRG", entityId: "27546171" },
  Moscow: { skyId: "MOSC", entityId: "27539582" },
  "Rio de Janeiro": { skyId: "RIO", entityId: "27536536" },
  Vienna: { skyId: "VIEN", entityId: "27545957" },
  Hanoi: { skyId: "HAN", entityId: "27545165" },
  Seoul: { skyId: "SELA", entityId: "27546091" },
  Zurich: { skyId: "ZRH", entityId: "27545952" },
  Lima: { skyId: "LIMA", entityId: "27536953" },
  Auckland: { skyId: "AUCK", entityId: "27546067" },
};

const formatDuration = (minutes) => {
  if (!minutes || isNaN(minutes)) return "N/A";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "N/A";
  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid Date";
  }
};

const validateSearchParams = (params, destination) => {
  const errors = [];

  if (!params.origin?.trim()) {
    errors.push("Origin city is required");
  }

  if (!params.date) {
    errors.push("Departure date is required");
  }

  if (params.returnDate && params.returnDate < params.date) {
    errors.push("Return date cannot be before departure date");
  }

  const originCity = CITY_MAPPINGS[params.origin];
  const destinationCity = CITY_MAPPINGS[destination?.name];

  if (!originCity) {
    errors.push(`Origin city "${params.origin}" is not supported`);
  }

  if (!destinationCity) {
    errors.push(`Destination "${destination?.name}" is not supported`);
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
    cityMappings: {
      origin: originCity,
      destination: destinationCity,
    },
  };
};

const FlightSearchForm = ({ onSearch, destination }) => {
  const [searchParams, setSearchParams] = useState({
    origin: "",
    destination: destination?.name || "",
    date: "",
    returnDate: "",
    passengers: 1,
  });
  const [formError, setFormError] = useState("");

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
    setFormError("");

    const validation = validateSearchParams(searchParams, destination);

    if (!validation.isValid) {
      setFormError(validation.errors.join(". "));
      return;
    }

    const apiSearchParams = {
      originSkyId: validation.cityMappings.origin.skyId,
      destinationSkyId: validation.cityMappings.destination.skyId,
      originEntityId: validation.cityMappings.origin.entityId,
      destinationEntityId: validation.cityMappings.destination.entityId,
      date: searchParams.date,
      returnDate: searchParams.returnDate || undefined,
      adults: searchParams.passengers,
    };

    onSearch(apiSearchParams);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 space-y-4">
      {formError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {formError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Origin <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="cities"
            value={searchParams.origin}
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, origin: e.target.value }))
            }
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
              !searchParams.origin && "border-red-300"
            }`}
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
            Departure Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={searchParams.date}
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, date: e.target.value }))
            }
            min={today}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
              !searchParams.date && "border-red-300"
            }`}
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
                  : `${flight.return.stops} stop${
                      flight.return.stops > 1 ? "s" : ""
                    }`}
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

function generateRandomFlights(params) {
  return new Promise((resolve) => {
    const airlines = [
      "Delta",
      "KLM",
      "Air France",
      "United",
      "Emirates",
      "Lufthansa",
      "British Airways",
      "Qatar Airways",
      "Singapore Airlines",
      "American Airlines",
    ];

    const originCity = Object.keys(CITY_MAPPINGS).find(
      (city) => CITY_MAPPINGS[city].skyId === params.originSkyId,
    );
    const destinationCity = Object.keys(CITY_MAPPINGS).find(
      (city) => CITY_MAPPINGS[city].skyId === params.destinationSkyId,
    );

    // Generate a random number of flights (1-5)
    const flightCount = Math.floor(Math.random() * 5) + 1;
    const flights = [];

    const travelDate = new Date(params.date);
    const returnDate = params.returnDate ? new Date(params.returnDate) : null;

    for (let i = 0; i < flightCount; i++) {
      const airline = airlines[Math.floor(Math.random() * airlines.length)];
      const stops = Math.floor(Math.random() * 3);
      const durationOutbound = 300 + Math.floor(Math.random() * 600); // 5 to 15 hours
      const durationReturn = returnDate
        ? 300 + Math.floor(Math.random() * 600)
        : null;

      const departureTime = new Date(travelDate.getTime());
      departureTime.setHours(
        6 + Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 60),
      );

      const arrivalTime = new Date(departureTime.getTime());
      arrivalTime.setMinutes(arrivalTime.getMinutes() + durationOutbound);

      let returnFlight = null;
      if (returnDate) {
        const returnDepartureTime = new Date(returnDate.getTime());
        returnDepartureTime.setHours(
          6 + Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 60),
        );
        const returnArrivalTime = new Date(returnDepartureTime.getTime());
        returnArrivalTime.setMinutes(
          returnArrivalTime.getMinutes() + durationReturn,
        );

        const returnStops = Math.floor(Math.random() * 3);

        returnFlight = {
          departure: {
            airport: CITY_MAPPINGS[destinationCity].skyId,
            time: returnDepartureTime.toISOString(),
            city: destinationCity,
          },
          arrival: {
            airport: CITY_MAPPINGS[originCity].skyId,
            time: returnArrivalTime.toISOString(),
            city: originCity,
          },
          duration: durationReturn,
          stops: returnStops,
        };
      }

      flights.push({
        id: `${i}-${Date.now()}`,
        price: (500 + Math.random() * 1000).toFixed(2),
        currency: "USD",
        airline,
        departure: {
          airport: CITY_MAPPINGS[originCity].skyId,
          time: departureTime.toISOString(),
          city: originCity,
        },
        arrival: {
          airport: CITY_MAPPINGS[destinationCity].skyId,
          time: arrivalTime.toISOString(),
          city: destinationCity,
        },
        duration: durationOutbound,
        stops,
        return: returnFlight,
        available_seats: Math.floor(Math.random() * 50) + 1,
        score: Math.random(),
        tags: i === 0 ? ["cheapest"] : [],
      });
    }

    setTimeout(() => {
      resolve(flights);
    }, 1200);
  });
}

const PricingModal = ({ destination, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("flights");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchFlights = async (searchParams) => {
    setLoading(true);
    setError(null);

    try {
      if (
        !searchParams.originSkyId ||
        !searchParams.destinationSkyId ||
        !searchParams.date
      ) {
        throw new Error(
          "Please fill in all required fields (origin, destination, and date)",
        );
      }

      // Simulate fetching real flights by generating random flight data
      const data = await generateRandomFlights(searchParams);
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
              onClick={() => {}}
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
