interface ElevenLabsError {
  detail?: {
    status?: string;
    message?: string;
  };
}

// Audio manager interface for the singleton pattern
interface AudioManager {
  isPlaying: boolean;
  currentAudio: HTMLAudioElement | null;
  playAudio(audioUrl: string): Promise<void>;
  stopAudio(): void;
}

class ElevenLabsService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || 'sk_88e1a9775eeae067054f39bdff4ccd9f578464b3391d532b';
  }

  private isServiceAvailable(): boolean {
    return !!this.apiKey;
  }

  private handleApiError(error: any): never {
    console.error('ElevenLabs API Error:', error);
    
    // Check if it's the specific "unusual activity" error
    if (error.detail?.status === 'detected_unusual_activity') {
      throw new Error('Voice features are temporarily unavailable. This may be due to ElevenLabs Free Tier restrictions. Please try again later or consider upgrading your ElevenLabs plan.');
    }
    
    // Handle other common errors
    if (error.status === 401) {
      throw new Error('Voice features are unavailable due to authentication issues.');
    }
    
    if (error.status === 429) {
      throw new Error('Voice features are temporarily unavailable due to rate limiting. Please try again later.');
    }
    
    // Generic error
    throw new Error('Voice features are currently unavailable. Please try again later.');
  }

  async speakText(
    text: string, 
    voiceId: string = 'EXAVITQu4vr4xnSDxMaL', 
    audioManager?: AudioManager
  ): Promise<void> {
    if (!this.isServiceAvailable()) {
      console.warn('ElevenLabs API key not configured. Voice features disabled.');
      return; // Silently fail if no API key
    }

    try {
      // Use Firebase Function instead of direct API call
      const functionUrl = `${import.meta.env.VITE_FIREBASE_FUNCTIONS_URL}/generateSpeech`;
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voiceId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        this.handleApiError(errorData);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // If an audio manager is provided, use it to play the audio
      if (audioManager) {
        return audioManager.playAudio(audioUrl);
      }
      
      // Otherwise, use the default audio playback
      const audio = new Audio(audioUrl);
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          reject(new Error('Failed to play audio'));
        };
        audio.play().catch(reject);
      });
    } catch (error: any) {
      // If it's already our custom error, re-throw it
      if (error.message.includes('Voice features are')) {
        throw error;
      }
      
      // Handle network errors and other issues
      console.error('Error in speakText:', error);
      throw new Error('Voice features are currently unavailable due to a network error.');
    }
  }

  async getVoices(): Promise<any[]> {
    if (!this.isServiceAvailable()) {
      console.warn('ElevenLabs API key not configured. Returning empty voices list.');
      return [];
    }

    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        this.handleApiError(errorData);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error: any) {
      console.error('Error fetching voices:', error);
      return []; // Return empty array on error
    }
  }
}

export const elevenLabsService = new ElevenLabsService();