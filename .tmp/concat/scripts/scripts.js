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
    'ngTouch',
    'hc.marked',
    'LocalStorageModule',
    'ui.bootstrap'
  ])
  .config(["$routeProvider", function ($routeProvider) {
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
  }]);

'use strict';

/**
 * @ngdoc function
 * @name dragonApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dragonApp
 */
angular.module('dragonApp')
	.controller('MainCtrl', ["$scope", function ($scope) {
		$scope.tab='home';		
	}]);

'use strict';

/**
 * @ngdoc function
 * @name dragonApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the dragonApp
 */
angular.module('dragonApp')
  .controller('SpellsCtrl', ["$scope", "$http", "$sce", "localStorageService", function ($scope,$http,$sce,localStorageService) {
  		$scope.tab="spells";

		$scope.levelFilters = localStorageService.get('levelfilters') 
			|| [true,true,true,true,true,true,true,true,true,true];
		
		$scope.spells = localStorageService.get('spells') 
			|| [];
		$scope.casterFilters = localStorageService.get('casterFilters') 
			|| {"All":true,"Bard":true,"Cleric":true,"Druid":true,"Paladin":true,"Ranger":true,"Sorcerer":true,"Warlock":true,"Wizard":true};


		//allow assignment of icons to spells to filter by
		$scope.spellIcons = localStorageService.get('spellIcons') 
			|| {};		
		$scope.iconFilters = localStorageService.get('iconFilters')
			|| { 'star':false,'ok':false};

		$scope.nameQuery = '';

		$scope.toggleShowIconFilter = function(icon) {
			$scope.iconFilters[icon] = !$scope.iconFilters[icon];
			localStorageService.set('iconFilters', $scope.iconFilters);
		}
		$scope.toggleIconFilter = function(spell, icon){
			$scope.spellIcons[spell.name] = $scope.spellIcons[spell.name]  || {};
			$scope.spellIcons[spell.name][icon] = !$scope.spellIcons[spell.name][icon];
			localStorageService.set('spellIcons',$scope.spellIcons);
		};

		//pull the spell data in to local storage
		$scope.loadSpells = function() {
			$http.get('data/spells.json').success(function(data) {
				//process each spells data before assigning it
				for (var i=0;i<data.length;i++) {
					data[i].collapsed = true;
					data[i].order = data[i].level + '_' + data[i].name;
				}
				$scope.spells = data;
				localStorageService.set('spells',data);
			});
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
				

				if (skip)
					continue;

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

}]);
'use strict';

/**
 * @ngdoc function
 * @name dragonApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dragonApp
 */
angular.module('dragonApp')
	.controller('MonstersCtrl', ["$scope", "$http", "$sce", "localStorageService", function ($scope,$http,$sce,localStorageService) {
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

		
	

	}]);
