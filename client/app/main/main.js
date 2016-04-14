'use strict';

 angular.module('barVote')
   .config(function($routeProvider) {
     $routeProvider
       .when('/', {
         templateUrl: 'app/main/main.html',
         controller: 'MainCtrl'
       });
   })
   .controller('MainCtrl', function($scope, $http, Auth) {
     $scope.polls = [];

     $scope.isAdmin = Auth.isAdmin;

     $http.get('/api/polls').success(function(polls) {
       $scope.polls = polls;
     });

     $scope.deletePoll = function(index, id) {

       $http.delete('/api/polls/'  id).success(function(poll) {
         $scope.polls.splice(index, 1);
       });
     };
   });
