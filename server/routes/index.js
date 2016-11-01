import express from 'express';
import passport from 'passport';
import {login, register} from '../controllers/auth';

const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false});


module.exports = (router) => {
  // const authRoutes = express.Router();
  // const apiRoutes = express.Router();
  // app.use('/api', apiRoutes);  

  // router.route('/auth', authRoutes);
  router.route('/login')
    .post(requireLogin, login);
  router.route('/register')
    .post(register);

    router.get('/*', function(req, res, next) {
      res.send('Welcome to the index page');
    });
};

// export default routes;
