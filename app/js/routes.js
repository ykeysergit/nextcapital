todoApp.ROUTES={
login: "/login",
signup: "/signup",
todos: "/todos"
};

todoApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when(todoApp.ROUTES.login, {
        templateUrl: 'partials/login.html',
        controller: 'RegistrationController'
      }).
       when(todoApp.ROUTES.signup, {
        templateUrl: 'partials/signup.html',
        controller: 'RegistrationController'
      }).
       when(todoApp.ROUTES.todos, {
        templateUrl: 'partials/todos.html',
        controller: 'RegistrationController'
      }).
      otherwise({
        templateUrl: 'partials/login.html',
        controller: 'RegistrationController'
      });
  }]);