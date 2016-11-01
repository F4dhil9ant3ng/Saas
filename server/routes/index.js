import express from 'express';
import passport from 'passport';
import { login, register } from '../controllers/auth';

const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false})


const routes = (app) => {
  const authRoutes = express.Router();
  const apiRoutes = express.Router();

  apiRoutes.use('/auth', authRoutes);
  authRoutes.post('/login', requireLogin, login);
  authRoutes.post('/register', register)

  app.use('/api', apiRoutes);
  // app.get('*', (req, res) => {
  //   res.send('This is great man. Loving this work guys')
  // })
}

export default routes;
