//hardcoded json data to render it through API 
const destinations = [
  {
    id: 1,
    name: "Bali",
    country: "Indonesia",
    weather: "tropical",
    budget: "moderate",
    cuisines: ["Asian", "Local"],
    description: "Tropical paradise with rich culture and beautiful beaches",
    imageUrl: "https://images.unsplash.com/photo-1555400038-63f5ba517a47",
    coordinates: {
      lat: -8.4095,
      lon: 115.1889
    }
  },
  {
    id: 2,
    name: "Rome",
    country: "Italy",
    weather: "moderate",
    budget: "luxury",
    cuisines: ["Italian", "Mediterranean"],
    description: "Historic city with amazing architecture and food",
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5",
    coordinates: {
      lat: 41.9028,
      lon: 12.4964
    }
  },
  {
    id: 3,
    name: "Reykjavik",
    country: "Iceland",
    weather: "cold",
    budget: "luxury",
    cuisines: ["Local", "Mediterranean"],
    description: "Land of fire and ice with stunning natural beauty",
    imageUrl: "https://images.unsplash.com/photo-1504893524553-b855bce32c67",
    coordinates: {
      lat: 64.1280,
      lon: -21.8274
    }
  },
  {
    id: 4,
    name: "Singapore",
    country: "Singapore",
    weather: "tropical",
    budget: "luxury",
    cuisines: ["Asian", "Local"],
    description: "Modern city-state with incredible food and attractions",
    imageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd",
    coordinates: {
      lat: 1.3521,
      lon: 103.8198
    }
  },
  {
    id: 5,
    name: "Barcelona",
    country: "Spain",
    weather: "moderate",
    budget: "moderate",
    cuisines: ["Mediterranean", "Local"],
    description: "Vibrant city with stunning architecture and beaches",
    imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded",
    coordinates: {
      lat: 41.3851,
      lon: 2.1734
    }
  },
  {
    id: 6,
    name: "Kyoto",
    country: "Japan",
    weather: "moderate",
    budget: "luxury",
    cuisines: ["Japanese", "Asian"],
    description: "Historic city with beautiful temples and traditional culture",
    imageUrl: "https://images.unsplash.com/photo-1558862107-d49ef2a04d72",
    coordinates: {
      lat: 35.0116,
      lon: 135.7681
    }
  },
  {
    id: 7,
    name: "Paris",
    country: "France",
    weather: "moderate",
    budget: "luxury",
    cuisines: ["French", "European"],
    description: "City of love known for its art, fashion, and culture",
    imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
    coordinates: {
      lat: 48.8566,
      lon: 2.3522
    }
  },
  {
    id: 8,
    name: "Cairo",
    country: "Egypt",
    weather: "hot",
    budget: "affordable",
    cuisines: ["Middle Eastern", "Local"],
    description: "Historic city with ancient landmarks and rich culture",
    imageUrl: "https://images.unsplash.com/photo-1541769740-098e80269166",
    coordinates: {
      lat: 30.0444,
      lon: 31.2357
    }
  },
  {
    id: 9,
    name: "Sydney",
    country: "Australia",
    weather: "moderate",
    budget: "luxury",
    cuisines: ["Australian", "International"],
    description: "Beautiful coastal city with famous landmarks and beaches",
    imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9",
    coordinates: {
      lat: -33.8688,
      lon: 151.2093
    }
  },
  {
    id: 10,
    name: "Dubai",
    country: "UAE",
    weather: "hot",
    budget: "luxury",
    cuisines: ["Middle Eastern", "International"],
    description: "Modern city with luxury shopping and vibrant nightlife",
    imageUrl: "https://images.unsplash.com/photo-1489516408517-0c0a15662682",
    coordinates: {
      lat: 25.2048,
      lon: 55.2708
    }
  },
  {
    id: 11,
    name: "Maui",
    country: "USA",
    weather: "tropical",
    budget: "luxury",
    cuisines: ["Hawaiian", "American"],
    description: "Island paradise with stunning beaches and nature",
    imageUrl: "https://images.unsplash.com/photo-1568576599263-ad9f374633d4",
    coordinates: {
      lat: 20.7984,
      lon: -156.3319
    }
  },
  {
    id: 12,
    name: "Buenos Aires",
    country: "Argentina",
    weather: "moderate",
    budget: "affordable",
    cuisines: ["Argentinian", "Latin American"],
    description: "Vibrant city with rich culture and tango music",
    imageUrl: "https://images.unsplash.com/photo-1679417302631-7a8998864de6",
    coordinates: {
      lat: -34.6037,
      lon: -58.3816
    }
  },
  {
    id: 13,
    name: "Cusco",
    country: "Peru",
    weather: "cold",
    budget: "moderate",
    cuisines: ["Peruvian", "Local"],
    description: "Historic city in the Andes, gateway to Machu Picchu",
    imageUrl: "https://images.unsplash.com/photo-1609350643153-63541d01aec9",
    coordinates: {
      lat: -13.5319,
      lon: -71.9675
    }
  },
  {
    id: 14,
    name: "Cape Town",
    country: "South Africa",
    weather: "moderate",
    budget: "moderate",
    cuisines: ["African", "International"],
    description: "Beautiful coastal city with mountains and beaches",
    imageUrl: "https://images.unsplash.com/photo-1606307850895-43c29221d5ba",
    coordinates: {
      lat: -33.9249,
      lon: 18.4241
    }
  },
  {
    id: 15,
    name: "Lisbon",
    country: "Portugal",
    weather: "moderate",
    budget: "affordable",
    cuisines: ["Portuguese", "Mediterranean"],
    description: "Charming city with historic sites and delicious food",
    imageUrl: "https://images.unsplash.com/photo-1525207934214-58e69a8f8a3e",
    coordinates: {
      lat: 38.7169,
      lon: -9.1399
    }
  },
  {
    id: 16,
    name: "Athens",
    country: "Greece",
    weather: "hot",
    budget: "moderate",
    cuisines: ["Greek", "Mediterranean"],
    description: "Ancient city with stunning ruins and vibrant street life",
    imageUrl: "https://images.unsplash.com/photo-1599423217192-34da246be9e8",
    coordinates: { lat: 37.9838, lon: 23.7275 }
  },
  {
    id: 17,
    name: "Istanbul",
    country: "Turkey",
    weather: "moderate",
    budget: "affordable",
    cuisines: ["Turkish", "Mediterranean"],
    description: "City that bridges Europe and Asia with rich history",
    imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200",
    coordinates: { lat: 41.0082, lon: 28.9784 }
  },
  {
    id: 18,
    name: "Bangkok",
    country: "Thailand",
    weather: "hot",
    budget: "affordable",
    cuisines: ["Thai", "Asian"],
    description: "Bustling city known for its street food and temples",
    imageUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c579365",
    coordinates: { lat: 13.7563, lon: 100.5018 }
  },
  {
    id: 19,
    name: "Marrakech",
    country: "Morocco",
    weather: "hot",
    budget: "moderate",
    cuisines: ["Moroccan", "Middle Eastern"],
    description: "Historic city with vibrant souks and beautiful palaces",
    imageUrl: "https://images.unsplash.com/photo-1710532539792-4e6b52e8c8b3",
    coordinates: { lat: 31.6295, lon: -7.9811 }
  },
  {
    id: 20,
    name: "Vancouver",
    country: "Canada",
    weather: "cold",
    budget: "moderate",
    cuisines: ["Canadian", "International"],
    description: "Scenic city surrounded by mountains and ocean",
    imageUrl: "https://images.unsplash.com/photo-1502228362178-086346ac6862",
    coordinates: { lat: 49.2827, lon: -123.1207 }
  },
  {
    id: 21,
    name: "Prague",
    country: "Czech Republic",
    weather: "cold",
    budget: "moderate",
    cuisines: ["Czech", "European"],
    description: "Fairytale-like city with medieval architecture",
    imageUrl: "https://images.unsplash.com/photo-1517606479700-fb03a3f93fc7",
    coordinates: { lat: 50.0755, lon: 14.4378 }
  },
  {
    id: 22,
    name: "Moscow",
    country: "Russia",
    weather: "cold",
    budget: "luxury",
    cuisines: ["Russian", "European"],
    description: "Historic capital with iconic architecture and culture",
    imageUrl: "https://images.unsplash.com/photo-1502154371219-2efef412e2cd",
    coordinates: { lat: 55.7558, lon: 37.6173 }
  },
  {
    id: 23,
    name: "Buenos Aires",
    country: "Argentina",
    weather: "moderate",
    budget: "affordable",
    cuisines: ["Argentinian", "Latin American"],
    description: "Vibrant city known for its art, culture, and tango music",
    imageUrl: "https://images.unsplash.com/photo-1679417302656-9b5170584526",
    coordinates: { lat: -34.6037, lon: -58.3816 }
  },
  {
    id: 24,
    name: "Rio de Janeiro",
    country: "Brazil",
    weather: "hot",
    budget: "moderate",
    cuisines: ["Brazilian", "Latin American"],
    description: "Beach city famous for its carnival and natural beauty",
    imageUrl: "https://images.unsplash.com/photo-1561577553-674ce32847a4",
    coordinates: { lat: -22.9068, lon: -43.1729 }
  },
  {
    id: 25,
    name: "Vienna",
    country: "Austria",
    weather: "cold",
    budget: "luxury",
    cuisines: ["Austrian", "European"],
    description: "Elegant city known for classical music and palaces",
    imageUrl: "https://images.unsplash.com/photo-1516550893923-42d28e5677af",
    coordinates: { lat: 48.2082, lon: 16.3738 }
  },
  {
    id: 26,
    name: "Hanoi",
    country: "Vietnam",
    weather: "hot",
    budget: "affordable",
    cuisines: ["Vietnamese", "Asian"],
    description: "Bustling city with rich history and famous street food",
    imageUrl: "https://images.unsplash.com/photo-1727752040431-c4134a5a3895",
    coordinates: { lat: 21.0285, lon: 105.8542 }
  },
  {
    id: 27,
    name: "Seoul",
    country: "South Korea",
    weather: "moderate",
    budget: "moderate",
    cuisines: ["Korean", "Asian"],
    description: "Vibrant city with unique culture and cutting-edge tech",
    imageUrl: "https://media.istockphoto.com/id/621371796/photo/sunset-at-seoul-city-skyline-south-korea.webp?a=1&b=1&s=612x612&w=0&k=20&c=_xrSjH2eKqoSwQUZteTgamYcAnOnAlXQ5ECDrBqKZTY=",
    coordinates: { lat: 37.5665, lon: 126.9780 }
  },
  {
    id: 28,
    name: "Zurich",
    country: "Switzerland",
    weather: "cold",
    budget: "luxury",
    cuisines: ["Swiss", "European"],
    description: "Beautiful city surrounded by mountains and lakes",
    imageUrl: "https://images.unsplash.com/photo-1657410283156-58176704e858",
    coordinates: { lat: 47.3769, lon: 8.5417 }
  },
  {
    id: 29,
    name: "Lima",
    country: "Peru",
    weather: "moderate",
    budget: "affordable",
    cuisines: ["Peruvian", "Latin American"],
    description: "City with historic landmarks and vibrant culinary scene",
    imageUrl: "https://images.unsplash.com/photo-1568805647297-df963b524678",
    coordinates: { lat: -12.0464, lon: -77.0428 }
  },
  {
    id: 30,
    name: "Auckland",
    country: "New Zealand",
    weather: "moderate",
    budget: "moderate",
    cuisines: ["Kiwi", "International"],
    description: "Scenic city with beautiful landscapes and adventure sports",
    imageUrl: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad",
    coordinates: { lat: -36.8485, lon: 174.7633 }
  }
];

module.exports = destinations;
