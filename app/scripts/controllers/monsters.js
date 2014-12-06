'use strict';

/**
 * @ngdoc function
 * @name dragonApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dragonApp
 */
angular.module('dragonApp')
	.controller('MonstersCtrl', function ($scope,$http,$sce) {
		function toMod(input){
			var val = Math.floor((input - 10) / 2);
			return (val > 0 ? '+' : '') + val;
		}

		$http.get('/data/monsters.json').success(function(data) {
				for (var i=0;i<data.length;i++) {
					data[i].features = marked.parse(data[i].features);
					data[i].actions = marked.parse(data[i].actions);
					data[i].strMod = toMod(data[i].str);
					data[i].dexMod = toMod(data[i].dex);
					data[i].conMod = toMod(data[i].con);
					data[i].intMod = toMod(data[i].int);
					data[i].wisMod = toMod(data[i].wis);
					data[i].chaMod = toMod(data[i].cha);
					data[i].collapsed = true;
				}
			
			$scope.monsters = data;
		});

		$scope.trustAsHtml = function(input) {
			return $sce.trustAsHtml(input);
		};

	});
