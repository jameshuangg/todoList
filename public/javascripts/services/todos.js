(function() {
	angular.module("myTodoList").factory("todos", [
		'$http', 
		'auth',
		function($http, auth) {
		
		var object = {
			todos: []
		};
		
		object.getAll = function() {
			return $http.get('/todos').success(function(data) {
				angular.copy(data, object.todos);
			});
		};

		object.create = function(todo) {
			return $http.post('/todos', todo, {
				headers: {Authorization: 'Bearer ' + auth.getToken()}
			}).success(function(data) {
				// Attach the newly created post to the client side.
				object.todos.push(data);
			})
		};
		
		object.remove = function(todo) {
			return $http.delete('/todos/' + todo._id, {
				headers: {Authorization: 'Bearer ' + auth.getToken()}
			}).success(function() {
				console.log("Todo was removed");
			});
		};
		
		return object;
	}]);
})();
