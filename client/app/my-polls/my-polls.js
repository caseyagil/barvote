'use strict';

 angular.module('barVote')
   .config(function($routeProvider) {
     $routeProvider
       .when('/my-polls', {
         templateUrl: 'app/my-polls/my-polls.html',
         controller: 'MyPollsCtrl'
       });
   })
   .controller('MyPollsCtrl', function($scope, $http, Auth) {

     $scope.getCurrentUser = Auth.getCurrentUser;

     $http.get('/api/polls').success(function(polls) {

       $scope.polls = [];

       polls.forEach(function(poll) {
         if (poll.creator === $scope.getCurrentUser().name) {
           $scope.polls.push(poll);
         }
       });
     });

     $scope.radioData = {
       index: 0
     };

     $scope.currentPoll = {};

     $scope.deletePoll = function(index, id) {

       $http.delete('/api/polls/'  id).success(function(poll) {
         $scope.polls.splice(index, 1);
       });
     };

     $scope.submitForm = function() {
       $scope.poll.answers[$scope.radioData.index].votes = 1;
       $scope.poll.save();
     };
   });
View
