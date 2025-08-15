"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Thermometer,
  Droplets,
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import Link from "next/link"

interface WeatherData {
  location: string
  current: {
    temperature: number
    humidity: number
    windSpeed: number
    condition: string
    icon: string
  }
  forecast: Array<{
    date: string
    high: number
    low: number
    condition: string
    rainfall: number
    icon: string
  }>
}

interface MarketPrice {
  crop: string
  price: number
  unit: string
  change: number
  trend: "up" | "down" | "stable"
  market: string
  lastUpdated: string
}

interface PriceHistory {
  date: string
  wheat: number
  rice: number
  cotton: number
  sugarcane: number
}

export default function DataIntegration() {
  const [selectedLocation, setSelectedLocation] = useState("punjab")
  const [selectedTimeframe, setSelectedTimeframe] = useState("7days")
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const locations = [
    { value: "punjab", label: "Punjab" },
    { value: "haryana", label: "Haryana" },
    { value: "uttar-pradesh", label: "Uttar Pradesh" },
    { value: "maharashtra", label: "Maharashtra" },
    { value: "gujarat", label: "Gujarat" },
    { value: "rajasthan", label: "Rajasthan" },
  ]

  // Mock weather data
  const weatherData: WeatherData = {
    location: "Ludhiana, Punjab",
    current: {
      temperature: 32,
      humidity: 65,
      windSpeed: 12,
      condition: "Partly Cloudy",
      icon: "partly-cloudy",
    },
    forecast: [
      { date: "Today", high: 35, low: 28, condition: "Sunny", rainfall: 0, icon: "sunny" },
      { date: "Tomorrow", high: 33, low: 26, condition: "Partly Cloudy", rainfall: 0, icon: "partly-cloudy" },
      { date: "Wed", high: 31, low: 24, condition: "Cloudy", rainfall: 2, icon: "cloudy" },
      { date: "Thu", high: 29, low: 22, condition: "Light Rain", rainfall: 8, icon: "rain" },
      { date: "Fri", high: 30, low: 23, condition: "Partly Cloudy", rainfall: 1, icon: "partly-cloudy" },
    ],
  }

  // Mock market prices
  const marketPrices: MarketPrice[] = [
    {
      crop: "Wheat",
      price: 2150,
      unit: "₹/quintal",
      change: 3.2,
      trend: "up",
      market: "Ludhiana Mandi",
      lastUpdated: "2 hours ago",
    },
    {
      crop: "Rice (Basmati)",
      price: 4200,
      unit: "₹/quintal",
      change: -1.5,
      trend: "down",
      market: "Amritsar Mandi",
      lastUpdated: "1 hour ago",
    },
    {
      crop: "Cotton",
      price: 6800,
      unit: "₹/quintal",
      change: 5.8,
      trend: "up",
      market: "Bathinda Mandi",
      lastUpdated: "3 hours ago",
    },
    {
      crop: "Sugarcane",
      price: 380,
      unit: "₹/quintal",
      change: 0.0,
      trend: "stable",
      market: "Jalandhar Mandi",
      lastUpdated: "4 hours ago",
    },
    {
      crop: "Maize",
      price: 1890,
      unit: "₹/quintal",
      change: 2.1,
      trend: "up",
      market: "Patiala Mandi",
      lastUpdated: "1 hour ago",
    },
    {
      crop: "Mustard",
      price: 5200,
      unit: "₹/quintal",
      change: -2.3,
      trend: "down",
      market: "Ludhiana Mandi",
      lastUpdated: "2 hours ago",
    },
  ]

  // Mock price history data
  const priceHistory: PriceHistory[] = [
    { date: "Jan", wheat: 2000, rice: 4000, cotton: 6200, sugarcane: 360 },
    { date: "Feb", wheat: 2050, rice: 4100, cotton: 6300, sugarcane: 365 },
    { date: "Mar", wheat: 2100, rice: 4200, cotton: 6500, sugarcane: 370 },
    { date: "Apr", wheat: 2080, rice: 4150, cotton: 6400, sugarcane: 375 },
    { date: "May", wheat: 2120, rice: 4250, cotton: 6600, sugarcane: 380 },
    { date: "Jun", wheat: 2150, rice: 4200, cotton: 6800, sugarcane: 380 },
  ]

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="w-8 h-8 text-yellow-500" />
      case "partly-cloudy":
        return <Cloud className="w-8 h-8 text-gray-500" />
      case "cloudy":
        return <Cloud className="w-8 h-8 text-gray-600" />
      case "rain":
        return <CloudRain className="w-8 h-8 text-blue-500" />
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />
    }
  }

  const refreshData = () => {
    setLastUpdated(new Date())
    // In a real app, this would fetch fresh data from APIs
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2 text-muted-foreground hover:text-primary">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Weather & Market Intelligence</h1>
          <p className="text-muted-foreground">Real-time data to help you make informed farming decisions</p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant="outline" className="text-xs">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {weatherData.location}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Current Weather */}
          <Card className="border-border lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Thermometer className="w-5 h-5 text-primary" />
                <span>Current Weather</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                {getWeatherIcon(weatherData.current.icon)}
                <div className="text-3xl font-bold mt-2">{weatherData.current.temperature}°C</div>
                <div className="text-muted-foreground">{weatherData.current.condition}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span>Humidity: {weatherData.current.humidity}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wind className="w-4 h-4 text-gray-500" />
                  <span>Wind: {weatherData.current.windSpeed} km/h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weather Forecast */}
          <Card className="border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>5-Day Forecast</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className="text-center p-2 rounded-lg bg-muted/30">
                    <div className="text-sm font-medium mb-2">{day.date}</div>
                    <div className="flex justify-center mb-2">{getWeatherIcon(day.icon)}</div>
                    <div className="text-sm">
                      <div className="font-semibold">{day.high}°</div>
                      <div className="text-muted-foreground">{day.low}°</div>
                    </div>
                    {day.rainfall > 0 && <div className="text-xs text-blue-600 mt-1">{day.rainfall}mm</div>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Prices */}
        <Card className="border-border mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Today's Mandi Prices</span>
              </div>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="7days">7 Days</SelectItem>
                  <SelectItem value="30days">30 Days</SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketPrices.map((price, index) => (
                <div key={index} className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{price.crop}</h3>
                    {getTrendIcon(price.trend)}
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {price.price.toLocaleString()} {price.unit.split("/")[0]}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">per {price.unit.split("/")[1]}</div>
                  <div
                    className={`text-sm flex items-center space-x-1 mb-2 ${
                      price.trend === "up"
                        ? "text-green-600"
                        : price.trend === "down"
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {getTrendIcon(price.trend)}
                    <span>
                      {price.change > 0 ? "+" : ""}
                      {price.change}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{price.market}</span>
                    </div>
                    <div className="mt-1">Updated: {price.lastUpdated}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Price Trends Chart */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Price Trends (6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}`, "Price"]} />
                  <Line type="monotone" dataKey="wheat" stroke="#15803d" strokeWidth={2} name="Wheat" />
                  <Line type="monotone" dataKey="rice" stroke="#84cc16" strokeWidth={2} name="Rice" />
                  <Line type="monotone" dataKey="cotton" stroke="#3b82f6" strokeWidth={2} name="Cotton" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Market Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={marketPrices.slice(0, 4)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="crop" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}`, "Price per quintal"]} />
                  <Bar dataKey="price" fill="#15803d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="border-border mt-6">
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">🌾 Selling Opportunity</h3>
                <p className="text-sm text-green-700">
                  Cotton prices are up 5.8% this week. Consider selling your cotton stock at Bathinda Mandi for better
                  returns.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">🌧️ Weather Alert</h3>
                <p className="text-sm text-blue-700">
                  Light rain expected on Thursday. Plan your harvesting activities accordingly and protect stored crops.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-2">💰 Loan Opportunity</h3>
                <p className="text-sm text-yellow-700">
                  With rising wheat prices, consider taking a crop loan for next season's wheat cultivation.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-2">📊 Market Insight</h3>
                <p className="text-sm text-purple-700">
                  Mustard prices are declining. Hold your stock for 2-3 weeks for potential price recovery.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
