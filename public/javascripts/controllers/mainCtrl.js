(function() {
	angular.module("myTodoList").controller("mainCtrl", [
	'todos',
	'auth',
	function(todos, auth) {
		this.todos = todos.todos;
		this.isLoggedIn = auth.isLoggedIn;
		
		this.currentUser = auth.currentUser;
		this.logout = auth.logout;
		
		this.addTodo = function() {
			if(!this.inputedDescription) {
				console.log('Please enter a description for your todo.');
				return;
			}
			todos.create({
				description: this.inputedDescription,
				dueDate: this.inputedDueDate,
				completed: this.inputedStatus
			});
			
			this.inputedDescription = '';
		};

		this.deleteTodo = function(todo) {
			// Remove todo from frontend
			this.todos.splice(this.todos.indexOf(todo), 1);
			// Remove todo from backend
			todos.remove(todo);
		};
		
	
	}]);
	
})();
