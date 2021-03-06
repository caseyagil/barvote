'use strict';

 var mongoose = require('mongoose');
 var passport = require('passport');
 var config = require('../config/environment');
 var jwt = require('jsonwebtoken');
 var expressJwt = require('express-jwt');
 var compose = require('composable-middleware');
 var User = require('../api/user/user.model');
 var validateJwt = expressJwt({
   secret: config.secrets.session
 });

 function isAuthenticated() {
   return compose()
     .use(function(req, res, next) {
       if (req.query && req.query.hasOwnProperty('access_token')) {
         req.headers.authorization = 'Bearer '  req.query.access_token;
       }
       validateJwt(req, res, next);
     })
     .use(function(req, res, next) {
       User.findById(req.user._id, function(err, user) {
         if (err) return next(err);
         if (!user) return res.status(401).send('Unauthorized');

         req.user = user;
         next();
       });
     });
 }

 function hasRole(roleRequired) {
   if (!roleRequired) throw new Error('Required role needs to be set');

   return compose()
     .use(isAuthenticated())
     .use(function meetsRequirements(req, res, next) {
       if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
         next();
       } else {
         res.status(403).send('Forbidden');
       }
     });
 }

 function signToken(id) {
   return jwt.sign({
     _id: id
   }, config.secrets.session, {
     expiresInMinutes: 60 * 5
   });
 }

 function setTokenCookie(req, res) {
   if (!req.user) return res.status(404).json({
     message: 'Something went wrong, please try again.'
   });
   var token = signToken(req.user._id, req.user.role);
   res.cookie('token', JSON.stringify(token));
   res.redirect('/');
 }

 exports.isAuthenticated = isAuthenticated;
 exports.hasRole = hasRole;
 exports.signToken = signToken;
 exports.setTokenCookie = setTokenCookie;
