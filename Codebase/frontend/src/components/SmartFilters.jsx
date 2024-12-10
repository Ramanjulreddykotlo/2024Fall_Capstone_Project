import React from "react";
import {
  DollarSign,
  MapPin,
  UtensilsCrossed,
  Thermometer,
  X,
} from "lucide-react";

const SmartFilters = ({ filters, onChange, onReset }) => {
  const {
    priceRange,
    cuisineTypes,
    weatherPreference,
    landmarks,
    selectedCuisines,
    selectedLandmarks,
  } = filters;

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    const index = e.target.dataset.index === "0" ? 0 : 1;
    const newRange = [...priceRange];
    newRange[index] = value;
    onChange({ ...filters, priceRange: newRange });
  };

  const handleWeatherChange = (e) => {
    onChange({ ...filters, weatherPreference: e.target.value });
  };

  const toggleCuisine = (cuisine) => {
    const updated = selectedCuisines.includes(cuisine)
      ? selectedCuisines.filter((c) => c !== cuisine)
      : [...selectedCuisines, cuisine];
    onChange({ ...filters, selectedCuisines: updated });
  };

  const toggleLandmark = (landmark) => {
    const updated = selectedLandmarks.includes(landmark)
      ? selectedLandmarks.filter((l) => l !== landmark)
      : [...selectedLandmarks, landmark];
    onChange({ ...filters, selectedLandmarks: updated });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          onClick={onReset}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-4">
        {/* Price Range Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <DollarSign className="w-4 h-4" />
            Price Range
          </label>
          <div className="flex gap-4">
            <input
              type="range"
              min={0}
              max={5000}
              step={100}
              value={priceRange[0]}
              data-index="0"
              onChange={handlePriceChange}
              className="w-full"
            />
            <input
              type="range"
              min={0}
              max={5000}
              step={100}
              value={priceRange[1]}
              data-index="1"
              onChange={handlePriceChange}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>

        {/* Weather Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Thermometer className="w-4 h-4" />
            Weather
          </label>
          <select
            value={weatherPreference}
            onChange={handleWeatherChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select weather preference</option>
            <option value="tropical">Tropical</option>
            <option value="moderate">Moderate</option>
            <option value="cold">Cold</option>
            <option value="hot">Hot</option>
          </select>
        </div>

        {/* Cuisine Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <UtensilsCrossed className="w-4 h-4" />
            Cuisine Types
          </label>
          <div className="h-24 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {cuisineTypes.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => toggleCuisine(cuisine)}
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 cursor-pointer ${
                    selectedCuisines.includes(cuisine)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cuisine}
                  {selectedCuisines.includes(cuisine) && (
                    <X className="w-3 h-3 ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Landmarks Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="w-4 h-4" />
            Near Landmarks
          </label>
          <div className="h-24 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {landmarks.map((landmark) => (
                <button
                  key={landmark}
                  onClick={() => toggleLandmark(landmark)}
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 cursor-pointer ${
                    selectedLandmarks.includes(landmark)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {landmark}
                  {selectedLandmarks.includes(landmark) && (
                    <X className="w-3 h-3 ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartFilters;
