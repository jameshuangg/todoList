(function() {
	angular.module("myTodoList").controller("AuthCtrl", [
	'$state',
	'auth',
	function($state, auth) {
		this.registerUser = {};
		this.loginUser = {};
		
		this.register = function() {
			auth.register(this.registerUser).error(function(err) {
				this.error = err;
			}).then(function() {
				// Redirect to homepage
				$state.go('home');
			});
		}
		
		this.login = function() {
			auth.login(this.loginUser).error(function(err) {
				this.error = err;
			}).then(function() {
				$state.go('home');
			});
		}
		
	}]);
})();