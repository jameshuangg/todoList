(function() {
	angular.module("myTodoList").factory("auth", [
		'$http',
		'$window', 
		function($http, $window) {
			var auth = {};

			auth.saveToken = function(token) {
				$window.localStorage['todoList-token'] = token;
			};
			
			auth.getToken = function() {
				return $window.localStorage['todoList-token'];
			};
			
			auth.isLoggedIn = function() {
				var token = auth.getToken();
				
				// if the token exists, we have to check if it is expired
				if(token) {
					var payload = JSON.parse($window.atob(token.split('.')[1]));
					
					return payload.exp > Date.now() / 1000;
				} else {
					return false;
				}
			};
			
			auth.currentUser = function() {
				if(auth.isLoggedIn()) {
					var token = auth.getToken();
					var payload = JSON.parse($window.atob(token.split('.')[1]));
					
					return payload.username;
				};
			};
			
			auth.register = function(user) {
				return $http.post('/register', user).success(function(data) {
					auth.saveToken(data.token);
				});
			};
			
			auth.login = function(user) {
				return $http.post('/login', user).success(function(data) {
					auth.saveToken(data.token);
				});
			};
			
			auth.logout = function() {
				$window.localStorage.removeItem('todoList-token');
			};
			
			return auth;
		}
	])
})();