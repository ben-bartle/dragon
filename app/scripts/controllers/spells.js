'use strict';

/**
 * @ngdoc function
 * @name dragonApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the dragonApp
 */
angular.module('dragonApp')
  .controller('SpellsCtrl', function ($scope,$http,$sce,$filter) {
		$scope.levelFilters = [true,true,true,true,true,true,true,true,true,true];
		$scope.casterFilters = {};
		$scope.nameQuery = '';
		$scope.descriptionQuery = '';
		$scope.onlyPrepared = false;
		
		$http.get('data/spells.json').success(function(data) {
				//process each spells data before assigning it
				for (var i=0;i<data.length;i++) {
					//parse the description from markdown to 
					data[i].description = marked.parse(data[i].description);
					data[i].collapsed = true;
					data[i].order = data[i].level + '_' + data[i].name;
					data[i].prepared = false;
					for (var c in data[i].casters)
						$scope.casterFilters[data[i].casters[c]] = true;
				}
				$scope.spells = data;
		});

	

		$scope.casterFilters.All = true;
		$scope.setCasterFilter = function(input){

			for (var c in $scope.casterFilters){
				$scope.casterFilters[c] = (c === input) || input === 'All';
			}
			
		}

		$scope.getSpellsByCaster = function() {
			var result = [];
			for (var i in $scope.spells){
				var spell = $scope.spells[i];
				if ($scope.onlyPrepared && !spell.prepared)
					continue;

				if ($scope.levelFilters[spell.level]) {
					for (var c in spell.casters) {
						if ($scope.casterFilters[ spell.casters[c]] ) {
							result.push(spell);
							break;
						}
					}
				}
			}
      		return result;
		};

		$scope.levelCssClass = function(level){
			switch(level){
				case 0:
					return 'warning';
				case 1:
					return 'success';
				case 2:
					return 'info';
				case 3:
				case 4:
				case 5:
				case 6:
				case 7:
				case 8:
				case 9:
					return 'danger';		
			}
			return 'default';
		};

		$scope.trustAsHtml = function(input) {
			return $sce.trustAsHtml(input);
		};

}).filter('checkmark', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
});