'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Send,
  Mic,
  MicOff,
  Phone,
  MessageSquare,
  Volume2,
  Languages,
  User,
  Bot,
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
import Link from 'next/link';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  language?: string;
  audioUrl?: string;
}

interface QuickAction {
  id: string;
  label: string;
  query: string;
  icon: string;
}

export default function ChatInterface() {
  const [activeMode, setActiveMode] = useState<'sms' | 'voice'>('sms');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content:
        'Namaste! I am your Nandi AI assistant. How can I help you today? You can ask about weather, market prices, loans, or farming advice.',
      timestamp: new Date(),
      language: 'english',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages = [
    { value: 'english', label: 'English', code: 'EN' },
    { value: 'hindi', label: 'हिंदी', code: 'HI' },
    { value: 'bengali', label: 'বাংলা', code: 'BN' },
    { value: 'tamil', label: 'தமிழ்', code: 'TA' },
    { value: 'telugu', label: 'తెలుగు', code: 'TE' },
    { value: 'kannada', label: 'ಕನ್ನಡ', code: 'KN' },
  ];

  const quickActions: QuickAction[] = [
    {
      id: '1',
      label: 'Weather Update',
      query: "What is today's weather forecast?",
      icon: '🌤️',
    },
    {
      id: '2',
      label: 'Market Prices',
      query: "Show me today's mandi prices",
      icon: '💰',
    },
    {
      id: '3',
      label: 'Loan Information',
      query: 'I need information about agricultural loans',
      icon: '🏦',
    },
    {
      id: '4',
      label: 'Crop Advice',
      query: 'Give me advice for my wheat crop',
      icon: '🌾',
    },
    {
      id: '5',
      label: 'Trust Score',
      query: 'Check my current trust score',
      icon: '⭐',
    },
    {
      id: '6',
      label: 'Satellite Data',
      query: "Show my farm's satellite analysis",
      icon: '🛰️',
    },
  ];

  // Simulate AI responses based on user queries
  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    if (message.includes('weather')) {
      return `Today's weather forecast for your area:\n🌤️ Temperature: 28°C - 35°C\n🌧️ Rain: 20% chance\n💨 Wind: 12 km/h\n\nRecommendation: Good day for field work. Consider watering crops in the evening.`;
    }

    if (
      message.includes('market') ||
      message.includes('price') ||
      message.includes('mandi')
    ) {
      return `Today's Mandi Prices (₹/quintal):\n🌾 Wheat: ₹2,150\n🌽 Maize: ₹1,890\n🥔 Potato: ₹1,200\n🧅 Onion: ₹2,800\n\nBest selling location: Azadpur Mandi, Delhi\nTrend: Wheat prices up 3% from last week`;
    }

    if (message.includes('loan')) {
      return `Agricultural Loan Options:\n🏦 Kisan Credit Card: Up to ₹3 Lakh at 7% interest\n🌱 Crop Loan: ₹50,000 - ₹5 Lakh\n🚜 Equipment Loan: Up to ₹10 Lakh\n\nYour Trust Score: 750/1000\nEligible for: KCC and Crop Loan\n\nWould you like help with application?`;
    }

    if (message.includes('trust score')) {
      return `Your Current Trust Score: 750/1000 ⭐\n\nScore Breakdown:\n✅ Repayment History: 85%\n✅ Farm Productivity: 78%\n✅ Market Engagement: 72%\n\nTo improve: Increase market sales frequency and maintain timely loan repayments.`;
    }

    if (message.includes('satellite') || message.includes('ndvi')) {
      return `🛰️ Satellite Analysis for your farm:\n\nNDVI Score: 0.65 (Good)\n🟢 Healthy crop area: 78%\n🟡 Moderate stress: 18%\n🔴 Stressed area: 4%\n\nRecommendation: Focus irrigation on the northeastern section. Consider soil testing for stressed areas.`;
    }

    if (
      message.includes('crop') ||
      message.includes('advice') ||
      message.includes('farming')
    ) {
      return `🌾 Farming Advice:\n\nFor current season:\n• Apply urea fertilizer (50kg/acre)\n• Monitor for pest activity\n• Ensure adequate irrigation\n• Consider intercropping with legumes\n\nExpected yield: 25-30 quintals/acre\nBest harvest time: Next 15-20 days`;
    }

    return `Thank you for your message. I can help you with:\n• Weather forecasts\n• Market prices\n• Loan information\n• Farming advice\n• Trust score updates\n• Satellite crop monitoring\n\nPlease ask me about any of these topics!`;
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      language: selectedLanguage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
        language: selectedLanguage,
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleQuickAction = (action: QuickAction) => {
    setInputMessage(action.query);
    setTimeout(() => sendMessage(), 100);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice recording
      setTimeout(() => {
        setIsRecording(false);
        setInputMessage("What are today's wheat prices in my area?");
      }, 3000);
    }
  };

  const startVoiceCall = () => {
    setIsCallActive(true);
    setCallDuration(0);
  };

  const endVoiceCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

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
                Demo Mode
              </Badge>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Mode Selector */}
          <div className="flex justify-center mb-6">
            <div className="bg-muted p-1 rounded-lg">
              <Button
                variant={activeMode === 'sms' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveMode('sms')}
                className="flex items-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>SMS Chat</span>
              </Button>
              <Button
                variant={activeMode === 'voice' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveMode('voice')}
                className="flex items-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>Voice Call</span>
              </Button>
            </div>
          </div>

          {/* SMS Chat Interface */}
          {activeMode === 'sms' && (
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Quick Actions */}
              <div className="lg:col-span-1">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {quickActions.map((action) => (
                      <Button
                        key={action.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction(action)}
                        className="w-full justify-start text-left h-auto p-3"
                      >
                        <span className="mr-2">{action.icon}</span>
                        <span className="text-xs">{action.label}</span>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Chat Messages */}
              <div className="lg:col-span-3">
                <Card className="border-border h-[600px] flex flex-col">
                  <CardHeader className="border-b border-border">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Nandi AI Assistant</span>
                      </CardTitle>
                      <Badge variant="outline">
                        {
                          languages.find((l) => l.value === selectedLanguage)
                            ?.label
                        }
                      </Badge>
                    </div>
                  </CardHeader>

                  {/* Messages Area */}
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.type === 'user'
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.type === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            {message.type === 'ai' && (
                              <Bot className="w-4 h-4 mt-1 text-primary" />
                            )}
                            {message.type === 'user' && (
                              <User className="w-4 h-4 mt-1 text-primary-foreground" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm whitespace-pre-line">
                                {message.content}
                              </p>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </CardContent>

                  {/* Input Area */}
                  <div className="border-t border-border p-4">
                    <div className="flex space-x-2">
                      <div className="flex-1 relative">
                        <Input
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          placeholder="Type your message..."
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="pr-12"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={toggleRecording}
                          className={`absolute right-1 top-1 h-8 w-8 p-0 ${
                            isRecording
                              ? 'text-red-500'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {isRecording ? (
                            <MicOff className="w-4 h-4" />
                          ) : (
                            <Mic className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <Button
                        onClick={sendMessage}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    {isRecording && (
                      <div className="flex items-center justify-center mt-2 text-red-500">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                        <span className="text-sm">Recording... Speak now</span>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Voice Call Interface */}
          {activeMode === 'voice' && (
            <div className="max-w-md mx-auto">
              <Card className="border-border">
                <CardContent className="p-8 text-center">
                  {!isCallActive ? (
                    <div className="space-y-6">
                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Phone className="w-12 h-12 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Voice Assistant
                        </h3>
                        <p className="text-muted-foreground">
                          Call our AI assistant for voice-based guidance in your
                          preferred language
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="text-sm text-muted-foreground">
                          Available in: Hindi, English, Bengali, Tamil, Telugu,
                          Kannada
                        </div>
                        <Button
                          size="lg"
                          onClick={startVoiceCall}
                          className="bg-green-600 hover:bg-green-700 text-white w-full"
                        >
                          <Phone className="w-5 h-5 mr-2" />
                          Start Voice Call
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <Phone className="w-12 h-12 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Call Active
                        </h3>
                        <p className="text-2xl font-mono text-primary">
                          {formatCallDuration(callDuration)}
                        </p>
                        <p className="text-muted-foreground mt-2">
                          "Hello! I can help you with weather, market prices,
                          and farming advice. What would you like to know?"
                        </p>
                      </div>
                      <div className="flex justify-center space-x-4">
                        <Button variant="outline" size="sm">
                          <Mic className="w-4 h-4 mr-2" />
                          Mute
                        </Button>
                        <Button variant="outline" size="sm">
                          <Volume2 className="w-4 h-4 mr-2" />
                          Speaker
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={endVoiceCall}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          End Call
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Voice Features */}
              <Card className="border-border mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Voice Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Languages className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">Multi-language Support</div>
                      <div className="text-sm text-muted-foreground">
                        Available in 6+ Indian languages
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Volume2 className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">Clear Audio</div>
                      <div className="text-sm text-muted-foreground">
                        High-quality voice synthesis
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Bot className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">AI-Powered</div>
                      <div className="text-sm text-muted-foreground">
                        Intelligent responses to your queries
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
