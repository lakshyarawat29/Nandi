'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  MessageSquare,
  TrendingUp,
  Settings,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Link from 'next/link';

interface Farmer {
  id: string;
  name: string;
  phone: string;
  location: string;
  registrationDate: string;
  trustScore: number;
  status: 'active' | 'inactive' | 'suspended';
  lastActivity: string;
}

interface ChatSession {
  id: string;
  farmerId: string;
  farmerName: string;
  type: 'sms' | 'voice';
  duration: string;
  messages: number;
  timestamp: string;
  status: 'completed' | 'ongoing' | 'failed';
}

interface SystemMetric {
  name: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export default function AdminControlPanel() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7days');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for farmers
  const farmers: Farmer[] = [
    {
      id: 'F001',
      name: 'राम कुमार',
      phone: '+91 98765 43210',
      location: 'Ludhiana, Punjab',
      registrationDate: '2024-01-15',
      trustScore: 750,
      status: 'active',
      lastActivity: '2 hours ago',
    },
    {
      id: 'F002',
      name: 'Priya Devi',
      phone: '+91 87654 32109',
      location: 'Amritsar, Punjab',
      registrationDate: '2024-01-20',
      trustScore: 680,
      status: 'active',
      lastActivity: '1 day ago',
    },
    {
      id: 'F003',
      name: 'Suresh Patel',
      phone: '+91 76543 21098',
      location: 'Ahmedabad, Gujarat',
      registrationDate: '2024-02-01',
      trustScore: 820,
      status: 'inactive',
      lastActivity: '5 days ago',
    },
    {
      id: 'F004',
      name: 'Lakshmi Reddy',
      phone: '+91 65432 10987',
      location: 'Hyderabad, Telangana',
      registrationDate: '2024-02-10',
      trustScore: 590,
      status: 'suspended',
      lastActivity: '1 week ago',
    },
  ];

  // Mock data for chat sessions
  const chatSessions: ChatSession[] = [
    {
      id: 'C001',
      farmerId: 'F001',
      farmerName: 'राम कुमार',
      type: 'sms',
      duration: '5 min',
      messages: 8,
      timestamp: '2024-06-15 14:30',
      status: 'completed',
    },
    {
      id: 'C002',
      farmerId: 'F002',
      farmerName: 'Priya Devi',
      type: 'voice',
      duration: '12 min',
      messages: 0,
      timestamp: '2024-06-15 13:45',
      status: 'completed',
    },
    {
      id: 'C003',
      farmerId: 'F003',
      farmerName: 'Suresh Patel',
      type: 'sms',
      duration: '3 min',
      messages: 5,
      timestamp: '2024-06-15 12:20',
      status: 'ongoing',
    },
  ];

  // System metrics
  const systemMetrics: SystemMetric[] = [
    { name: 'Total Farmers', value: '10,247', change: 12.5, trend: 'up' },
    { name: 'Active Users', value: '8,932', change: 8.3, trend: 'up' },
    { name: 'Chat Sessions', value: '1,456', change: -2.1, trend: 'down' },
    { name: 'Trust Score Avg', value: '742', change: 5.2, trend: 'up' },
  ];

  // Analytics data
  const userGrowthData = [
    { month: 'Jan', users: 5200, sessions: 890 },
    { month: 'Feb', users: 6100, sessions: 1120 },
    { month: 'Mar', users: 7300, sessions: 1340 },
    { month: 'Apr', users: 8200, sessions: 1280 },
    { month: 'May', users: 9100, sessions: 1420 },
    { month: 'Jun', users: 10247, sessions: 1456 },
  ];

