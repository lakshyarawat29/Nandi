'use client';

import { useState } from 'react';
import { ArrowLeft, User, Phone, MapPin, Sprout, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

export default function FarmerRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    phoneNumber: '',
    alternatePhone: '',
    language: '',

    // Location Information
    state: '',
    district: '',
    village: '',
    pincode: '',

    // Farm Information
    farmSize: '',
    farmSizeUnit: 'acres',
    landOwnership: '',
    primaryCrops: [],
    secondaryCrops: '',
    irrigationType: '',

    // Financial Information
    monthlyIncome: '',
    hasLoan: false,
    bankAccount: false,

    // Communication Preferences
    preferredContact: 'sms',
    marketUpdates: true,
    weatherAlerts: true,

    // Terms
    agreeTerms: false,
    agreeDataUsage: false,
  });

  const languages = [
    { value: 'hindi', label: 'हिंदी (Hindi)' },
    { value: 'english', label: 'English' },
    { value: 'bengali', label: 'বাংলা (Bengali)' },
    { value: 'tamil', label: 'தமிழ் (Tamil)' },
    { value: 'telugu', label: 'తెలుగు (Telugu)' },
    { value: 'kannada', label: 'ಕನ್ನಡ (Kannada)' },
    { value: 'marathi', label: 'मराठी (Marathi)' },
    { value: 'gujarati', label: 'ગુજરાતી (Gujarati)' },
  ];

  const states = [
    'Andhra Pradesh',
    'Bihar',
    'Gujarat',
    'Haryana',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Tamil Nadu',
    'Telangana',
    'Uttar Pradesh',
    'West Bengal',
  ];

  const crops = [
    'Rice',
    'Wheat',
    'Cotton',
    'Sugarcane',
    'Maize',
    'Soybean',
    'Groundnut',
    'Sunflower',
    'Mustard',
    'Pulses',
    'Vegetables',
    'Fruits',
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCropToggle = (crop: string) => {
    setFormData((prev) => ({
      ...prev,
      primaryCrops: prev.primaryCrops.includes(crop)
        ? prev.primaryCrops.filter((c) => c !== crop)
        : [...prev.primaryCrops, crop],
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    console.log('[v0] Registration data:', formData);
    // Here you would typically send the data to your backend
    alert('Registration successful! Welcome to Nandi family.');
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.phoneNumber && formData.language;
      case 2:
        return formData.state && formData.district && formData.village;
      case 3:
        return (
          formData.farmSize &&
          formData.landOwnership &&
          formData.primaryCrops.length > 0
        );
      case 4:
        return formData.agreeTerms && formData.agreeDataUsage;
      default:
        return false;
    }
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
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sprout className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary">Nandi</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Farmer Registration
              </h1>
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of 4
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {currentStep === 1 && (
                  <>
                    <User className="w-5 h-5 text-primary" />
                    <span>Personal Information</span>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>Location Details</span>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <Sprout className="w-5 h-5 text-primary" />
                    <span>Farm Information</span>
                  </>
                )}
                {currentStep === 4 && (
                  <>
                    <Globe className="w-5 h-5 text-primary" />
                    <span>Preferences & Terms</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange('fullName', e.target.value)
                      }
                      placeholder="Enter your full name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">Mobile Number *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange('phoneNumber', e.target.value)
                      }
                      placeholder="Enter 10-digit mobile number"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="alternatePhone">
                      Alternate Mobile Number
                    </Label>
                    <Input
                      id="alternatePhone"
                      type="tel"
                      value={formData.alternatePhone}
                      onChange={(e) =>
                        handleInputChange('alternatePhone', e.target.value)
                      }
                      placeholder="Optional alternate number"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="language">Preferred Language *</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) =>
                        handleInputChange('language', value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your preferred language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2: Location Information */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) =>
                        handleInputChange('state', value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="district">District *</Label>
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={(e) =>
                        handleInputChange('district', e.target.value)
                      }
                      placeholder="Enter your district"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="village">Village/Town *</Label>
                    <Input
                      id="village"
                      value={formData.village}
                      onChange={(e) =>
                        handleInputChange('village', e.target.value)
                      }
                      placeholder="Enter your village or town"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pincode">PIN Code</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) =>
                        handleInputChange('pincode', e.target.value)
                      }
                      placeholder="Enter 6-digit PIN code"
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Farm Information */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Label htmlFor="farmSize">Farm Size *</Label>
                      <Input
                        id="farmSize"
                        type="number"
                        value={formData.farmSize}
                        onChange={(e) =>
                          handleInputChange('farmSize', e.target.value)
                        }
                        placeholder="Enter farm size"
                        className="mt-1"
                      />
                    </div>
                    <div className="w-24">
                      <Label htmlFor="farmSizeUnit">Unit</Label>
                      <Select
                        value={formData.farmSizeUnit}
                        onValueChange={(value) =>
                          handleInputChange('farmSizeUnit', value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="acres">Acres</SelectItem>
                          <SelectItem value="hectares">Hectares</SelectItem>
                          <SelectItem value="bigha">Bigha</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="landOwnership">Land Ownership *</Label>
                    <Select
                      value={formData.landOwnership}
                      onValueChange={(value) =>
                        handleInputChange('landOwnership', value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select land ownership type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owned">Owned</SelectItem>
                        <SelectItem value="leased">Leased</SelectItem>
                        <SelectItem value="sharecropping">
                          Sharecropping
                        </SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Primary Crops * (Select all that apply)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {crops.map((crop) => (
                        <div key={crop} className="flex items-center space-x-2">
                          <Checkbox
                            id={crop}
                            checked={formData.primaryCrops.includes(crop)}
                            onCheckedChange={() => handleCropToggle(crop)}
                          />
                          <Label htmlFor={crop} className="text-sm">
                            {crop}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="irrigationType">Irrigation Type</Label>
                    <Select
                      value={formData.irrigationType}
                      onValueChange={(value) =>
                        handleInputChange('irrigationType', value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select irrigation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rainfed">Rain-fed</SelectItem>
                        <SelectItem value="canal">Canal</SelectItem>
                        <SelectItem value="borewell">Borewell</SelectItem>
                        <SelectItem value="drip">Drip Irrigation</SelectItem>
                        <SelectItem value="sprinkler">Sprinkler</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 4: Preferences & Terms */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <Label>Communication Preferences</Label>
                    <div className="space-y-3 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="marketUpdates"
                          checked={formData.marketUpdates}
                          onCheckedChange={(checked) =>
                            handleInputChange('marketUpdates', checked)
                          }
                        />
                        <Label htmlFor="marketUpdates">
                          Receive market price updates
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="weatherAlerts"
                          checked={formData.weatherAlerts}
                          onCheckedChange={(checked) =>
                            handleInputChange('weatherAlerts', checked)
                          }
                        />
                        <Label htmlFor="weatherAlerts">
                          Receive weather alerts
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="preferredContact">
                      Preferred Contact Method
                    </Label>
                    <Select
                      value={formData.preferredContact}
                      onValueChange={(value) =>
                        handleInputChange('preferredContact', value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="voice">Voice Call</SelectItem>
                        <SelectItem value="both">Both SMS & Voice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) =>
                          handleInputChange('agreeTerms', checked)
                        }
                      />
                      <Label
                        htmlFor="agreeTerms"
                        className="text-sm leading-relaxed"
                      >
                        I agree to the{' '}
                        <a href="#" className="text-primary hover:underline">
                          Terms of Service
                        </a>{' '}
                        and understand that Nandi will provide financial
                        guidance based on the information I provide.
                      </Label>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeDataUsage"
                        checked={formData.agreeDataUsage}
                        onCheckedChange={(checked) =>
                          handleInputChange('agreeDataUsage', checked)
                        }
                      />
                      <Label
                        htmlFor="agreeDataUsage"
                        className="text-sm leading-relaxed"
                      >
                        I consent to the collection and use of my data for
                        providing personalized agricultural and financial
                        services as described in the{' '}
                        <a href="#" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                        .
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>

                {currentStep < 4 ? (
                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!isStepValid()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Complete Registration
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="mt-6 border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Our support team is available to assist you with registration
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 mr-2" />
                    Call: 1800-NANDI
                  </Button>
                  <Button variant="outline" size="sm">
                    WhatsApp Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
