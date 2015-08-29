todoControllers = angular.module('todoControllers', []);

todoControllers.controller('RegistrationController', ['$scope', '$window', function ($scope, $window) {
		  $scope.login = function(){
		  	Todo.startSession({
		      email:    $scope.email,
		      password: $scope.password,
		      success:  function(user) { $window.location.href='#'+todoApp.ROUTES.todos; },
		      error:    function(xhr)  { $window.location.href='#'+todoApp.ROUTES.signup; }
		    });
		  };
		  
		  $scope.logout=function(){
		  	Todo.endSession({
		      success: function() { $window.location.href='#'+todoApp.ROUTES.login; },
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
			
			(function(){
				Todo.loadTodos({
			      success: function(todos) {
			      	$scope.$apply(function(){$scope.todos=todos;});
			      },
			      error:   function(xhr)   { alert('todo load error!') }
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
			
			$scope.sort=function(){
				$scope.$apply(function(){$scope.todos.sort(todoComparator);});
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
				     	$scope.$apply(function(){$scope.todos.push(todo);});
				     	console.log('todo created: '+JSON.stringify(todo));
				     },
				    error:   function()     { alert('todo create error!') }
				  });
			};
		}
	]
);