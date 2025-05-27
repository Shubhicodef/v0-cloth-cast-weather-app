"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, Thermometer, Droplets, Wind, Eye, Sparkles } from "lucide-react"
import { getClothingRecommendations } from "./actions"
import type { WeatherData, ClothingRecommendation, UserPreferences } from "@/lib/weather"
import { WeatherIcon } from "@/components/weather-icon"
import { ClothingImage } from "@/components/clothing-image"
import { AnimatedBackground } from "@/components/animated-background"

export default function ClothCastApp() {
  const [location, setLocation] = useState("")
  const [preferences, setPreferences] = useState<UserPreferences>({
    gender: "other",
    ageGroup: "adult",
    style: "casual",
  })
  const [loading, setLoading] = useState(false)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [recommendations, setRecommendations] = useState<ClothingRecommendation[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!location.trim()) return

    setLoading(true)
    setError(null)
    setShowResults(false)

    try {
      const result = await getClothingRecommendations(location, preferences)

      if (result.success) {
        setWeather(result.weather!)
        setRecommendations(result.recommendations!)
        setTimeout(() => setShowResults(true), 500)
      } else {
        setError(result.error!)
      }
    } catch (err) {
      setError("Failed to get recommendations. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getLocationFromGPS = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setLocation(`${latitude},${longitude}`)
        },
        (error) => {
          setError("Unable to get your location. Please enter it manually.")
        },
      )
    } else {
      setError("Geolocation is not supported by your browser.")
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground weather={weather} />

      <div className="relative z-10 p-4">
        <motion.div
          className="max-w-4xl mx-auto space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Enhanced Header */}
          <motion.div className="text-center py-12" variants={itemVariants}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                🌤️ ClothCast
              </h1>
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Sparkles className="h-8 w-8 text-yellow-400" />
              </motion.div>
            </motion.div>
            <motion.p
              className="text-xl text-gray-700 font-medium"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              What to wear today based on the weather
            </motion.p>
          </motion.div>

          {/* Enhanced Input Form */}
          <motion.div variants={itemVariants}>
            <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="text-2xl text-gray-800">Tell us about yourself</CardTitle>
                <CardDescription className="text-gray-600">
                  We'll suggest the perfect outfit based on weather and your preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div className="space-y-2" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                      <Label htmlFor="location" className="text-gray-700 font-medium">
                        Location
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="location"
                          placeholder="Enter city name or zip code"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="flex-1 border-gray-200 focus:border-blue-400 transition-colors"
                        />
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={getLocationFromGPS}
                            title="Use current location"
                            className="border-gray-200 hover:bg-blue-50"
                          >
                            <MapPin className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>

                    <motion.div className="space-y-2" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                      <Label htmlFor="style" className="text-gray-700 font-medium">
                        Style Preference
                      </Label>
                      <Select
                        value={preferences.style}
                        onValueChange={(value: any) => setPreferences((prev) => ({ ...prev, style: value }))}
                      >
                        <SelectTrigger className="border-gray-200 focus:border-blue-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="sporty">Sporty</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>

                    <motion.div className="space-y-2" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                      <Label htmlFor="gender" className="text-gray-700 font-medium">
                        Gender (Optional)
                      </Label>
                      <Select
                        value={preferences.gender}
                        onValueChange={(value: any) => setPreferences((prev) => ({ ...prev, gender: value }))}
                      >
                        <SelectTrigger className="border-gray-200 focus:border-blue-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>

                    <motion.div className="space-y-2" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                      <Label htmlFor="age" className="text-gray-700 font-medium">
                        Age Group
                      </Label>
                      <Select
                        value={preferences.ageGroup}
                        onValueChange={(value: any) => setPreferences((prev) => ({ ...prev, ageGroup: value }))}
                      >
                        <SelectTrigger className="border-gray-200 focus:border-blue-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="teen">Teen (13-19)</SelectItem>
                          <SelectItem value="adult">Adult (20-64)</SelectItem>
                          <SelectItem value="senior">Senior (65+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-lg shadow-lg transition-all duration-300"
                      disabled={loading || !location.trim()}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Getting recommendations...
                        </>
                      ) : (
                        "Get Clothing Recommendations"
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-red-200 bg-red-50/90 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <p className="text-red-600 font-medium">{error}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Weather Display */}
          <AnimatePresence>
            {weather && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <WeatherIcon condition={weather.description} size={32} />
                      <span>Current Weather in {weather.location}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <motion.div
                        className="flex items-center gap-3 p-4 rounded-lg bg-orange-50 border border-orange-100"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Thermometer className="h-6 w-6 text-orange-500" />
                        <div>
                          <p className="text-3xl font-bold text-orange-600">{weather.temperature}°C</p>
                          <p className="text-sm text-gray-600">Feels like {weather.feelsLike}°C</p>
                        </div>
                      </motion.div>

                      <motion.div
                        className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Droplets className="h-6 w-6 text-blue-500" />
                        <div>
                          <p className="text-2xl font-bold text-blue-600">{weather.humidity}%</p>
                          <p className="text-sm text-gray-600">Humidity</p>
                        </div>
                      </motion.div>

                      <motion.div
                        className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 border border-gray-100"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Wind className="h-6 w-6 text-gray-500" />
                        <div>
                          <p className="text-2xl font-bold text-gray-600">{weather.windSpeed} km/h</p>
                          <p className="text-sm text-gray-600">Wind Speed</p>
                        </div>
                      </motion.div>

                      <motion.div
                        className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 border border-purple-100"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Eye className="h-6 w-6 text-purple-500" />
                        <div>
                          <p className="text-lg font-bold text-purple-600 capitalize">{weather.description}</p>
                          <p className="text-sm text-gray-600">Conditions</p>
                        </div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Recommendations Display */}
          <AnimatePresence>
            {showResults && recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <motion.h2
                  className="text-3xl font-bold text-gray-800 text-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  👕 Your Clothing Recommendations
                </motion.h2>

                <motion.div className="grid gap-6" variants={containerVariants} initial="hidden" animate="visible">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                          <CardTitle className="text-xl text-gray-800">{rec.category}</CardTitle>
                          <CardDescription className="text-gray-600">{rec.reasoning}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-1">
                              <div className="flex flex-wrap gap-3">
                                {rec.items.map((item, itemIndex) => (
                                  <motion.div
                                    key={itemIndex}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: itemIndex * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    <Badge
                                      variant="secondary"
                                      className="text-sm py-2 px-4 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 hover:from-blue-200 hover:to-indigo-200 transition-all duration-200"
                                    >
                                      {item}
                                    </Badge>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                            <div className="lg:w-48">
                              <ClothingImage
                                category={rec.category}
                                weather={weather!}
                                preferences={preferences}
                                items={rec.items}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Footer */}
          <motion.div className="text-center py-12 text-gray-600" variants={itemVariants}>
            <motion.p className="text-lg font-medium" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              Stay comfortable and stylish with ClothCast! 🌟
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