  const trustScoreDistribution = [
    { range: '300-499', count: 1024, color: '#ef4444' },
    { range: '500-649', count: 2156, color: '#f59e0b' },
    { range: '650-749', count: 3892, color: '#3b82f6' },
    { range: '750-849', count: 2654, color: '#10b981' },
    { range: '850-1000', count: 521, color: '#8b5cf6' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Inactive</Badge>
        );
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getChatStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'ongoing':
        return <Badge className="bg-blue-100 text-blue-800">Ongoing</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.phone.includes(searchTerm) ||
      farmer.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || farmer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center space-x-2 text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Admin Panel
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Admin Control Panel
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage the Nandi platform
          </p>
        </div>

        {/* System Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemMetrics.map((metric, index) => (
            <Card key={index} className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {metric.name}
                    </p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(metric.trend)}
                    <span
                      className={`text-sm ${
                        metric.trend === 'up'
                          ? 'text-green-600'
                          : metric.trend === 'down'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {metric.change > 0 ? '+' : ''}
                      {metric.change}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="farmers">Farmers</TabsTrigger>
            <TabsTrigger value="chats">Chat Sessions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>User Growth Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#15803d"
                        strokeWidth={2}
                        name="Total Users"
                      />
                      <Line
                        type="monotone"
                        dataKey="sessions"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Chat Sessions"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Trust Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={trustScoreDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        label={({ range, count }) => `${range}: ${count}`}
                      >
                        {trustScoreDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Recent System Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">New farmer registration</p>
                      <p className="text-sm text-muted-foreground">
                        Rajesh Kumar from Haryana joined the platform
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-auto">
                      2 min ago
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">High chat volume detected</p>
                      <p className="text-sm text-muted-foreground">
                        156 active chat sessions in the last hour
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-auto">
                      15 min ago
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">Weather API response slow</p>
                      <p className="text-sm text-muted-foreground">
                        Average response time: 3.2s (normal: 1.1s)
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-auto">
                      1 hour ago
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Farmers Tab */}
          <TabsContent value="farmers" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Farmer Management</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                    >
                      Add Farmer
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search farmers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Farmer ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Trust Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFarmers.map((farmer) => (
                      <TableRow key={farmer.id}>
                        <TableCell className="font-medium">
                          {farmer.id}
                        </TableCell>
                        <TableCell>{farmer.name}</TableCell>
                        <TableCell>{farmer.phone}</TableCell>
                        <TableCell>{farmer.location}</TableCell>
                        <TableCell>
                          <span
                            className={`font-semibold ${
                              farmer.trustScore >= 750
                                ? 'text-green-600'
                                : farmer.trustScore >= 650
                                ? 'text-blue-600'
                                : 'text-yellow-600'
                            }`}
                          >
                            {farmer.trustScore}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(farmer.status)}</TableCell>
                        <TableCell>{farmer.lastActivity}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Sessions Tab */}
          <TabsContent value="chats" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Chat Session Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Session ID</TableHead>
                      <TableHead>Farmer</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Messages</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chatSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">
                          {session.id}
                        </TableCell>
                        <TableCell>{session.farmerName}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              session.type === 'sms'
                                ? 'text-blue-600'
                                : 'text-green-600'
                            }
                          >
                            {session.type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{session.duration}</TableCell>
                        <TableCell>{session.messages || 'N/A'}</TableCell>
                        <TableCell>{session.timestamp}</TableCell>
                        <TableCell>
                          {getChatStatusBadge(session.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Monthly Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="#15803d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Chat Session Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">SMS Sessions</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          1,234
                        </div>
                        <div className="text-sm text-muted-foreground">
                          85% of total
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Voice Sessions</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          222
                        </div>
                        <div className="text-sm text-muted-foreground">
                          15% of total
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>API Response Time</span>
                    <Badge className="bg-green-100 text-green-800">
                      Good (1.2s)
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Database Connection</span>
                    <Badge className="bg-green-100 text-green-800">
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SMS Service</span>
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Weather API</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Slow
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Market Data Feed</span>
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    SMS Gateway Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Weather API Configuration
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Trust Score Parameters
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Market Data Sources
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    User Permissions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
