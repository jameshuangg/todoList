(function() {
	angular.module("myTodoList")
	.config([
		'$stateProvider',
		'$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {
			$stateProvider
				.state('home', {
					url: '/home',
					templateUrl: '/pages/home.ejs',
					controller: 'mainCtrl',
					controllerAs: 'main',
					resolve: {
						todoLoad: ['todos', function(todos) {
							return todos.getAll();
						}]
					}
				})
				.state('onboarding', {
					url: '/onboarding',
					templateUrl: '/pages/onboarding.ejs',
					controller: 'AuthCtrl',
					controllerAs: 'auth',
					onEnter: ['$state', 'auth', function($state, auth) {
						if(auth.isLoggedIn()) {
							$state.go('home');
						}
					}]
				});

			$urlRouterProvider.otherwise('onboarding');
		}
	]);
})();

