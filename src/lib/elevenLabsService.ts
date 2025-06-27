import { toast } from 'react-hot-toast';

// ElevenLabs API key
const ELEVENLABS_API_KEY = 'sk_8f7afe9792da4eaa3aa03d77343c3b58d44d35a0e6f42541';

interface SpeakOptions {
  voiceId?: string;
  volume?: number; // 0.0 to 1.0
  model?: string;
  stability?: number; // 0.0 to 1.0
  similarityBoost?: number; // 0.0 to 1.0
}

export const elevenLabsService = {
  /**
   * Converts text to speech using the ElevenLabs API.
   * Plays the generated audio.
   * @param text The text to convert to speech.
   * @param options Optional parameters like voiceId and volume.
   * @returns A Promise that resolves with the HTMLAudioElement if successful, or null if an error occurs.
   */
  async speakText(text: string, options?: SpeakOptions): Promise<HTMLAudioElement | null> {
    if (!text.trim()) {
      console.warn('Empty text provided to speakText');
      return null;
    }

    try {
      // Default voice ID - Rachel (female voice)
      const voiceId = options?.voiceId || '21m00Tcm4TlvDq8ikWAM';
      
      // Make direct request to ElevenLabs API
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: text,
          model_id: options?.model || 'eleven_monolingual_v1',
          voice_settings: {
            stability: options?.stability || 0.5,
            similarity_boost: options?.similarityBoost || 0.75
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Speech generation failed:', errorText);
        throw new Error(errorText);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      if (options?.volume !== undefined) {
        audio.volume = Math.max(0, Math.min(1, options.volume)); // Ensure volume is between 0 and 1
      }

      audio.play().catch(e => console.error("Error playing audio:", e));

      // Clean up the object URL after the audio has finished playing
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };

      return audio;

    } catch (error) {
      console.error('Error in speakText:', error);
      toast.error('Error generating speech. Please try again later.');
      return null;
    }
  },

  /**
   * Gets available voices from ElevenLabs API
   * @returns A Promise that resolves with the list of voices
   */
  async getVoices(): Promise<any[]> {
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        method: 'GET',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get voices: ${response.statusText}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error getting voices:', error);
      return [];
    }
  },

  /**
   * Gets the remaining character count for the API key
   * @returns A Promise that resolves with the character count info
   */
  async getCharacterCount(): Promise<any> {
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
        method: 'GET',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get character count: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting character count:', error);
      return null;
    }
  },

  /**
   * Transcribes speech to text using the Web Speech API
   * @param callback Function to call with the transcribed text
   * @returns A function to stop listening
   */
  startSpeechRecognition(callback: (text: string) => void): () => void {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in your browser');
      return () => {};
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      
      callback(transcript);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      toast.error(`Speech recognition error: ${event.error}`);
    };
    
    recognition.start();
    
    return () => {
      recognition.stop();
    };
  }
};