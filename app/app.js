'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngTable',
  'myApp.favorites',
  'myApp.replies',
  'myApp.retweets',
  'myApp.tags',
  'myApp.timeline',
  'myApp.topics',
  'myApp.tweets',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/tweets'});
}]);
