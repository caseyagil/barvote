'use strict';

 angular.module('barVote')
   .config(function($routeProvider) {
     $routeProvider
       .when('/view/:_id', {
         templateUrl: 'app/view/view.html',
         controller: 'ViewCtrl'
       });
   })
   .controller('ViewCtrl', function($scope, $routeParams, $http, Auth) {

     $http.get('/api/polls/'  $routeParams._id).success(function(poll) {
       $scope.poll = poll;
       $scope.alreadyVoted = false;
       $scope.radioData = {
         index: null
       };

       var colors = ['#F6511D', '#FFB400', '#00A6ED', '#7FB800', '#0D2C54', '#444444', 'green', 'yellow'];

       var data = [];

       var render = function() {
         data = [];

         poll.answers.forEach(function(answer, index) {
           var objToAppend = {};
           objToAppend.label = answer.value;
           objToAppend.value = answer.votes;
           objToAppend.color = colors[index % colors.length];
           data.push(objToAppend);
           $('#myChart').replaceWith('<canvas id="myChart" width="200" height="200"></canvas>');
           var ctx = document.getElementById('myChart').getContext('2d');
           var myNewChart = new Chart(ctx).Pie(data);
         });
       };

       render();

       $scope.isLoggedIn = Auth.isLoggedIn;

       $scope.isCreator = function() {
         return Auth.getCurrentUser().name === poll.creator;
       };

       $scope.submitForm = function() {
         $scope.alreadyVoted = true;
         $scope.poll.answers[$scope.radioData.index].votes = 1;
         $http.put('/api/polls/'  $routeParams._id, {
           answers: $scope.poll.answers
         }).success(function() {
           render();
         });
       };

       $scope.addOptionField = function() {
         $scope.poll.answers.push({
           value: '',
           votes: 0
         });
       };

       $scope.itemsToAdd = [{
         value: '',
         votes: 1
       }];

       $scope.add = function(itemToAdd) {
         /*var index = $scope.itemsToAdd.indexOf(itemToAdd);
 				$scope.itemsToAdd.splice(index, 1);
 				*/
         $scope.poll.answers.push(angular.copy(itemToAdd));
         $http.put('/api/polls/'  $routeParams._id, {
           answers: $scope.poll.answers
         }).success(function() {
           render();
         });
         $scope.itemsToAdd = [{
           value: '',
           votes: 1
         }];
       };
     });
   });
