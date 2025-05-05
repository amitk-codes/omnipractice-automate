import dotenv from 'dotenv';

// Loading environment variables
dotenv.config();

// Omnipractice credentials
export const EMAIL = process.env.OMNIPRACTICE_EMAIL || '';
export const PASSWORD = process.env.OMNIPRACTICE_PASSWORD || '';