const express = require('express');
const blogRoute = require('./blog.route');
const suggessPlace = require('./place-suggess.route');
const interestedRoute = require('./interested.route');
const favoriteRoute = require('./favorite.route');
const conversationRoute = require('./conversation.route');
const testRoute = require('./test.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/test',
    route: testRoute,
  },
  {
    path: '/blog',
    route: blogRoute,
  },
  {
    path: '/suggess-place',
    route: suggessPlace,
  },
  {
    path: '/interested',
    route: interestedRoute,
  },
  {
    path: '/favorite',
    route: favoriteRoute,
  },
  {
    path: '/conversation',
    route: conversationRoute,
  },
  {
    path: '/docs',
    route: docsRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
