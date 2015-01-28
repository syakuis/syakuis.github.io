var generatorControllers = angular.module('GeneratorControllers',[ ]);

generatorControllers.controller('Create', ['$scope',
	function($scope) {

		$scope.fields = [];


		$scope.fnAdd = function() {
			$scope.fields.push({
				'type' : '',
				'name' : ''
			});
		};

		$scope.fnDel = function(index) {
			$scope.fields.splice(index, 1);
		};
	}
]);
