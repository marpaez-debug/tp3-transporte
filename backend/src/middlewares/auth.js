import passport from '../config/passport.js';

export const requireAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: 'Token inválido, expirado o ausente' });
    }
    req.user = user;
    next();
  })(req, res, next);
};