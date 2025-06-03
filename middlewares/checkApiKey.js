// checkApiKey.js
module.exports = function (req, res, next) {
  const clientKey = req.headers['x-api-key'];

  if (!clientKey) {
    return res.status(401).json({ error: 'API Key no proporcionada' });
  }

  if (clientKey !== 'GIR2025') {
    return res.status(403).json({ error: 'API Key inválida' });
  }

  // Si todo está bien, continúa con la ruta
  next();
};
