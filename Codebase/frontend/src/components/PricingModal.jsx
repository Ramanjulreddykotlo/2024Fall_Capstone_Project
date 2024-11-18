import React, { useState } from "react";
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
} from "lucide-react";

// Dummy flight data simulation
const generateFlightData = (destination) => {
  const basePrice = {
    luxury: { min: 800, max: 1500 },
    moderate: { min: 400, max: 800 },
    affordable: { min: 200, max: 400 },
  }[destination.budget] || { min: 400, max: 800 };

  // Generate next 2 months of flights
  const flights = [];
  const startDate = new Date();

  for (let i = 0; i < 60; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    // Generate 2-3 flights per day
    const dailyFlights = Math.floor(Math.random() * 2) + 2;

    for (let j = 0; j < dailyFlights; j++) {
      const hours = 6 + Math.floor(Math.random() * 12); // Flights between 6 AM and 6 PM
      const price =
        basePrice.min +
        Math.floor(Math.random() * (basePrice.max - basePrice.min));

      flights.push({
        id: `flight-${i}-${j}`,
        from: "EWR",
        to: destination.name,
        date: new Date(date.setHours(hours, 0, 0)),
        duration: "8h 30m",
        airline: ["United", "American", "Delta", "Emirates"][
          Math.floor(Math.random() * 4)
        ],
        price: price,
        stops: Math.random() > 0.7 ? 1 : 0,
      });
    }
  }

  return flights.sort((a, b) => a.price - b.price);
};

// Dummy accommodation data simulation
const generateAccommodationData = (destination) => {
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
    {
      id: 4,
      name: `${destination.name} Budget Stay`,
      type: "Hotel",
      rating: 3,
      pricePerNight: Math.floor(
        basePricePerNight.min * 0.8 + Math.random() * basePricePerNight.min,
      ),
      amenities: ["WiFi", "Parking"],
    },
  ];
};

const DatePicker = ({ selectedDate, onDateChange }) => {
  return (
    <input
      type="date"
      className="p-2 border rounded-lg w-full"
      value={selectedDate}
      onChange={(e) => onDateChange(e.target.value)}
      min={new Date().toISOString().split("T")[0]}
    />
  );
};

const FlightCard = ({ flight }) => {
  const date = new Date(flight.date);

  return (
    <div className="p-4 border rounded-lg mb-3 hover:border-blue-500 transition-colors">
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
            <div className="font-semibold">{flight.from}</div>
            <div>
              {date.getHours()}:{date.getMinutes().toString().padStart(2, "0")}
            </div>
          </div>
          <ArrowRight className="text-gray-400" size={16} />
          <div>
            <div className="font-semibold">{flight.to}</div>
            <div>{flight.duration}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AccommodationCard = ({ accommodation }) => {
  return (
    <div className="p-4 border rounded-lg mb-3 hover:border-blue-500 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold">{accommodation.name}</h3>
          <p className="text-sm text-gray-600">{accommodation.type}</p>
        </div>
        <div className="text-right">
          <div className="font-bold text-lg">
            ${accommodation.pricePerNight}
          </div>
          <div className="text-sm text-gray-600">per night</div>
        </div>
      </div>

      <div className="flex gap-1 mb-2">
        {Array(accommodation.rating)
          .fill(null)
          .map((_, i) => (
            <svg
              key={i}
              className="w-4 h-4 text-yellow-400 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {accommodation.amenities.map((amenity, index) => (
          <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
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

  const flights = generateFlightData(destination);
  const accommodations = generateAccommodationData(destination);

  const filteredFlights = flights.filter(
    (flight) => flight.date.toISOString().split("T")[0] === selectedDate,
  );

  const [activeTab, setActiveTab] = useState("flights");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Travel Details: {destination.name}, {destination.country}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 border-b bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <DatePicker
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Travelers
              </label>
              <select
                className="p-2 border rounded-lg w-full"
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

        <div className="flex border-b">
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === "flights"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
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
                : "text-gray-600"
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
            <div>
              {filteredFlights.length > 0 ? (
                filteredFlights.map((flight) => (
                  <FlightCard key={flight.id} flight={flight} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <AlertCircle className="mx-auto mb-2" size={24} />
                  <p>No flights available for the selected date.</p>
                  <p className="text-sm">Try selecting a different date.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "accommodations" && (
            <div>
              {accommodations.map((accommodation) => (
                <AccommodationCard
                  key={accommodation.id}
                  accommodation={accommodation}
                />
              ))}
            </div>
          )}
        </div>

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
