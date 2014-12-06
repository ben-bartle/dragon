'use strict';

/**
 * @ngdoc overview
 * @name dragonApp
 * @description
 * # dragonApp
 *
 * Main module of the application.
 */
angular
  .module('dragonApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/spells', {
        templateUrl: 'views/spells.html',
        controller: 'SpellsCtrl'
      })
      .when('/monsters', {
        templateUrl: 'views/monsters.html',
        controller: 'MonstersCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
