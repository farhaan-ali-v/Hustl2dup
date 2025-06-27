import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, X } from 'lucide-react';
import { elevenLabsService } from '../lib/elevenLabsService';

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreate?: (taskData: any) => void;
}

export default function VoiceAssistant({ isOpen, onClose, onTaskCreate }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setTranscript(finalTranscript);
            processVoiceCommand(finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event) => {
          setError(`Speech recognition error: ${event.error}`);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    } else {
      setError('Speech recognition is not supported in this browser.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, response]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setError(null);
      setTranscript('');
      setResponse('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const processVoiceCommand = async (command: string) => {
    setIsProcessing(true);
    
    try {
      // Simple command processing
      const lowerCommand = command.toLowerCase();
      let responseText = '';

      if (lowerCommand.includes('create task') || lowerCommand.includes('new task')) {
        responseText = "I'll help you create a new task. What type of task would you like to create?";
      } else if (lowerCommand.includes('food') || lowerCommand.includes('delivery')) {
        responseText = "Great! I can help you order food. Which restaurant would you like to order from?";
      } else if (lowerCommand.includes('help') || lowerCommand.includes('support')) {
        responseText = "I'm here to help! You can ask me to create tasks, check your wallet, or get support.";
      } else if (lowerCommand.includes('wallet') || lowerCommand.includes('balance')) {
        responseText = "Let me check your wallet balance for you.";
      } else {
        responseText = "I understand you said: " + command + ". How can I help you with that?";
      }

      setResponse(responseText);
      
      // Speak the response if audio is enabled
      if (isAudioEnabled) {
        await speakResponse(responseText);
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      setError('Failed to process voice command');
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = async (text: string) => {
    if (!isAudioEnabled || isSpeaking) return;
    
    setIsSpeaking(true);
    setVoiceError(null);
    
    try {
      await elevenLabsService.speakText(text);
    } catch (error: any) {
      console.warn('Voice synthesis failed:', error.message);
      setVoiceError(error.message);
      // Don't show error to user, just disable audio silently
      setIsAudioEnabled(false);
    } finally {
      setIsSpeaking(false);
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    setVoiceError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6" />
              <h2 className="text-lg font-bold">Voice Assistant</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleAudio}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                title={isAudioEnabled ? "Disable audio" : "Enable audio"}
              >
                {isAudioEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 h-64 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
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

          {transcript && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>You said:</strong> {transcript}
              </p>
            </div>
          )}

          {response && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Assistant:</strong> {response}
              </p>
            </div>
          )}

          {isProcessing && (
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">Processing your request...</p>
            </div>
          )}

          {isSpeaking && (
            <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-purple-600">Speaking response...</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Controls */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-center">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`p-4 rounded-full transition-all duration-200 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isListening ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            {isListening ? 'Listening... Tap to stop' : 'Tap to start speaking'}
          </p>
        </div>
      </div>
    </div>
  );
}