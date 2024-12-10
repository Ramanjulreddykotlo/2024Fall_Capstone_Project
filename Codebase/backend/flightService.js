const axios = require("axios");

class FlightService {
  constructor() {
    this.API_KEY = "886c208dfbmshb7dcb4428a8d49ep130127jsn73e24924d53a";
    this.API_HOST = "sky-scrapper.p.rapidapi.com";

    // Map of cities to their SkyIds and EntityIds
    this.cityMappings = {
      London: {
        skyId: "LOND",
        entityId: "27544008",
      },
      "New York": {
        skyId: "NYCA",
        entityId: "27537542",
      },
      // Add more cities as needed
    };
  }

  async searchFlights(params) {
    try {
      const queryParams = {
        originSkyId: params.originSkyId,
        destinationSkyId: params.destinationSkyId,
        originEntityId: params.originEntityId,
        destinationEntityId: params.destinationEntityId,
        date: params.date, // According to the API docs
        returnDate: params.returnDate, // According to the API docs
        cabinClass: "economy",
        adults: params.adults || 1,
        sortBy: "best",
        currency: "USD",
        market: "en-US",
        countryCode: "US",
      };

      console.log("Making API request with params:", queryParams);

      const options = {
        method: "GET",
        url: "https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights",
        headers: {
          "X-RapidAPI-Key": this.API_KEY,
          "X-RapidAPI-Host": this.API_HOST,
        },
        params: queryParams,
      };

      const response = await axios.request(options);

      // Log full response to understand the returned structure
      console.log(
        "Flight API full response:",
        JSON.stringify(response.data, null, 2),
      );

      return this.processFlightData(response.data);
    } catch (error) {
      console.error(
        "Error in flight search:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  processFlightData(data) {
    // Check for itineraries in the correct location
    if (!data?.data?.itineraries) {
      console.log(
        "No itineraries found in the response:",
        JSON.stringify(data, null, 2),
      );
      return [];
    }

    return data.data.itineraries
      .map((itinerary) => {
        const outboundLeg = itinerary.legs?.[0];
        const returnLeg = itinerary.legs?.[1];

        if (!outboundLeg) {
          console.warn("Itinerary missing outbound leg:", itinerary);
          return null;
        }

        return {
          id: itinerary.id,
          price: parseFloat(itinerary.price?.raw),
          currency: "USD",
          airline:
            outboundLeg.carriers.marketing?.[0]?.name || "Unknown Airline",
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
        };
      })
      .filter(Boolean);
  }
}

module.exports = new FlightService();
