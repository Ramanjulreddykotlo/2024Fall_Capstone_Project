const axios = require("axios");

class FlightService {
  constructor() {
    this.API_KEY = "886c208dfbmshb7dcb4428a8d49ep130127jsn73e24924d53a";
    this.API_HOST = "sky-scrapper.p.rapidapi.com";

    // Common city entity IDs for major destinations
    this.cityEntityIds = {
      London: "27544008",
      "New York": "27537542",
      Tokyo: "27542699",
      Paris: "27539733",
      Dubai: "27537447",
    };

    // Common city SkyIDs
    this.citySkyIds = {
      London: "LOND",
      "New York": "NYCA",
      Tokyo: "TYOA",
      Paris: "PARI",
      Dubai: "DXBA",
    };
  }

  async searchFlights(
    origin,
    destination,
    date,
    returnDate = null,
    passengers = 1,
  ) {
    try {
      const options = {
        method: "GET",
        url: "https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights",
        headers: {
          "X-RapidAPI-Key": this.API_KEY,
          "X-RapidAPI-Host": this.API_HOST,
        },
        params: {
          originSkyId: this.citySkyIds[origin] || origin,
          destinationSkyId: this.citySkyIds[destination] || destination,
          originEntityId: this.cityEntityIds[origin] || origin,
          destinationEntityId: this.cityEntityIds[destination] || destination,
          date: this.formatDate(date),
          returnDate: returnDate ? this.formatDate(returnDate) : undefined,
          cabinClass: "economy",
          adults: passengers,
          sortBy: "best",
          currency: "USD",
          market: "en-US",
          countryCode: "US",
        },
      };

      console.log(
        `Searching flights from ${origin} to ${destination} for ${date}`,
      );
      const response = await axios.request(options);
      return this.processFlightData(response.data);
    } catch (error) {
      console.error("Error searching flights:", error);
      throw error;
    }
  }

  formatDate(date) {
    // Convert date to YYYY-MM-DD format if it's not already
    if (date instanceof Date) {
      return date.toISOString().split("T")[0];
    }
    return date;
  }

  processFlightData(data) {
    if (!data?.data?.itineraries) {
      return [];
    }

    return data.data.itineraries.map((itinerary) => {
      const outboundLeg = itinerary.legs[0];
      const returnLeg = itinerary.legs[1];

      return {
        id: itinerary.id,
        price: parseFloat(itinerary.price.raw),
        currency: "USD",
        airline: outboundLeg.carriers.marketing[0].name,
        departure: {
          airport: outboundLeg.origin.displayCode,
          time: outboundLeg.departure,
          city: outboundLeg.origin.city,
        },
        arrival: {
          airport: outboundLeg.destination.displayCode,
          time: outboundLeg.arrival,
          city: outboundLeg.destination.city,
        },
        duration: outboundLeg.durationInMinutes,
        stops: outboundLeg.stopCount,
        return: returnLeg
          ? {
              departure: {
                airport: returnLeg.origin.displayCode,
                time: returnLeg.departure,
                city: returnLeg.origin.city,
              },
              arrival: {
                airport: returnLeg.destination.displayCode,
                time: returnLeg.arrival,
                city: returnLeg.destination.city,
              },
              duration: returnLeg.durationInMinutes,
              stops: returnLeg.stopCount,
            }
          : null,
        available_seats: Math.floor(Math.random() * 30) + 1, // Simulated as API doesn't provide this
        score: itinerary.score || 0,
        tags: itinerary.tags || [],
      };
    });
  }

  async getCityId(query) {
    // First check if it's a known city
    if (this.cityEntityIds[query]) {
      return {
        entityId: this.cityEntityIds[query],
        skyId: this.citySkyIds[query],
      };
    }

    // If not, would need to implement city search endpoint
    // For now, return null or throw error
    throw new Error("City not found in known cities list");
  }
}

module.exports = new FlightService();
