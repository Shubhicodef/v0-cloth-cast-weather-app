"use client"

import { motion } from "framer-motion"
import type { WeatherData, UserPreferences } from "@/lib/weather"

interface ClothingImageProps {
  category: string
  weather: WeatherData
  preferences: UserPreferences
  items: string[]
}

export function ClothingImage({ category, weather, preferences, items }: ClothingImageProps) {
  const getImageUrl = () => {
    const temp = weather.temperature
    const isRaining = weather.precipitation > 0
    const style = preferences.style

    // Generate appropriate placeholder image based on conditions
    let width = 200
    let height = 250
    let bgColor = "e5e7eb" // gray-200
    let textColor = "374151" // gray-700
    let text = ""

    if (category.toLowerCase().includes("outerwear") || category.toLowerCase().includes("main")) {
      if (temp <= 0) {
        bgColor = "3b82f6" // blue-500
        textColor = "ffffff"
        text = "Winter Coat"
      } else if (temp <= 10) {
        bgColor = "6366f1" // indigo-500
        textColor = "ffffff"
        text = "Warm Jacket"
      } else if (temp <= 20) {
        bgColor = "10b981" // emerald-500
        textColor = "ffffff"
        text = style === "sporty" ? "Hoodie" : "Light Jacket"
      } else if (temp <= 30) {
        bgColor = "f59e0b" // amber-500
        textColor = "ffffff"
        text = style === "sporty" ? "T-Shirt" : "Light Shirt"
      } else {
        bgColor = "ef4444" // red-500
        textColor = "ffffff"
        text = "Tank Top"
      }
    } else if (category.toLowerCase().includes("accessories")) {
      width = 150
      height = 150
      if (isRaining) {
        bgColor = "1e40af" // blue-800
        textColor = "ffffff"
        text = "Umbrella"
      } else if (temp <= 5) {
        bgColor = "7c3aed" // violet-600
        textColor = "ffffff"
        text = "Winter Gear"
      } else {
        bgColor = "059669" // emerald-600
        textColor = "ffffff"
        text = "Accessories"
      }
    } else {
      text = category
    }

    return `/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(text)}&bg=${bgColor}&color=${textColor}`
  }

  const getClothingEmoji = () => {
    const temp = weather.temperature
    const category_lower = category.toLowerCase()

    if (category_lower.includes("outerwear") || category_lower.includes("main")) {
      if (temp <= 0) return "🧥"
      if (temp <= 10) return "🧥"
      if (temp <= 20) return "👕"
      if (temp <= 30) return "👕"
      return "🩱"
    } else if (category_lower.includes("accessories")) {
      if (weather.precipitation > 0) return "☂️"
      if (temp <= 5) return "🧤"
      return "🕶️"
    }
    return "👔"
  }

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="relative overflow-hidden rounded-lg shadow-lg bg-white">
        <motion.img
          src={getImageUrl()}
          alt={`${category} clothing suggestion`}
          className="w-full h-auto object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />

        {/* Overlay with emoji */}
        <motion.div
          className="absolute top-2 right-2 bg-white/90 rounded-full p-2 shadow-md"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          <span className="text-2xl">{getClothingEmoji()}</span>
        </motion.div>

        {/* Temperature indicator */}
        <motion.div
          className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
        >
          {weather.temperature}°C
        </motion.div>

        {/* Style indicator */}
        <motion.div
          className="absolute bottom-2 right-2 bg-blue-500/80 text-white px-2 py-1 rounded text-xs"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        >
          {preferences.style}
        </motion.div>
      </div>

      {/* Floating particles around the image */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full"
          style={{
            top: `${20 + i * 30}%`,
            right: `-${5 + i * 2}px`,
          }}
          animate={{
            x: [0, 10, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  )
}
