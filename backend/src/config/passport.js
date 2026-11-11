import 'dotenv/config';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { pool } from './db.js';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const [rows] = await pool.query(
        'SELECT id, nombre, email FROM usuarios WHERE id = ?',
        [payload.id]
      );
      if (rows.length === 0) return done(null, false);
      return done(null, rows[0]);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;