
// Evita que se cambien datos sin haber iniciado sesión.
function requireAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      message: 'Inicia sesión en /auth/google para cambiar los datos'
    });
  }

  next();
}

module.exports = requireAuth;
