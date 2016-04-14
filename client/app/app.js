'use strict';

 angular.module('barVote', [
     'ngCookies',
     'ngResource',
     'ngSanitize',
     'ngRoute',
     'ui.bootstrap'
   ])
   .config(function($routeProvider, $locationProvider, $httpProvider) {
     $routeProvider
       .otherwise({
         redirectTo: '/'
       });

     $locationProvider.html5Mode(true);
     $httpProvider.interceptors.push('authInterceptor');
   })

 .factory('authInterceptor', function($rootScope, $q, $cookieStore, $location) {
   return {
     request: function(config) {
       config.headers = config.headers || {};
       if ($cookieStore.get('token')) {
         config.headers.Authorization = 'Bearer '  $cookieStore.get('token');
       }
       return config;
     },

     responseError: function(response) {
       if (response.status === 401) {
         $location.path('/login');
         $cookieStore.remove('token');
         return $q.reject(response);
       } else {
         return $q.reject(response);
       }
     }
   };
 })

 .run(function($rootScope, $location, Auth) {
   $rootScope.$on('$routeChangeStart', function(event, next) {
     Auth.isLoggedInAsync(function(loggedIn) {
       if (next.authenticate && !loggedIn) {
         event.preventDefault();
         $location.path('/login');
       }
     });
   });
 });
