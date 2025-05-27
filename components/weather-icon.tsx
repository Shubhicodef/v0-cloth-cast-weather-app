"use client"

import { motion } from "framer-motion"
import { Sun, Cloud, CloudRain, CloudSnow, CloudDrizzle, Wind, Eye } from "lucide-react"

interface WeatherIconProps {
  condition: string
  size?: number
}

export function WeatherIcon({ condition, size = 24 }: WeatherIconProps) {
  const getIcon = () => {
    const desc = condition.toLowerCase()

    if (desc.includes("clear") || desc.includes("sun")) {
      return <Sun className={`h-${size / 4} w-${size / 4}`} style={{ width: size, height: size }} />
    } else if (desc.includes("rain")) {
      return <CloudRain className={`h-${size / 4} w-${size / 4}`} style={{ width: size, height: size }} />
    } else if (desc.includes("drizzle")) {
      return <CloudDrizzle className={`h-${size / 4} w-${size / 4}`} style={{ width: size, height: size }} />
    } else if (desc.includes("snow")) {
      return <CloudSnow className={`h-${size / 4} w-${size / 4}`} style={{ width: size, height: size }} />
    } else if (desc.includes("wind")) {
      return <Wind className={`h-${size / 4} w-${size / 4}`} style={{ width: size, height: size }} />
    } else if (desc.includes("cloud")) {
      return <Cloud className={`h-${size / 4} w-${size / 4}`} style={{ width: size, height: size }} />
    } else {
      return <Eye className={`h-${size / 4} w-${size / 4}`} style={{ width: size, height: size }} />
    }
  }

  const getColor = () => {
    const desc = condition.toLowerCase()

    if (desc.includes("clear") || desc.includes("sun")) return "text-yellow-500"
    if (desc.includes("rain") || desc.includes("drizzle")) return "text-blue-500"
    if (desc.includes("snow")) return "text-blue-200"
    if (desc.includes("cloud")) return "text-gray-500"
    return "text-gray-400"
  }

  const getAnimation = () => {
    const desc = condition.toLowerCase()

    if (desc.includes("clear") || desc.includes("sun")) {
      return {
        rotate: 360,
        transition: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
      }
    } else if (desc.includes("rain") || desc.includes("drizzle")) {
      return {
        y: [0, -2, 0],
        transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
      }
    } else if (desc.includes("cloud")) {
      return {
        x: [0, 2, 0],
        transition: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
      }
    }
    return {}
  }

  return (
    <motion.div className={getColor()} animate={getAnimation()}>
      {getIcon()}
    </motion.div>
  )
}
