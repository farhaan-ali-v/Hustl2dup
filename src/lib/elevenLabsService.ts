import { toast } from 'react-hot-toast';

// The URL for your deployed Firebase Cloud Function
// This will be set in your .env file and accessed via import.meta.env
const FIREBASE_FUNCTIONS_URL = import.meta.env.VITE_FIREBASE_FUNCTIONS_URL;

interface SpeakOptions {
  voiceId?: string;
  volume?: number; // 0.0 to 1.0
}

export const elevenLabsService = {
  /**
   * Converts text to speech using the ElevenLabs API via a Firebase Cloud Function.
   * Plays the generated audio.
   * @param text The text to convert to speech.
   * @param options Optional parameters like voiceId and volume.
   * @returns A Promise that resolves with the HTMLAudioElement if successful, or null if an error occurs.
   */
  async speakText(text: string, options?: SpeakOptions): Promise<HTMLAudioElement | null> {
    if (!FIREBASE_FUNCTIONS_URL || FIREBASE_FUNCTIONS_URL === 'YOUR_DEPLOYED_FUNCTION_URL_HERE') {
      console.warn('ElevenLabs function URL is not configured. Speech functionality disabled.');
      toast.error('Speech functionality is not configured yet. Please follow the setup instructions in README-ELEVENLABS-SETUP.md');
      return null;
    }

    try {
      // Assuming your function is named 'generateSpeech' and is accessible at /generateSpeech
      const response = await fetch(`${FIREBASE_FUNCTIONS_URL}/generateSpeech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voiceId: options?.voiceId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        toast.error(`Failed to generate speech: ${errorText}`);
        console.error('Speech generation failed:', errorText);
        return null;
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
      toast.error('Error connecting to speech service.');
      console.error('Error in speakText:', error);
      return null;
    }
  },

  // You can add other methods here, e.g., for getting available voices
  // This would also go through a Firebase Function to hide the API key
  async getVoices(): Promise<any[]> {
    console.warn("getVoices not implemented. It should also go through a backend function to keep API key secure.");
    return [];
  }
};