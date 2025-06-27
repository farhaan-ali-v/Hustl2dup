import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import * as corsModule from 'cors'; // Import cors module

const cors = corsModule({ origin: true }); // Configure CORS to allow all origins for simplicity during development

export const generateSpeech = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      // Handle preflight requests for CORS
      if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        return res.status(204).send('');
      }
      return res.status(405).send('Method Not Allowed');
    }

    const { text, voiceId = '21m00TNDk4baxx87XrD3' } = req.body; // Default voice ID for ElevenLabs

    if (!text) {
      return res.status(400).send('Text is required.');
    }

    // Access the ElevenLabs API key from Firebase Functions environment configuration
    const elevenLabsApiKey = functions.config().elevenlabs?.api_key;

    if (!elevenLabsApiKey) {
      console.error('ElevenLabs API key not configured. Please set it using firebase functions:config:set elevenlabs.api_key="YOUR_KEY"');
      return res.status(500).send('ElevenLabs API key not configured.');
    }

    try {
      const elevenLabsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey,
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1', // You can change this model if needed
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      });

      if (!elevenLabsResponse.ok) {
        const errorText = await elevenLabsResponse.text();
        console.error(`ElevenLabs API error: ${elevenLabsResponse.status} - ${errorText}`);
        return res.status(elevenLabsResponse.status).send(`ElevenLabs API error: ${errorText}`);
      }

      // Set response headers for audio streaming
      res.set('Content-Type', 'audio/mpeg');
      res.set('Cache-Control', 'public, max-age=3600'); // Cache audio for 1 hour

      // Pipe the audio stream directly to the response
      // Note: While Cloud Functions typically buffer responses, for audio/video,
      // piping directly is often the most straightforward way to handle binary data.
      // For very large files, consider Cloud Storage signed URLs.
      elevenLabsResponse.body.pipe(res);

    } catch (error) {
      console.error('Error generating speech:', error);
      return res.status(500).send('Internal server error during speech generation.');
    }
  });
});