//hardcoded json data to render it through API 
const destinations = [
  {
    id: 1,
    name: "Bali, Indonesia",
    weather: "tropical",
    budget: "moderate",
    cuisines: ["Asian", "Local"],
    description: "Tropical paradise with rich culture and beautiful beaches",
    imageUrl:
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    name: "Rome, Italy",
    weather: "moderate",
    budget: "luxury",
    cuisines: ["Italian", "Mediterranean"],
    description: "Historic city with amazing architecture and food",
    imageUrl:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800",
  },
  {
    id: 3,
    name: "Bangkok, Thailand",
    weather: "tropical",
    budget: "budget",
    cuisines: ["Asian", "Local"],
    description:
      "Vibrant city with stunning temples and world-famous street food",
    imageUrl:
      "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=800",
  },
  {
    id: 4,
    name: "Zermatt, Switzerland",
    weather: "cold",
    budget: "luxury",
    cuisines: ["Mediterranean", "Local"],
    description: "Picturesque Alpine resort town with world-class skiing",
    imageUrl:
      "https://images.unsplash.com/photo-1531372419955-81ff5c10c14e?auto=format&fit=crop&w=800",
  },
  {
    id: 5,
    name: "Barcelona, Spain",
    weather: "moderate",
    budget: "moderate",
    cuisines: ["Mediterranean", "Local"],
    description:
      "Artistic city with stunning architecture and beautiful beaches",
    imageUrl:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800",
  },
  {
    id: 6,
    name: "Tokyo, Japan",
    weather: "moderate",
    budget: "luxury",
    cuisines: ["Asian", "Local"],
    description:
      "Ultra-modern city with ancient traditions and incredible food scene",
    imageUrl:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800",
  },
  {
    id: 7,
    name: "Cancun, Mexico",
    weather: "tropical",
    budget: "moderate",
    cuisines: ["Local", "Mediterranean"],
    description: "Caribbean paradise with white sand beaches and ancient ruins",
    imageUrl:
      "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?auto=format&fit=crop&w=800",
  },
  {
    id: 8,
    name: "Oslo, Norway",
    weather: "cold",
    budget: "luxury",
    cuisines: ["Local", "Mediterranean"],
    description:
      "Modern Scandinavian city with stunning fjords and northern lights",
    imageUrl:
      "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=800",
  },
  {
    id: 9,
    name: "Marrakech, Morocco",
    weather: "moderate",
    budget: "budget",
    cuisines: ["Mediterranean", "Local"],
    description: "Ancient city with vibrant markets and rich cultural heritage",
    imageUrl:
      "https://images.unsplash.com/photo-1597211833712-5e41faa202ea?auto=format&fit=crop&w=800",
  },
  {
    id: 10,
    name: "Phuket, Thailand",
    weather: "tropical",
    budget: "budget",
    cuisines: ["Asian", "Local"],
    description:
      "Tropical island with crystal clear waters and amazing beaches",
    imageUrl:
      "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800",
  },
  {
    id: 11,
    name: "Vienna, Austria",
    weather: "cold",
    budget: "moderate",
    cuisines: ["Mediterranean", "Local"],
    description: "Imperial city with rich musical heritage and elegant cafes",
    imageUrl:
      "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800",
  },
  {
    id: 12,
    name: "Singapore",
    weather: "tropical",
    budget: "luxury",
    cuisines: ["Asian", "Local", "Mediterranean"],
    description: "Modern city-state with incredible food scene and attractions",
    imageUrl:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800",
  },
  {
    id: 13,
    name: "Santorini, Greece",
    weather: "moderate",
    budget: "luxury",
    cuisines: ["Mediterranean", "Local"],
    description:
      "Stunning island with white-washed buildings and spectacular sunsets",
    imageUrl:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800",
  },
  {
    id: 14,
    name: "Vancouver, Canada",
    weather: "cold",
    budget: "moderate",
    cuisines: ["Asian", "Local"],
    description: "Beautiful coastal city surrounded by mountains and nature",
    imageUrl:
      "https://images.unsplash.com/photo-1559511260-66a654ae982a?auto=format&fit=crop&w=800",
  },
  {
    id: 15,
    name: "Ho Chi Minh City, Vietnam",
    weather: "tropical",
    budget: "budget",
    cuisines: ["Asian", "Local"],
    description:
      "Dynamic city with rich history and amazing street food culture",
    imageUrl:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800",
  },
];

module.exports = destinations;
