import * as admin from 'firebase-admin';
admin.initializeApp();

// Import and export your new ElevenLabs function
export { generateSpeech } from './elevenlabsApi';

// You might have other functions here as well
// export { myOtherFunction } from './myOtherFunctionFile';