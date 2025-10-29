export default function verifyApiKey(req, res, next) {
  const key = req.headers['x-api-key'] || req.query.api_key;
  
  if (!key || key !== process.env.API_KEY) {
    return res.status(403).json({ 
      error: 'Chave de API inválida ou ausente.',
      message: 'Use o header: x-api-key: petjoyful_api_key_2025'
    });
  }
  
  next();
}