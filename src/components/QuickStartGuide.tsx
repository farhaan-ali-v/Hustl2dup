import React, { useState, useEffect } from 'react';
import { ArrowRight, Package, Star, DollarSign, Shield, X, Coffee, Book, Dog, Car, GraduationCap, Users, Printer, ChevronLeft, ChevronRight, Zap, Award, Trophy } from 'lucide-react';

interface QuickStartGuideProps {
  onClose: () => void;
  onCreateTask?: () => void;
  onBrowseTasks?: () => void;
}

const CATEGORIES = [
  {
    name: 'Food Delivery',
    icon: <Coffee className="w-4 h-4 mr-2" />,
    template: 'meal-delivery'
  },
  {
    name: 'Academic Help',
    icon: <Book className="w-4 h-4 mr-2" />,
    template: 'study-materials'
  },
  {
    name: 'Pet Care',
    icon: <Dog className="w-4 h-4 mr-2" />,
    template: 'dog-walking'
  },
  {
    name: 'Coffee Runs',
    icon: <Coffee className="w-4 h-4 mr-2" />,
    template: 'coffee-run'
  },
  {
    name: 'Meal Swipes',
    icon: <Users className="w-4 h-4 mr-2" />,
    template: 'meal-exchange'
  },
  {
    name: 'Study Groups',
    icon: <GraduationCap className="w-4 h-4 mr-2" />,
    template: 'study-group'
  },
  {
    name: 'Quick Rides',
    icon: <Car className="w-4 h-4 mr-2" />,
    template: 'campus-rides'
  },
  {
    name: 'Print & Pickup',
    icon: <Printer className="w-4 h-4 mr-2" />,
    template: 'print-pickup'
  }
];

const QuickStartGuide: React.FC<QuickStartGuideProps> = ({
  onClose,
  onCreateTask,
  onBrowseTasks
}) => {
  const [hasShown, setHasShown] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  useEffect(() => {
    // Check if the guide has been shown before
    const guideShown = localStorage.getItem('quickStartGuideShown');
    if (guideShown) {
      setHasShown(true);
    }
  }, []);
  
  const handleCategoryClick = (template: string) => {
    markGuideAsShown();
    onClose();
    onCreateTask?.();
  };

  const handleGetStarted = () => {
    markGuideAsShown();
    onClose();
  };
  
  const markGuideAsShown = () => {
    localStorage.setItem('quickStartGuideShown', 'true');
    setHasShown(true);
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-3xl p-6 mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="text-center flex-1">
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0038FF] to-[#0021A5] rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#0F2557]">Welcome to Hustl</h2>
            <p className="text-gray-600 mt-1">
              Your campus task marketplace - get help or earn money helping others
            </p>
          </div>
          <button 
            onClick={() => {
              markGuideAsShown();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close guide"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#0038FF] to-[#0021A5] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-center">What would you like to do?</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <button
                  onClick={() => {
                    markGuideAsShown();
                    onCreateTask?.();
                  }}
                  className="bg-gradient-to-r from-[#FF5A1F] to-[#E63A0B] text-white p-5 rounded-2xl hover:opacity-90 transition-colors group shadow-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Package className="w-7 h-7" />
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                  <h3 className="text-lg font-semibold text-left mb-2">Post a Task</h3>
                  <p className="text-left text-orange-100 text-sm">
                    Need help with something? Create a task and find someone to help you.
                  </p>
                </button>

                <button
                  onClick={() => {
                    markGuideAsShown();
                    onBrowseTasks?.();
                  }}
                  className="bg-gradient-to-r from-[#0038FF] to-[#0021A5] text-white p-5 rounded-2xl hover:opacity-90 transition-colors group shadow-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <DollarSign className="w-7 h-7" />
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                  <h3 className="text-lg font-semibold text-left mb-2">Browse Tasks</h3>
                  <p className="text-left text-blue-100 text-sm">
                    Want to earn money? Find tasks you can help with around campus.
                  </p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-center flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#FF5A1F] mr-2" />
                Popular Task Categories
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryClick(category.template)}
                    className="bg-white px-3 py-3 rounded-xl text-sm hover:bg-gradient-to-r hover:from-[#0038FF] hover:to-[#0021A5] hover:text-white transition-all duration-300 flex items-center justify-center group shadow-sm border border-gray-200"
                  >
                    <span className="group-hover:text-white text-[#0F2557]">
                      {category.icon}
                    </span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-center flex items-center justify-center">
                <Award className="w-6 h-6 text-[#FF5A1F] mr-2" />
                Key Features
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="premium-card p-4 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0038FF] to-[#0021A5] rounded-full flex items-center justify-center mb-4 text-white shadow-md mx-auto">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-1 text-sm text-center">Safe & Secure</h3>
                  <p className="text-gray-600 text-sm text-center">
                    Verified UF students only with built-in safety features.
                  </p>
                </div>

                <div className="premium-card p-4 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0038FF] to-[#0021A5] rounded-full flex items-center justify-center mb-4 text-white shadow-md mx-auto">
                    <Star className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-1 text-sm text-center">Earn Points</h3>
                  <p className="text-gray-600 text-sm text-center">
                    Complete tasks to earn points and unlock rewards.
                  </p>
                </div>

                <div className="premium-card p-4 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0038FF] to-[#0021A5] rounded-full flex items-center justify-center mb-4 text-white shadow-md mx-auto">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-1 text-sm text-center">Flexible Earnings</h3>
                  <p className="text-gray-600 text-sm text-center">
                    Set your schedule and earn between classes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          {currentStep > 1 ? (
            <button
              onClick={prevStep}
              className="text-[#0F2557] hover:text-[#0A1B3D] font-medium flex items-center"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
          ) : (
            <button
              onClick={() => {
                markGuideAsShown();
                onClose();
              }}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Skip Guide
            </button>
          )}

          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              className="bg-[#0038FF] text-white px-5 py-2 rounded-xl hover:bg-[#0021A5] transition-colors flex items-center text-sm shadow-md font-semibold"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-[#FF5A1F] to-[#E63A0B] text-white px-5 py-2 rounded-xl hover:opacity-90 transition-colors flex items-center text-sm shadow-md font-semibold"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickStartGuide;