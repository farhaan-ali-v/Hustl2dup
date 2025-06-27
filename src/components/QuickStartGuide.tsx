import React, { useState, useEffect } from 'react';
import { X, Play, Volume2, VolumeX, ChevronRight, ChevronLeft, Lightbulb, MapPin, MessageCircle, Wallet, Shield, Star } from 'lucide-react';
import { elevenLabsService } from '../lib/elevenLabsService';

interface QuickStartGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    title: "Welcome to TaskMate!",
    content: "Your campus task companion is here to help you get things done efficiently and safely.",
    icon: <Star className="w-8 h-8 text-yellow-500" />,
    audio: "Welcome to TaskMate! Your campus task companion is here to help you get things done efficiently and safely."
  },
  {
    title: "Create Your First Task",
    content: "Tap the plus button to create a task. Whether it's food delivery, study help, or errands - we've got you covered!",
    icon: <Lightbulb className="w-8 h-8 text-blue-500" />,
    audio: "Create your first task by tapping the plus button. Whether it's food delivery, study help, or errands, we've got you covered!"
  },
  {
    title: "Track Everything Live",
    content: "Watch your tasks in real-time on our interactive campus map. Stay informed every step of the way.",
    icon: <MapPin className="w-8 h-8 text-green-500" />,
    audio: "Track everything live on our interactive campus map. Stay informed every step of the way."
  },
  {
    title: "Chat & Communicate",
    content: "Built-in messaging keeps you connected with task helpers. Share updates, photos, and coordinate seamlessly.",
    icon: <MessageCircle className="w-8 h-8 text-purple-500" />,
    audio: "Built-in messaging keeps you connected with task helpers. Share updates, photos, and coordinate seamlessly."
  },
  {
    title: "Secure Payments",
    content: "Your wallet is protected with secure payment processing. Add funds, track spending, and tip helpers easily.",
    icon: <Wallet className="w-8 h-8 text-emerald-500" />,
    audio: "Your wallet is protected with secure payment processing. Add funds, track spending, and tip helpers easily."
  },
  {
    title: "Safety First",
    content: "Emergency features, real-time tracking, and verified users ensure your safety is our top priority.",
    icon: <Shield className="w-8 h-8 text-red-500" />,
    audio: "Emergency features, real-time tracking, and verified users ensure your safety is our top priority."
  }
];

export default function QuickStartGuide({ isOpen, onClose }: QuickStartGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const playWelcomeMessage = async () => {
    if (!isAudioEnabled || isPlaying) return;
    
    setIsPlaying(true);
    setVoiceError(null);
    
    try {
      await elevenLabsService.speakText(steps[currentStep].audio);
    } catch (error: any) {
      console.warn('Voice playback failed:', error.message);
      setVoiceError(error.message);
      // Don't show error to user, just disable audio silently
      setIsAudioEnabled(false);
    } finally {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (isOpen && currentStep === 0 && isAudioEnabled) {
      // Small delay to ensure modal is fully rendered
      const timer = setTimeout(() => {
        playWelcomeMessage();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentStep, isAudioEnabled]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    setVoiceError(null);
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Quick Start Guide</h2>
            <button
              onClick={toggleAudio}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title={isAudioEnabled ? "Disable audio" : "Enable audio"}
            >
              {isAudioEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <p className="text-sm mt-2 opacity-90">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              {currentStepData.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {currentStepData.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {currentStepData.content}
            </p>
          </div>

          {/* Audio controls */}
          {isAudioEnabled && (
            <div className="flex justify-center mb-6">
              <button
                onClick={playWelcomeMessage}
                disabled={isPlaying}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                <Play className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                {isPlaying ? 'Playing...' : 'Play Audio'}
              </button>
            </div>
          )}

          {/* Voice error message (only shown in development) */}
          {voiceError && process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Voice Note:</strong> {voiceError}
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
              >
                Get Started!
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 pb-6">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}