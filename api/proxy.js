// api/proxy.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'https://jaridatakhbarak.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbxc1J_oVKZD07d34Qr9tiV-fppbTIeKqkcR46SZWZmSIR5oDLJpeOEtzpoektZr8ASpiw/exec';

  try {
    const { query } = req;
    const params = new URLSearchParams(query).toString();
    const targetUrl = params ? `${appsScriptUrl}?${params}` : appsScriptUrl;

    let response;
    if (req.method === 'GET') {
      response = await fetch(targetUrl, { 
        method: 'GET',
        headers: {
          'Origin': 'https://client-dashboard-nine.vercel.app'
        }
      });
    } else if (req.method === 'POST') {
      response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Origin': 'https://client-dashboard-nine.vercel.app'
        },
        body: JSON.stringify(req.body)
      });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const text = await response.text();
    
    try {
      const data = JSON.parse(text);
      return res.status(response.status).json(data);
    } catch (err) {
      console.error('Failed to parse JSON:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'Invalid JSON response',
        rawResponse: text
      });
    }
  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Proxy Error',
      message: error.message 
    });
  }
}
