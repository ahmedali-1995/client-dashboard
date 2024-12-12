// pages/api/proxy.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbxc1J_oVKZD07d34Qr9tiV-fppbTIeKqkcR46SZWZmSIR5oDLJpeOEtzpoektZr8ASpiw/exec'; 
  // Replace YOUR_SCRIPT_ID with your actual deployed Apps Script ID

  // Handle query parameters for GET requests
  const { query } = req;
  const params = new URLSearchParams(query).toString();
  const targetUrl = params ? `${appsScriptUrl}?${params}` : appsScriptUrl;

  if (req.method === 'OPTIONS') {
    // Handle preflight requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  try {
    let response;
    if (req.method === 'GET') {
      response = await fetch(targetUrl, { method: 'GET' });
    } else if (req.method === 'POST') {
      // Forward POST body to Apps Script
      const body = JSON.stringify(req.body);
      response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
      });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const data = await response.json();

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(response.status).json(data);
  } catch (error) {
    console.error(error);
    // Set CORS headers on error response as well
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(500).json({ success: false, error: 'Proxy Error' });
  }
}
