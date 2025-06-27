import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Mic, X, Settings, Loader, Zap } from 'lucide-react';
import { elevenLabsService } from '../lib/elevenLabsService';
import { toast } from 'react-hot-toast';
import { StarBorder } from './ui/star-border';

interface VoiceAssistantProps {
  onClose: () => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [availableVoices, setAvailableVoices] = useState<any[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('21m00Tcm4TlvDq8ikWAM'); // Default to Rachel
  const [volume, setVolume] = useState(0.8);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [characterCount, setCharacterCount] = useState<any>(null);
  const recognitionRef = useRef<any>(null);
  const conversationHistory = useRef<{role: string, content: string}[]>([
    { role: "system", content: "You are Hustl Assistant, a helpful voice AI for the Hustl campus task platform. Keep responses concise and friendly. You help users with creating tasks, finding tasks to complete, and navigating the platform. Your tone is upbeat and encouraging." }
  ]);

  useEffect(() => {
    loadVoices();
    loadCharacterCount();
    
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setTranscript(transcript);
      };
      
      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        }
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const loadVoices = async () => {
    try {
      const voices = await elevenLabsService.getVoices();
      setAvailableVoices(voices);
    } catch (error) {
      console.error('Error loading voices:', error);
    }
  };

  const loadCharacterCount = async () => {
    try {
      const count = await elevenLabsService.getCharacterCount();
      setCharacterCount(count);
    } catch (error) {
      console.error('Error loading character count:', error);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }
    
    setIsListening(true);
    recognitionRef.current.start();
    toast.success('Listening...');
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    
    setIsListening(false);
    recognitionRef.current.stop();
    
    if (transcript.trim()) {
      processTranscript(transcript);
    }
  };

  const processTranscript = async (text: string) => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Add user message to conversation history
      conversationHistory.current.push({ role: "user", content: text });
      
      // Generate a response based on the transcript
      const assistantResponse = await generateResponse(text);
      setResponse(assistantResponse);
      
      // Add assistant response to conversation history
      conversationHistory.current.push({ role: "assistant", content: assistantResponse });
      
      // Speak the response
      setIsSpeaking(true);
      await elevenLabsService.speakText(assistantResponse, {
        voiceId: selectedVoice,
        volume: volume
      });
      setIsSpeaking(false);
    } catch (error) {
      console.error('Error processing transcript:', error);
      toast.error('Error processing your request');
    } finally {
      setIsLoading(false);
      setTranscript('');
    }
  };

  const generateResponse = async (text: string): Promise<string> => {
    // Simple response generation based on keywords
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('hello') || lowerText.includes('hi')) {
      return "Hello! I'm your Hustl assistant. How can I help you today?";
    }
    
    if (lowerText.includes('create') && (lowerText.includes('task') || lowerText.includes('job'))) {
      return "To create a task, click the 'Post Task' button in the top right corner. You can specify what you need help with, set a budget, and choose a location on campus.";
    }
    
    if (lowerText.includes('find') && (lowerText.includes('task') || lowerText.includes('job'))) {
      return "To find tasks, click on 'Browse Tasks' in the navigation menu. You can filter by category, price, and location to find tasks that interest you.";
    }
    
    if (lowerText.includes('payment') || lowerText.includes('money') || lowerText.includes('wallet')) {
      return "Payments on Hustl are secure and easy. You can add funds to your wallet using credit cards or mobile payment apps. Your earnings from completed tasks will be added to your wallet balance.";
    }
    
    if (lowerText.includes('safety') || lowerText.includes('secure')) {
      return "Safety is our priority. All users are verified UF students, and we have built-in safety features like real-time location tracking and emergency contacts. You can access the Safety Center from the menu.";
    }
    
    if (lowerText.includes('help') || lowerText.includes('support')) {
      return "For help, you can check our FAQ section, contact our support team via email, or use this voice assistant. We're here to make your Hustl experience smooth and enjoyable.";
    }
    
    // Default response
    return "I'm here to help you with Hustl! You can ask me about creating tasks, finding tasks to complete, payments, safety features, or anything else about the platform.";
  };

  const speakText = async (text: string) => {
    if (!text.trim()) return;
    
    setIsSpeaking(true);
    await elevenLabsService.speakText(text, {
      voiceId: selectedVoice,
      volume: volume
    });
    setIsSpeaking(false);
  };

  const getVoiceName = (voiceId: string) => {
    const voice = availableVoices.find(v => v.voice_id === voiceId);
    return voice ? voice.name : 'Default Voice';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-[#002B7F] to-[#0038FF] text-white">
          <h2 className="text-xl font-bold flex items-center">
            <Zap className="w-6 h-6 mr-2" />
            Hustl Voice Assistant
          </h2>
          <div className="flex items-center">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-white hover:bg-white/10 rounded-full transition-colors mr-2"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {showSettings ? (
          <div className="p-6">
            <h3 className="font-semibold mb-4">Voice Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voice
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#0038FF] focus:border-[#0038FF]"
                >
                  {availableVoices.length > 0 ? (
                    availableVoices.map(voice => (
                      <option key={voice.voice_id} value={voice.voice_id}>
                        {voice.name}
                      </option>
                    ))
                  ) : (
                    <option value="21m00Tcm4TlvDq8ikWAM">Rachel (Female)</option>
                  )}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Volume: {Math.round(volume * 100)}%
                </label>
                <div className="flex items-center">
                  <VolumeX className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <Volume2 className="w-5 h-5 text-gray-400 ml-2" />
                </div>
              </div>
              
              {characterCount && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm text-blue-800 mb-1">Character Usage</h4>
                  <div className="flex justify-between text-sm">
                    <span>Used: {characterCount.character_count}</span>
                    <span>Limit: {characterCount.character_limit}</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(characterCount.character_count / characterCount.character_limit) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="pt-2">
                <button
                  onClick={() => {
                    speakText("This is a test of the selected voice and volume settings.");
                  }}
                  className="w-full bg-[#0038FF] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#0021A5] transition-colors flex items-center justify-center"
                >
                  <Volume2 className="w-5 h-5 mr-2" />
                  Test Voice
                </button>
              </div>
              
              <div className="pt-2">
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Back to Assistant
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-4 mb-4 min-h-[200px] max-h-[300px] overflow-y-auto">
              {response ? (
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0">
                      <Zap className="w-4 h-4 text-[#0038FF]" />
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm flex-1">
                      <p className="text-gray-800">{response}</p>
                    </div>
                  </div>
                  
                  {transcript && (
                    <div className="flex items-start justify-end">
                      <div className="bg-[#0038FF] p-3 rounded-lg shadow-sm text-white flex-1 max-w-[80%]">
                        <p>{transcript}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#0038FF] flex items-center justify-center ml-2 flex-shrink-0">
                        <Mic className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Zap className="w-8 h-8 text-[#0038FF]" />
                  </div>
                  <p className="text-gray-600 mb-2">How can I help you today?</p>
                  <p className="text-sm text-gray-500">Click the microphone button to start speaking</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-500">
                {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready'}
              </div>
              <div className="text-sm text-gray-500">
                Voice: {getVoiceName(selectedVoice)}
              </div>
            </div>
            
            <div className="flex justify-center">
              <StarBorder color={isListening ? "#FF5A1F" : "#0038FF"}>
                <button
                  onClick={toggleListening}
                  disabled={isSpeaking || isLoading}
                  className={`p-4 rounded-full ${
                    isListening 
                      ? 'bg-gradient-to-r from-[#FF5A1F] to-[#E63A0B]' 
                      : 'bg-gradient-to-r from-[#0038FF] to-[#0021A5]'
                  } text-white flex items-center justify-center w-16 h-16 shadow-lg`}
                >
                  {isLoading ? (
                    <Loader className="w-6 h-6 animate-spin" />
                  ) : isListening ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Mic className="w-6 h-6" />
                  )}
                </button>
              </StarBorder>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                {isListening 
                  ? "I'm listening... Click to stop" 
                  : isSpeaking 
                    ? "I'm speaking..."
                    : "Click the microphone and ask me anything"}
              </p>
            </div>
            
            <div className="mt-4">
              <div className="text-xs text-gray-500 text-center">
                Try asking:
              </div>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                <button 
                  onClick={() => processTranscript("How do I create a task?")}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full transition-colors"
                >
                  How do I create a task?
                </button>
                <button 
                  onClick={() => processTranscript("Tell me about payment options")}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full transition-colors"
                >
                  Tell me about payment options
                </button>
                <button 
                  onClick={() => processTranscript("How does safety work?")}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full transition-colors"
                >
                  How does safety work?
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;