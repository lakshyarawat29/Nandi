"use client"

import { useState } from "react"
import { ArrowLeft, Star, TrendingUp, TrendingDown, Award, Target, CheckCircle, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import Link from "next/link"

interface ScoreComponent {
  name: string
  score: number
  maxScore: number
  weight: number
  status: "excellent" | "good" | "fair" | "poor"
  description: string
  improvement: string[]
}

interface TrustScoreHistory {
  month: string
  score: number
  repayment: number
  productivity: number
  engagement: number
}

interface Benefit {
  title: string
  description: string
  available: boolean
  requiredScore: number
  icon: string
}

export default function TrustScoreDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("6months")

  // Current trust score data
  const currentScore = 750
  const maxScore = 1000
  const scoreGrade = "Good"
  const scoreChange = +25
  const lastUpdated = "2 days ago"

  // Score components breakdown
  const scoreComponents: ScoreComponent[] = [
    {
      name: "Repayment History",
      score: 85,
      maxScore: 100,
      weight: 35,
      status: "excellent",
      description: "Your loan repayment track record",
      improvement: ["Maintain timely payments", "Pay before due dates when possible"],
    },
    {
      name: "Farm Productivity",
      score: 78,
      maxScore: 100,
      weight: 25,
      status: "good",
      description: "Crop yield and farming efficiency",
      improvement: ["Increase crop yield per acre", "Diversify crop portfolio", "Use modern farming techniques"],
    },
    {
      name: "Market Engagement",
      score: 72,
      maxScore: 100,
      weight: 20,
      status: "good",
      description: "Active participation in agricultural markets",
      improvement: ["Sell more frequently in mandis", "Use digital payment methods", "Maintain sales records"],
    },
    {
      name: "Financial Stability",
      score: 68,
      maxScore: 100,
      weight: 15,
      status: "fair",
      description: "Income consistency and savings",
      improvement: ["Maintain steady income", "Build emergency savings", "Reduce debt-to-income ratio"],
    },
    {
      name: "Technology Adoption",
      score: 45,
      maxScore: 100,
      weight: 5,
      status: "poor",
      description: "Use of digital tools and services",
      improvement: ["Use mobile banking", "Adopt digital payment methods", "Use agricultural apps"],
    },
  ]

  // Historical score data
  const scoreHistory: TrustScoreHistory[] = [
    { month: "Jan", score: 680, repayment: 75, productivity: 70, engagement: 65 },
    { month: "Feb", score: 695, repayment: 78, productivity: 72, engagement: 68 },
    { month: "Mar", score: 710, repayment: 80, productivity: 74, engagement: 70 },
    { month: "Apr", score: 725, repayment: 82, productivity: 76, engagement: 71 },
    { month: "May", score: 740, repayment: 84, productivity: 77, engagement: 72 },
    { month: "Jun", score: 750, repayment: 85, productivity: 78, engagement: 72 },
  ]

  // Available benefits based on trust score
  const benefits: Benefit[] = [
    {
      title: "Kisan Credit Card",
      description: "Up to ₹3 Lakh at 7% interest rate",
      available: true,
      requiredScore: 650,
      icon: "💳",
    },
    {
      title: "Crop Insurance Discount",
      description: "15% discount on premium",
      available: true,
      requiredScore: 700,
      icon: "🛡️",
    },
    {
      title: "Equipment Loan",
      description: "Up to ₹10 Lakh for farm equipment",
      available: true,
      requiredScore: 750,
      icon: "🚜",
    },
    {
      title: "Premium Loan Rate",
      description: "5.5% interest rate (2% below market)",
      available: false,
      requiredScore: 800,
      icon: "⭐",
    },
    {
      title: "Instant Loan Approval",
      description: "Get loans approved within 24 hours",
      available: false,
      requiredScore: 850,
      icon: "⚡",
    },
    {
      title: "Gold Tier Benefits",
      description: "Priority support and exclusive offers",
      available: false,
      requiredScore: 900,
      icon: "👑",
    },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 800) return "text-green-600"
    if (score >= 700) return "text-blue-600"
    if (score >= 600) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreGrade = (score: number) => {
    if (score >= 850) return "Excellent"
    if (score >= 750) return "Good"
    if (score >= 650) return "Fair"
    return "Poor"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600 bg-green-50 border-green-200"
      case "good":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "fair":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "poor":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const pieData = scoreComponents.map((component) => ({
    name: component.name,
    value: component.weight,
    score: component.score,
  }))

  const COLORS = ["#15803d", "#3b82f6", "#84cc16", "#f59e0b", "#ef4444"]

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
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Updated {lastUpdated}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Trust Score Dashboard</h1>
          <p className="text-muted-foreground">
            Track your financial credibility and unlock better farming opportunities
          </p>
        </div>

        {/* Current Score Overview */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Trust Score</span>
                <div className="flex items-center space-x-2">
                  {scoreChange > 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  )}
                  <span className={`text-sm ${scoreChange > 0 ? "text-green-600" : "text-red-600"}`}>
                    {scoreChange > 0 ? "+" : ""}
                    {scoreChange} this month
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className={`text-5xl font-bold ${getScoreColor(currentScore)}`}>{currentScore}</div>
                  <div className="text-lg text-muted-foreground">out of {maxScore}</div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={`text-lg px-4 py-2 ${getScoreColor(currentScore)}`}>
                    {scoreGrade}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-2">Credit Grade</div>
                </div>
              </div>
              <Progress value={(currentScore / maxScore) * 100} className="h-3 mb-4" />
              <div className="grid grid-cols-4 gap-4 text-center text-sm">
                <div>
                  <div className="font-semibold">Poor</div>
                  <div className="text-muted-foreground">300-599</div>
                </div>
                <div>
                  <div className="font-semibold">Fair</div>
                  <div className="text-muted-foreground">600-699</div>
                </div>
                <div>
                  <div className="font-semibold text-primary">Good</div>
                  <div className="text-muted-foreground">700-799</div>
                </div>
                <div>
                  <div className="font-semibold">Excellent</div>
                  <div className="text-muted-foreground">800-1000</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Score Composition</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Weight"]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="breakdown" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="breakdown">Score Breakdown</TabsTrigger>
            <TabsTrigger value="history">Score History</TabsTrigger>
            <TabsTrigger value="benefits">Benefits & Rewards</TabsTrigger>
          </TabsList>

          {/* Score Breakdown Tab */}
          <TabsContent value="breakdown" className="space-y-6">
            <div className="grid gap-6">
              {scoreComponents.map((component, index) => (
                <Card key={index} className="border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{component.name}</h3>
                        <p className="text-sm text-muted-foreground">{component.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {component.score}/{component.maxScore}
                        </div>
                        <Badge variant="outline" className={`text-xs ${getStatusColor(component.status)}`}>
                          {component.status.charAt(0).toUpperCase() + component.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={component.score} className="h-2 mb-4" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Weight: {component.weight}%</span>
                      <span className="text-muted-foreground">
                        Contributes {Math.round((component.score / 100) * component.weight)} points to total score
                      </span>
                    </div>
                    <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center">
                        <Target className="w-4 h-4 mr-2 text-primary" />
                        How to Improve
                      </h4>
                      <ul className="space-y-1">
                        {component.improvement.map((tip, tipIndex) => (
                          <li key={tipIndex} className="text-sm text-muted-foreground flex items-start">
                            <CheckCircle className="w-3 h-3 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Score History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Trust Score Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={scoreHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[600, 800]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#15803d"
                      strokeWidth={3}
                      name="Overall Score"
                      dot={{ fill: "#15803d", strokeWidth: 2, r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="repayment"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Repayment History"
                    />
                    <Line
                      type="monotone"
                      dataKey="productivity"
                      stroke="#84cc16"
                      strokeWidth={2}
                      name="Farm Productivity"
                    />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="Market Engagement"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">+70</div>
                      <div className="text-sm text-muted-foreground">Points gained in 6 months</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">3</div>
                      <div className="text-sm text-muted-foreground">New benefits unlocked</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">50</div>
                      <div className="text-sm text-muted-foreground">Points to next tier</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Benefits & Rewards Tab */}
          <TabsContent value="benefits" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className={`border-border ${benefit.available ? "bg-green-50/50" : "bg-gray-50/50"}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{benefit.icon}</div>
                        <div>
                          <h3 className="font-semibold">{benefit.title}</h3>
                          <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </div>
                      </div>
                      {benefit.available ? (
                        <Badge className="bg-green-600 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-600">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Locked
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Required Score: {benefit.requiredScore}</span>
                      {benefit.available ? (
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          Apply Now
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {benefit.requiredScore - currentScore} points needed
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="w-5 h-5 text-primary" />
                  <span>How Trust Score Works</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Score Calculation</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Repayment History (35%): Loan payment track record</li>
                      <li>• Farm Productivity (25%): Crop yield and efficiency</li>
                      <li>• Market Engagement (20%): Active market participation</li>
                      <li>• Financial Stability (15%): Income and savings consistency</li>
                      <li>• Technology Adoption (5%): Digital tool usage</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Score Benefits</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Lower interest rates on loans</li>
                      <li>• Faster loan approval process</li>
                      <li>• Higher loan limits</li>
                      <li>• Insurance premium discounts</li>
                      <li>• Priority customer support</li>
                      <li>• Exclusive farming programs</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
