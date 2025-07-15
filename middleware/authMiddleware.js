const jwt = require('jsonwebtoken');
const SECRET = 'sua_chave_secreta';

function autenticar(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ erro: 'Token ausente' });

  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido' });
  }
}
