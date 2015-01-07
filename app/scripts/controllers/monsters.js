'use strict';

/**
 * @ngdoc function
 * @name dragonApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dragonApp
 */
angular.module('dragonApp')
	.controller('MonstersCtrl', function ($scope,$http,$sce,localStorageService,$resource ) { //,$location,$anchorScroll
		$scope.tab='monsters';
		$scope.apikey = localStorageService.get('x-api-key');

		var Monster = $resource('http://localhost:3000/=/monsters/:id',{ id: '@_id' }, {
	    	update: {
	      		method: 'PUT', // this method issues a PUT request
	      		headers: { 'x-api-key' : $scope.apikey }
	      	},
	      	delete: {
  				method: 'DELETE', // this method issues a DELETE request
	      		headers: { 'x-api-key' : $scope.apikey }
	      	},
	      	save: {
	      		method: 'POST', // this method issues a POST request
	      		headers: { 'x-api-key' : $scope.apikey }
	      	}
    	});
		
		Monster.query({},function(data){
			
			for (var i=0;i<data.length;i++) {
				data[i].challengeVal = getChallengeValue(data[i].challenge);
				data[i].collapsed = true;
				//console.log(data[i].name);
			}
			$scope.monsters = data;
		});

  
		$scope.crFilters = localStorageService.get('crFilters')  || {'0':true, '1/8':true,'1/4':true,'1/2':true,'1':true,'2':true,'3':true,'4':true,'5':true};
		$scope.crFiltersDisplay = ['0','1/8','1/4','1/2','1','2','3','4','5'];

		function getChallengeValue(challenge){
			return (challenge || '').replace(/\s*\(.*$/,'');
		}


		$scope.monsterIcons = localStorageService.get('monsterIcons') || {};		
		$scope.monsterIconFilters = localStorageService.get('monsterIconFilters') || { 'tower':false,'leaf':false,'tint':false,'fire':false};

		$scope.toggleShowIconFilter = function(icon) {
			$scope.monsterIconFilters[icon] = !$scope.monsterIconFilters[icon];
			localStorageService.set('monsterIconFilters', $scope.monsterIconFilters);
		};

		$scope.toggleIconFilter = function(monster, icon){
			$scope.monsterIcons[monster.name] = $scope.monsterIcons[monster.name]  || {};
			$scope.monsterIcons[monster.name][icon] = !$scope.monsterIcons[monster.name][icon];
			localStorageService.set('monsterIcons',$scope.monsterIcons);
		};


		$scope.setCRFilter = function(i){
			$scope.crFilters[i] = !$scope.crFilters[i];
			localStorageService.set('crFilters',$scope.crFilters);
		};

		$scope.toMod = function(input){
			var val = Math.floor((input - 10) / 2);
			return (val > 0 ? '+' : '') + val;
		};

		$scope.showMonster = function(monster){
			if (!monster.challengeVal || monster.challengeVal.length === 0){
				return true;
			}

			if (!$scope.crFilters[monster.challengeVal]) {
				return false;
			}

			for (var icon in $scope.monsterIconFilters){

				if (!$scope.monsterIconFilters[icon]){
					continue;
				}
				var micon = $scope.monsterIcons[monster.name]; 
				if (!micon || !micon[icon]) {
					return false;
				}
			}

			return true;
		};

		$scope.deleteMonster = function(monster){
			var index = $scope.monsters.indexOf(monster);
			if (index > -1) {
			    $scope.monsters.splice(index, 1);
			}
			monster.$delete();
		};

		$scope.updateMonster = function(monster){
			monster.challengeVal = getChallengeValue(monster.challenge);
			monster.$update(); 
			monster.editing = !monster.editing;
		};
		
		$scope.createMonster = function(name){
			var m = new Monster();
			m.name = name;
			
			m.$save(function(response){
				m.editing = true;
				m.collapsed = false;
				m._id = response._id;


				//todo - make sure the push/sort isn't causing a bunch of unecessary operations
				$scope.monsters.push(m);
				$scope.monsters = $scope.monsters.sort(function(a,b){
					return ( ( a.name === b.name ) ? 0 : ( ( a.name > b.name ) ? 1 : -1 ) );
				});

				//scroll to the new item
				//doesn't work - don't think the item is in place yet
				//$location.hash(m._id);
				//$anchorScroll();
			});

		};


	});
