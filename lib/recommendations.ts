import type { WeatherData } from "./weather"

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

export function generateClothingRecommendations(
  weather: WeatherData,
  preferences: UserPreferences,
): ClothingRecommendation[] {
  const recommendations: ClothingRecommendation[] = []
  const temp = weather.temperature
  const feelsLike = weather.feelsLike
  const isRaining = weather.precipitation > 0
  const isWindy = weather.windSpeed > 20
  const isHumid = weather.humidity > 70

  // Base layers
  if (temp <= 0) {
    recommendations.push({
      category: "Base Layer",
      items: ["Thermal underwear", "Wool base layer", "Warm socks"],
      reasoning: "Freezing temperatures require insulating base layers",
    })
  } else if (temp <= 10) {
    recommendations.push({
      category: "Base Layer",
      items: ["Long-sleeve shirt", "Warm undergarments"],
      reasoning: "Cold weather needs warm base layers",
    })
  }

  // Main clothing
  if (temp <= 0) {
    const winterItems =
      preferences.style === "sporty"
        ? ["Insulated jacket", "Thermal leggings/pants", "Winter boots"]
        : ["Heavy winter coat", "Warm pants", "Insulated boots"]

    recommendations.push({
      category: "Outerwear",
      items: winterItems,
      reasoning: "Freezing temperatures require heavy insulation",
    })
  } else if (temp <= 10) {
    const coldItems =
      preferences.style === "sporty"
        ? ["Fleece jacket", "Track pants", "Running shoes"]
        : ["Warm jacket", "Jeans or warm pants", "Closed shoes"]

    recommendations.push({
      category: "Main Clothing",
      items: coldItems,
      reasoning: "Cold weather needs warm, layered clothing",
    })
  } else if (temp <= 20) {
    const mildItems =
      preferences.style === "sporty"
        ? ["Light hoodie", "Athletic pants", "Sneakers"]
        : preferences.style === "professional"
          ? ["Blazer", "Dress pants/skirt", "Dress shoes"]
          : ["Light sweater", "Jeans", "Comfortable shoes"]

    recommendations.push({
      category: "Main Clothing",
      items: mildItems,
      reasoning: "Mild temperatures are perfect for light layers",
    })
  } else if (temp <= 30) {
    const warmItems =
      preferences.style === "sporty"
        ? ["T-shirt", "Shorts", "Athletic shoes"]
        : preferences.style === "professional"
          ? ["Light shirt", "Lightweight pants", "Breathable shoes"]
          : ["T-shirt", "Shorts or light pants", "Sandals or sneakers"]

    recommendations.push({
      category: "Main Clothing",
      items: warmItems,
      reasoning: "Warm weather calls for light, breathable clothing",
    })
  } else {
    recommendations.push({
      category: "Main Clothing",
      items: ["Light, loose clothing", "Shorts", "Sandals", "Hat for sun protection"],
      reasoning: "Hot weather requires minimal, breathable clothing",
    })
  }

  // Weather-specific accessories
  const accessories: string[] = []
  let accessoryReasoning = ""

  if (isRaining) {
    accessories.push("Umbrella", "Waterproof jacket", "Water-resistant shoes")
    accessoryReasoning += "Rain protection is essential. "
  }

  if (isWindy) {
    accessories.push("Windbreaker", "Secure hat or avoid loose items")
    accessoryReasoning += "Windy conditions require secure clothing. "
  }

  if (weather.description.includes("sun") || temp > 25) {
    accessories.push("Sunglasses", "Sunscreen", "Hat")
    accessoryReasoning += "Sun protection recommended. "
  }

  if (temp <= 5) {
    accessories.push("Warm hat", "Gloves", "Scarf")
    accessoryReasoning += "Extremities need extra protection in cold. "
  }

  if (accessories.length > 0) {
    recommendations.push({
      category: "Accessories",
      items: accessories,
      reasoning: accessoryReasoning.trim(),
    })
  }

  // Comfort adjustments
  if (Math.abs(temp - feelsLike) > 3) {
    recommendations.push({
      category: "Comfort Note",
      items: [`Feels like ${feelsLike}°C due to ${isHumid ? "humidity" : "wind chill"}`],
      reasoning: "Consider how the weather actually feels, not just the temperature",
    })
  }

  return recommendations
}
