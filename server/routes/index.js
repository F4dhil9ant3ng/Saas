import express from 'express';
import passport from 'passport';
import {login, register} from '../controllers/auth';

const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false});


const routes = (router) => {
  router.route('/login')
    .post(requireLogin, login);
  router.route('/register')
    .post(register);

    router.get('/*', function(req, res, next) {
      res.send('Welcome to the index page');
    });
};

export default routes;
