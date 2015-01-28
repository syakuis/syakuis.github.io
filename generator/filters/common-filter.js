app.filter('frist_uppercase', function() {
	return function(inputValue) {
		if (inputValue === undefined) { inputValue = ''; }

		if (inputValue.indexOf('_') > -1) {
			var div = inputValue.split('_');
			var capitalized = div[0].charAt(0).toUpperCase() + div[0].substring(1) + div[1].charAt(0).toUpperCase() + div[1].substring(1);
			return capitalized;
		} else {
			var capitalized = inputValue.charAt(0).toUpperCase() + inputValue.substring(1);
			return capitalized;
		}
	};
});