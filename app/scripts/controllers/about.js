'use strict';

/**
 * @ngdoc function
 * @name dragonApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the dragonApp
 */
angular.module('dragonApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
