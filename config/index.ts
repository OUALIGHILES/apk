// Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// API configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  IMAGE_BASE_URL: process.env.NEXT_PUBLIC_IMAGE_BASE_URL,
  TIMEOUT: 30000,
};

// App configuration
export const APP_CONFIG = {
  NAME: 'Kafek',
  VERSION: '1.0.0',
  SUPPORTED_LANGUAGES: ['en', 'ar', 'ur'],
  DEFAULT_LANGUAGE: 'en',
  CURRENCY: 'SAR',
};
