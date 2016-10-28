// var express = require('express');
// var router = express.Router();

/* GET home page. */
const routes = (router) => {
  router.get('/', function(req, res, next) {
    res.send('Welcome to the index page');
  });
}

export default routes;
