
module.exports = function(req, res, next) {
  const key = req.headers['x-api-key'] || req.query.api_key;
  if (!key || key !== process.env.API_KEY) {
    return res.status(403).json({ error: 'Chave de API inválida ou ausente.' });
  }
  next();
};
