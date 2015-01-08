'use strict';

/**
 * @ngdoc function
 * @name dragonApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the dragonApp
 */
angular.module('dragonApp')
  .controller('SpellsCtrl', function ($scope,$http,$sce,localStorageService,$resource) {
  		$scope.tab='spells';

		$scope.apikey = localStorageService.get('x-api-key');

		var Spell = $resource('http://localhost:3000/=/spells/:id',{ id: '@_id' }, {
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
		
		Spell.query({},function(data){
			for (var i=0;i<data.length;i++) {
				data[i].collapsed = true;
				data[i].order = data[i].level + '_' + data[i].name;
			}
			$scope.spells = data;
		});


		$scope.levelFilters = localStorageService.get('levelfilters') || [true,true,true,false,false,false,false,false,false,false];
		
		
		$scope.casterFilters = localStorageService.get('casterFilters') || {'Bard':true,'Cleric':false,'Druid':false,'Paladin':false,'Ranger':false,'Sorcerer':false,'Warlock':false,'Wizard':false};

		//allow assignment of icons to spells to filter by
		$scope.spellIcons = localStorageService.get('spellIcons') || {};		
		$scope.iconFilters = localStorageService.get('iconFilters')	|| { 'tower':false,'leaf':false,'tint':false,'fire':false};

		$scope.nameQuery = '';

		$scope.toggleShowIconFilter = function(icon) {
			$scope.iconFilters[icon] = !$scope.iconFilters[icon];
			localStorageService.set('iconFilters', $scope.iconFilters);
		};

		$scope.toggleIconFilter = function(spell, icon){
			$scope.spellIcons[spell.name] = $scope.spellIcons[spell.name]  || {};
			$scope.spellIcons[spell.name][icon] = !$scope.spellIcons[spell.name][icon];
			localStorageService.set('spellIcons',$scope.spellIcons);
		};


		$scope.toggleLevelFilter = function(i) {
			$scope.levelFilters[i] = !$scope.levelFilters[i];
			localStorageService.set('levelfilters',$scope.levelFilters);
		};

		$scope.setCasterFilter = function(input){

			for (var c in $scope.casterFilters){
				$scope.casterFilters[c] = (c === input) || input === 'All';
			}
			localStorageService.set('casterFilters',$scope.casterFilters);
		};

		$scope.updateSpell = function (spell) {
			spell.editing = !spell.editing;
			spell.order = spell.level + '_' + spell.name;
			spell.$update(); 
		};

		$scope.getSpells = function() {
			var result = [];
			for (var i in $scope.spells){
				var spell = $scope.spells[i];
				
				var skip = false;
				for (var icon in $scope.iconFilters){
					//if the filter isn't set, ignore this filter
					if (!$scope.iconFilters[icon]){
						continue;
					}
					
					//if the filter is set, but the spell doesn't have it, skip the spell (and we are done checking)
					if (!$scope.spellIcons[spell.name] || !$scope.spellIcons[spell.name][icon]) {
						skip = true;
						break;
					}
				}
				

				if (skip) {
					continue;
				}

				//add if it matches a level and caster filter
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

});