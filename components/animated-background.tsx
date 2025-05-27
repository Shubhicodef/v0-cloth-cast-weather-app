"use client"

import { motion } from "framer-motion"
import type { WeatherData } from "@/lib/weather"

interface AnimatedBackgroundProps {
  weather?: WeatherData | null
}

export function AnimatedBackground({ weather }: AnimatedBackgroundProps) {
  const getBackgroundGradient = () => {
    if (!weather) {
      return "from-blue-50 via-indigo-50 to-purple-50"
    }

    const temp = weather.temperature
    const description = weather.description.toLowerCase()

    if (description.includes("rain") || description.includes("drizzle")) {
      return "from-gray-400 via-blue-300 to-indigo-400"
    } else if (description.includes("snow")) {
      return "from-blue-100 via-white to-gray-100"
    } else if (description.includes("cloud")) {
      return "from-gray-200 via-blue-100 to-indigo-200"
    } else if (temp > 25) {
      return "from-yellow-200 via-orange-200 to-red-200"
    } else if (temp < 5) {
      return "from-blue-200 via-indigo-200 to-purple-200"
    } else {
      return "from-green-100 via-blue-100 to-indigo-100"
    }
  }

  const getParticleColor = () => {
    if (!weather) return "rgba(59, 130, 246, 0.1)"

    const description = weather.description.toLowerCase()
    if (description.includes("rain")) return "rgba(59, 130, 246, 0.3)"
    if (description.includes("snow")) return "rgba(255, 255, 255, 0.8)"
    if (description.includes("sun")) return "rgba(251, 191, 36, 0.2)"
    return "rgba(59, 130, 246, 0.1)"
  }

  return (
    <div className="fixed inset-0 -z-10">
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${getBackgroundGradient()}`}
        animate={{
          background: [
            `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
            `linear-gradient(45deg, var(--tw-gradient-stops))`,
            `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
          ],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full opacity-20"
          style={{
            backgroundColor: getParticleColor(),
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, -100, -20],
            x: [-10, 10, -10],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Weather-specific effects */}
      {weather?.description.includes("rain") && (
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-8 bg-blue-400 opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
              }}
              animate={{
                y: ["0vh", "110vh"],
              }}
              transition={{
                duration: 1 + Math.random() * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {weather?.description.includes("snow") && (
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-70"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-5%`,
              }}
              animate={{
                y: ["0vh", "105vh"],
                x: [-10, 10, -10],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
