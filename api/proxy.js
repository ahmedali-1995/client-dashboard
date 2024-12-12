// api/proxy.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbxc1J_oVKZD07d34Qr9tiV-fppbTIeKqkcR46SZWZmSIR5oDLJpeOEtzpoektZr8ASpiw/exec';
  
  // Extract query parameters/body from req if needed
  const { query } = req;
  const params = new URLSearchParams(query).toString();
  const targetUrl = `${appsScriptUrl}?${params}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // If it's a preflight request (OPTIONS), just return
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error(error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ success: false, error: 'Proxy Error' });
  }
}
