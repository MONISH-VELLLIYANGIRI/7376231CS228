const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;
const EXTERNAL_API = 'http://4.224.186.213/evaluation-service';

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Proxy: Auth API
app.post('/api/auth', async (req, res) => {
  try {
    console.log('[PROXY] POST /api/auth');
    const response = await axios.post(`${EXTERNAL_API}/auth`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('[PROXY] Auth error:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data
    });
  }
});

// Proxy: Notifications API
app.get('/api/notifications', async (req, res) => {
  try {
    console.log('[PROXY] GET /api/notifications', req.query);
    const response = await axios.get(`${EXTERNAL_API}/notifications`, {
      params: req.query,
      headers: req.headers.authorization ? {
        'Authorization': req.headers.authorization
      } : {}
    });
    res.json(response.data);
  } catch (error) {
    console.error('[PROXY] Notifications error:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data
    });
  }
});

// Proxy: Logging API
app.post('/api/log', async (req, res) => {
  try {
    console.log('[PROXY] POST /api/log');
    const response = await axios.post(`${EXTERNAL_API}/logs`, req.body, {
      headers: req.headers.authorization ? {
        'Authorization': req.headers.authorization
      } : {}
    });
    res.json(response.data);
  } catch (error) {
    console.error('[PROXY] Log error:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Proxy server running on port 5000' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend proxy running on http://localhost:${PORT}`);
  console.log(`📡 Forwarding to: ${EXTERNAL_API}`);
});
