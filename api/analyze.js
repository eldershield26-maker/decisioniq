export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body || {};

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid prompt' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  console.log('API KEY PRESENT:', !!apiKey);

  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY not found on server' });
  }

  try {
    let response;

try {
  response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000
    })
  });
} catch (err) {
  console.error('Fetch failed:', err);
  return res.status(500).json({
    error: 'Failed to call Groq API',
    details: err.message
  });
}

    let data;

try {
  data = await response.json();
} catch (err) {
  const raw = await response.text();
  console.error('Invalid JSON from Groq:', raw);
  return res.status(500).json({
    error: 'Invalid JSON response from Groq',
    raw
  });
}

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || 'Groq API error'
      });
    }

    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      return res.status(500).json({ error: 'Invalid response from Groq' });
    }

    return res.status(200).json({
      content: [{ type: 'text', text }]
    });

  } catch (error) {
    console.error('Function crash:', error);
    return res.status(500).json({
      error: 'Server crashed',
      details: error.message
    });
  }
}