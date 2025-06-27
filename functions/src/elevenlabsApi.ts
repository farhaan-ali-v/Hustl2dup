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

    const { text, voiceId = 'EXAVITQu4vr4xnSDxMaL' } = req.body; // Updated default voice ID

    if (!text) {
      return res.status(400).send('Text is required.');
    }

    // Use the provided API key directly
    const elevenLabsApiKey = 'sk_88e1a9775eeae067054f39bdff4ccd9f578464b3391d532b';

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
      elevenLabsResponse.body.pipe(res);

    } catch (error) {
      console.error('Error generating speech:', error);
      return res.status(500).send('Internal server error during speech generation.');
    }
  });
});