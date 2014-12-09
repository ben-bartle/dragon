'use strict';

/**
 * @ngdoc function
 * @name dragonApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dragonApp
 */
angular.module('dragonApp')
	.controller('MonstersCtrl', function ($scope,$http,$sce,localStorageService) {
  		$scope.tab="monsters";
		$scope.monsters = localStorageService.get('monsters') 
			|| [];
		
		$scope.crFilters = localStorageService.get('crFilters') 
			|| {"0":true,"1/8":true,"1/4":true,"1/2":true,"1":true,"2":true,"3":true,"4":true,"5":true};

		$scope.setCRFilter = function(cr){
			$scope.crFilters[cr] = !$scope.crFilters[cr];
			localStorageService.set('crFilters',$scope.crFilters) 
		}

		function toMod(input){
			var val = Math.floor((input - 10) / 2);
			return (val > 0 ? '+' : '') + val;
		}

		$scope.loadMonsters = function(){
			$http.get('/data/monsters.json').success(function(data) {
				for (var i=0;i<data.length;i++) {
					data[i].strMod = toMod(data[i].str);
					data[i].dexMod = toMod(data[i].dex);
					data[i].conMod = toMod(data[i].con);
					data[i].intMod = toMod(data[i].int);
					data[i].wisMod = toMod(data[i].wis);
					data[i].chaMod = toMod(data[i].cha);
					data[i].collapsed = true;
				}
				$scope.monsters = data;
				localStorageService.set('monsters',data);
			});
		}

		
	

	});
