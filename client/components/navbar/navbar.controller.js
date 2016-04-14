'use strict';

 angular.module('barVote')
   .controller('NavbarCtrl', function($scope, $location, Auth) {
     $scope.menu = [{
       'title': 'Home',
       'link': '/',
       'requiresLogin': false
     }, {
       'title': 'Create a New Poll',
       'link': 'create-poll',
       'requiresLogin': true
     }, {
       'title': 'My Polls',
       'link': 'my-polls',
       'requiresLogin': true
     }];

     $scope.isCollapsed = true;
     $scope.isLoggedIn = Auth.isLoggedIn;
     $scope.isAdmin = Auth.isAdmin;
     $scope.getCurrentUser = Auth.getCurrentUser;

     $scope.logout = function() {
       Auth.logout();
       $location.path('/login');
     };

     $scope.isActive = function(route) {
       return route === $location.path();
     };
   });
