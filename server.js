// server.js
import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import googleRouter from './api/proxy.js';
import cookieParser from 'cookie-parser';

// ES modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Replace with your Hostinger domain (ensure HTTPS)
const HOSTINGER_DOMAIN = 'https://jaridatakhbarak.com'; // e.g., https://www.example.com

// CORS Configuration
app.use(cors({
  origin: HOSTINGER_DOMAIN,
  credentials: true, // Allow cookies to be sent
}));

// Parse JSON bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Import and use the Google API route
app.use('/api/google', googleRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
