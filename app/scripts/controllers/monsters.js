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
			|| {"0":true, "1/8":true,"1/4":true,"1/2":true,"1":true,"2":true,"3":true,"4":true,"5":true};
		$scope.crFiltersDisplay = ["0","1/8","1/4","1/2","1","2","3","4","5"];

		
		$scope.monsterIcons = localStorageService.get('monsterIcons') 
			|| {};		
		$scope.monsterIconFilters = localStorageService.get('monsterIconFilters')
			|| { 'tower':false,'leaf':false,'tint':false,'fire':false};
		$scope.toggleShowIconFilter = function(icon) {
			$scope.monsterIconFilters[icon] = !$scope.monsterIconFilters[icon];
			localStorageService.set('monsterIconFilters', $scope.monsterIconFilters);
		}
		$scope.toggleIconFilter = function(monster, icon){
			$scope.monsterIcons[monster.name] = $scope.monsterIcons[monster.name]  || {};
			$scope.monsterIcons[monster.name][icon] = !$scope.monsterIcons[monster.name][icon];
			localStorageService.set('monsterIcons',$scope.monsterIcons);
		};


		$scope.setCRFilter = function(i){
			$scope.crFilters[i] = !$scope.crFilters[i];
			localStorageService.set('crFilters',$scope.crFilters) 
		}

		function toMod(input){
			var val = Math.floor((input - 10) / 2);
			return (val > 0 ? '+' : '') + val;
		}

		$scope.showMonster = function(monster){
			if (!$scope.crFilters[monster.challengeVal]) {
				return false;
			}

			var micons = $scope.monsterIcons[monster.name];
			for (var icon in micons){
				if ($scope.monsterIconFilters[icon] && !micons[icon]) {
					return false;
				}
			}
				

			

			return true;
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
					data[i].challengeVal = data[i].challenge.replace(/\s\(.*$/,'');
					data[i].collapsed = true;
				}
				$scope.monsters = data;
				localStorageService.set('monsters',data);
			});
		}

		
	

	});
