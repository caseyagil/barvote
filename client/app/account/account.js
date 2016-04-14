'use strict';

 angular.module('barVote')
   .config(function($routeProvider) {
     $routeProvider
       .when('/login', {
         templateUrl: 'app/account/login.html',
         controller: 'LoginCtrl'
       })
       .when('/signup', {
         templateUrl: 'app/account/signup.html',
         controller: 'SignupCtrl'
       })
       .when('/settings', {
         templateUrl: 'app/account/settings.html',
         controller: 'SettingsCtrl',
         authenticate: true
       });
   })
   .controller('LoginCtrl', function($scope, Auth, $location) {
     $scope.user = {};
     $scope.errors = {};

     $scope.login = function(form) {
       $scope.submitted = true;

       if (form.$valid) {
         Auth.login({
             email: $scope.user.email,
             password: $scope.user.password
           })
           .then(function() {
             $location.path('/');
           })
           .catch(function(err) {
             $scope.errors.other = err.message;
           });
       }
     };
   })
   .controller('SignupCtrl', function($scope, Auth, $location) {
     $scope.user = {};
     $scope.errors = {};

     $scope.register = function(form) {
       $scope.submitted = true;

       if (form.$valid) {
         Auth.createUser({
             name: $scope.user.name,
             email: $scope.user.email,
             password: $scope.user.password
           })
           .then(function() {
             $location.path('/');
           })
           .catch(function(err) {
             err = err.data;
             $scope.errors = {};

             angular.forEach(err.errors, function(error, field) {
               form[field].$setValidity('mongoose', false);
               $scope.errors[field] = error.message;
             });
           });
       }
     };
   })
   .controller('SettingsCtrl', function($scope, User, Auth) {
     $scope.errors = {};

     $scope.changePassword = function(form) {
       $scope.submitted = true;
       if (form.$valid) {
         Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword)
           .then(function() {
             $scope.message = 'Password successfully changed.';
           })
           .catch(function() {
             form.password.$setValidity('mongoose', false);
             $scope.errors.other = 'Incorrect password';
             $scope.message = '';
           });
       }
     };
   });
