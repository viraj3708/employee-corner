// City data with categories and metro classification
export const cityData = {
  X: [
    { name: "Greater Mumbai (UA)", isMetro: true },
    { name: "Pune (UA)", isMetro: true }
  ],
  Y: [
    { name: "Amravati", isMetro: false },
    { name: "Nagpur", isMetro: false }, 
    { name: "Aurangabad", isMetro: false },
    { name: "Nashik", isMetro: false },
    { name: "Bhiwandi", isMetro: false },
    { name: "Solapur", isMetro: false },
    { name: "Kolhapur", isMetro: false },
    { name: "Vasai-Virar", isMetro: false },
    { name: "Malegaon", isMetro: false },
    { name: "Nanded-Waghala", isMetro: false },
    { name: "Sangli", isMetro: false }
  ],
  Z: [
    { name: "Akola", isMetro: false },
    { name: "Latur", isMetro: false }, 
    { name: "Beed", isMetro: false },
    { name: "Dhule", isMetro: false },
    { name: "Parbhani", isMetro: false },
    { name: "Washim", isMetro: false },
    { name: "Other", isMetro: false }
  ]
};

// Get all cities as a flat array with their categories
export const getAllCities = () => {
  const cities = [];
  Object.keys(cityData).forEach(category => {
    cityData[category].forEach(cityInfo => {
      cities.push({ 
        name: cityInfo.name, 
        category,
        isMetro: cityInfo.isMetro 
      });
    });
  });
  return cities;
};

// Get category for a specific city
export const getCityCategory = (cityName) => {
  for (const [category, cities] of Object.entries(cityData)) {
    if (cities.find(city => city.name === cityName)) {
      return category;
    }
  }
  return 'Z'; // Default to Z category if not found
};

// Get metro status for a specific city
export const getCityMetroStatus = (cityName) => {
  for (const [category, cities] of Object.entries(cityData)) {
    const cityInfo = cities.find(city => city.name === cityName);
    if (cityInfo) {
      return cityInfo.isMetro;
    }
  }
  return false; // Default to non-metro if not found
};

// GIS calculation based on class
export const calculateGIS = (employeeClass) => {
  const gisRates = {
    'Class 1': 960,
    'Class 2': 480,
    'Class 3': 360,
    'Class 4': 240
  };
  
  return gisRates[employeeClass] || 0;
};