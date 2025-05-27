export interface WeatherData {
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  description: string
  icon: string
  precipitation: number
  location: string
}

export interface ClothingRecommendation {
  category: string
  items: string[]
  reasoning: string
}

export interface UserPreferences {
  gender: "male" | "female" | "other"
  ageGroup: "teen" | "adult" | "senior"
  style: "basic" | "sporty" | "casual" | "professional"
}

export async function getWeatherData(location: string): Promise<WeatherData> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY

  if (!apiKey) {
    throw new Error("Weather API key not configured")
  }

  // First, get coordinates from location
  const geoResponse = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`,
  )

  if (!geoResponse.ok) {
    throw new Error("Failed to fetch location data")
  }

  const geoData = await geoResponse.json()

  if (geoData.length === 0) {
    throw new Error("Location not found")
  }

  const { lat, lon, name, country } = geoData[0]

  // Get current weather
  const weatherResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
  )

  if (!weatherResponse.ok) {
    throw new Error("Failed to fetch weather data")
  }

  const weatherData = await weatherResponse.json()

  return {
    temperature: Math.round(weatherData.main.temp),
    feelsLike: Math.round(weatherData.main.feels_like),
    humidity: weatherData.main.humidity,
    windSpeed: Math.round(weatherData.wind?.speed * 3.6), // Convert m/s to km/h
    description: weatherData.weather[0].description,
    icon: weatherData.weather[0].icon,
    precipitation: weatherData.rain?.["1h"] || weatherData.snow?.["1h"] || 0,
    location: `${name}, ${country}`,
  }
}
