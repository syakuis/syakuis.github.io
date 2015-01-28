var generatorControllers = angular.module('GeneratorControllers',[ ]);

generatorControllers.controller('Generator', ['$scope',
	function($scope) {

		$scope.fields = [];

		$scope.field_name = null;

		$scope.fnCopy = function(target) {
			return jQuery(target).html();
		}

		$scope.fnCreate = function() {
			if ($scope.field_name != null) {

				var field_name = $scope.field_name.replace(/\s/g,'');
				
				$scope.fields = [];

				var div = field_name.split(',');
				var count = div.length;

				if (count > 1) {
					for(var i = 0; i < count; i++) {
						
						if (i == 0) {
							$scope.fnAddId(div[i]);
						} else {
							$scope.fnAdd(div[i]);							
						}
					}
				} else {
					$scope.fnAddId(field_name);
				}
			}
		}
		

		$scope.fnAddId = function(name) {
			$scope.name = name;
			$scope.type = 'int';
		};

		$scope.fnAdd = function(name) {
			$scope.fields.push({
				'type' : 'String',
				'name' : name
			});
		};

		$scope.fnDel = function(index) {
			$scope.fields.splice(index, 1);
		};
	}
]);
