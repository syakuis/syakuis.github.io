app.filter('frist_uppercase', function() {
	return function(inputValue) {
		if (inputValue === undefined) { inputValue = ''; }
		var capitalized = inputValue.charAt(0).toUpperCase() + inputValue.substring(1);
		return capitalized;
	};
});