"use server"

import { getWeatherData } from "@/lib/weather"
import { generateClothingRecommendations, type UserPreferences } from "@/lib/recommendations"

export async function getClothingRecommendations(location: string, preferences: UserPreferences) {
  try {
    const weather = await getWeatherData(location)
    const recommendations = generateClothingRecommendations(weather, preferences)

    return {
      success: true,
      weather,
      recommendations,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    }
  }
}
