'use strict';

/***
 * @ngdoc function
 * @name dragonApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dragonApp
 */
angular.module('dragonApp')
	.controller('MainCtrl', function ($scope,localStorageService) {
		$scope.tab='home';	
		$scope.hideReset = localStorageService.length === 0;
		$scope.reset = function(){
			localStorageService.clearAll();
			$scope.resetOk = false;
			$scope.hideReset = true;
		};	
		$scope.setApiKey = function(){
			localStorageService.set('x-api-key',$scope.apikey);
		};
	});
