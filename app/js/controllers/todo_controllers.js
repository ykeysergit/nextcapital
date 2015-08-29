todoControllers = angular.module('todoControllers', ['ngCookies']);

todoControllers.controller('RegistrationController', ['$scope', '$window', '$cookies', function ($scope, $window, $cookies) {
		  var LOGIN_COOKIE_NAME='login';

		  $scope.isRemembered=function(){
		  	var foundCookie = $cookies.get(LOGIN_COOKIE_NAME);
		  	return !jQuery.isBlank(foundCookie);
		  };

		  $scope.rememberMeFlag=$scope.isRemembered();
		  
		  // if already logged-in
		  (function(){
		  	if($scope.rememberMeFlag){
		  		$window.location.href='#'+todoApp.ROUTES.todos;
		  	}
		  })()
	
		  $scope.login = function(){
		  	Todo.startSession({
		      email:    $scope.email,
		      password: $scope.password,
		      success:  function(user) {
		      		if(!$scope.isRemembered() && $scope.rememberMeFlag){
		      			$scope.rememberMe(); 
		      		}
		      		
		      		$window.location.href='#'+todoApp.ROUTES.todos; 
		      	},
		      error: function(xhr)  { $window.location.href='#'+todoApp.ROUTES.signup; }
		    });
		  };
		  
		  $scope.rememberMe=function(){
		  	var options={
		  		path: '/app',
		  		expires: Date.today().add({months: 6})
		  	};
		  	
		  	$cookies.put(LOGIN_COOKIE_NAME,$scope.email,options);
		  	
		  	var cookieSet = $cookies.get(LOGIN_COOKIE_NAME);
		  	console.log('cookie set: '+JSON.stringify(cookieSet)+','+JSON.stringify(cookieSet.options));
		  };
		  
		  $scope.forgetMe=function(){
		  	$cookies.remove(LOGIN_COOKIE_NAME);
		  };
		  
		  $scope.logout=function(){
		  	Todo.endSession({
		      success: function() { 
		      	$scope.forgetMe();
		      	$window.location.href='#'+todoApp.ROUTES.login; 
		      },
		      error:   function(xhr)  {
		      	console.log('Error: '+xhr.responseText+','+xhr.status); 
		      	$window.location.href='#'+todoApp.ROUTES.login; 
		      }
		    });
		  };
		  
		  $scope.signup=function(){
		  	Todo.createUser({
			    email:    $scope.email,
			    password: $scope.password,
			    success:  function(user) {
			    	$scope.login(); 
			    },
			    error:    function(xhr)  { alert('user create error!') }
			  });
		  };
		  
		  $scope.email="";
		  $scope.password="";
		}
	]
);

todoControllers.controller('TodosController', ['$scope', '$window', function ($scope, $window) {
			$scope.todos=[];
			$scope.todo_placeholder={description:'',is_complete:false};
			
			$scope.SORT_OPTIONS={
				ASC:1,
				DESC:-1
			};
			
			$scope.sortOption=$scope.SORT_OPTIONS.ASC;
			
			$scope.isAsc=function(){
				return $scope.sortOption === $scope.SORT_OPTIONS.ASC; 
			};
			
			$scope.isDesc=function(){
				return $scope.sortOption === $scope.SORT_OPTIONS.DESC; 
			};
			
			(function(){
				Todo.loadTodos({
			      success: function(todos) {
			      	$scope.$apply(function(){$scope.todos=todos;});
			      },
			      error:   function(xhr)   {
			      	console.log('Error: '+xhr.responseText+','+xhr.status); 
			      	$window.location.href='#'+todoApp.ROUTES.login; 
		      		}
			    });
			})();
			
			function todoComparator(objLeft,objRight){
						if(!jQuery.isPlainObject(objLeft) ||
							!jQuery.isPlainObject(objRight) ||
							jQuery.type(objLeft.id) !== 'number' ||
							jQuery.type(objRight.id) !== 'number'){
							return 0;
							}
							
							return (objLeft.id - objRight.id) * $scope.sortOption;
					}
			
			$scope.sort=function(sortOption){
				$scope.sortOption=sortOption;
				$scope.todos.sort(todoComparator);
			};
			
			$scope.update_todo=function(todoId){
				found_todos=jQuery.grep($scope.todos,function(element){
					return element.id==todoId;
				});
				
				if(jQuery.isBlank(found_todos) || found_todos.length!=1){
					console.log("[TodoController][update_todo] Could not find todo("+todoId+")");
					return;
				}
				
				found_todo=found_todos[0];
			
				Todo.updateTodo({
			      todoId: todoId,
			      data: { is_complete: found_todo.is_complete, description:found_todo.description },
			      success: function(todo) { console.log('todo updated: '+JSON.stringify(todo)); },
			      error:   function(xhr)  { alert('todo update error!') }
			    });
			};
			
			$scope.create_todo=function(){
				if(jQuery.isBlank($scope.todo_placeholder.description)){
					alert('todo is missing a description');
					return false;
				}
			
				Todo.createTodo({
				    todo: {
				      description: $scope.todo_placeholder.description,
				      is_complete: $scope.todo_placeholder.is_complete
				    },
				    success: function(todo) {
				     	$scope.todo_placeholder.description='';
				     	$scope.todo_placeholder.is_complete=false;
				     	$scope.$apply(function(){
				     			$scope.todos.push(todo);
				     			$scope.todos.sort(todoComparator);
				     		});
				     	console.log('todo created: '+JSON.stringify(todo));
				     },
				    error:   function()     { alert('todo create error!') }
				  });
			};
		}
	]
);