const axios = require('axios');

const METEOSOURCE_API_KEY = '767c53b5e3msh4dbb025d18cc534p1f99fejsn70b9b5153072';
const METEOSOURCE_HOST = 'ai-weather-by-meteosource.p.rapidapi.com';

class WeatherService {
  async getDestinationWeather(destination) {
    try {
      const weatherOptions = {
        method: 'GET',
        url: 'https://ai-weather-by-meteosource.p.rapidapi.com/daily',
        params: {
          lat: destination.coordinates.lat.toString(),
          lon: destination.coordinates.lon.toString(),
          language: 'en',
          units: 'metric'
        },
        headers: {
          'X-RapidAPI-Key': METEOSOURCE_API_KEY,
          'X-RapidAPI-Host': METEOSOURCE_HOST
        }
      };

      console.log(`Fetching weather for ${destination.name}, ${destination.country}`);

      const weatherResponse = await axios.request(weatherOptions);
      
      if (!weatherResponse.data || !weatherResponse.data.daily) {
        console.log(`No weather data found for ${destination.name}`);
        return null;
      }

      const todayWeather = weatherResponse.data.daily.data[0];
      const processedData = this.processWeatherData(todayWeather);
      
      console.log(`Weather data for ${destination.name}:`, processedData);
      return processedData;

    } catch (error) {
      console.error(`Error fetching weather for ${destination.name}:`, error.message);
      return null;
    }
  }

  processWeatherData(data) {
    return {
      temperature: (data.temperature_max + data.temperature_min) / 2,
      maxTemp: data.temperature_max,
      minTemp: data.temperature_min,
      humidity: data.humidity,
      precipitation: data.precipitation,
      type: this.categorizeWeather(
        (data.temperature_max + data.temperature_min) / 2, 
        data.humidity,
        data.precipitation
      ),
      summary: data.summary,
      timestamp: Date.now()
    };
  }

  categorizeWeather(avgTemp, humidity, precipitation) {
    // More accurate categorization based on multiple factors
    if (avgTemp > 28) {
      if (humidity > 70 || precipitation > 5) {
        return 'tropical';
      }
      return 'hot';
    }
    
    if (avgTemp < 10) {
      return 'cold';
    }
    
    // Moderate temperature range
    if (avgTemp >= 10 && avgTemp <= 28) {
      if (humidity > 80 || precipitation > 10) {
        return 'tropical';
      }
      return 'moderate';
    }

    return 'moderate';
  }

  matchesPreference(weatherType, preference) {
    const weatherMap = {
      'tropical': ['tropical', 'hot'],
      'hot': ['hot', 'tropical'],
      'cold': ['cold'],
      'moderate': ['moderate']
    };

    return weatherMap[preference]?.includes(weatherType) || false;
  }
}

module.exports = new WeatherService();