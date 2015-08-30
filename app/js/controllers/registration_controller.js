todoControllers.controller('RegistrationController', ['$scope', '$window', '$cookies', function ($scope, $window, $cookies) {
		  var LOGIN_COOKIE_NAME='login';
		  var user={};

		  $scope.isRemembered=function(){
		  	user = $cookies.getObject(LOGIN_COOKIE_NAME);
		  	
		  	/* Hack to compensate for design deficit in Todo API.
		  	   Todo API would be better served if it was written in
		  	   Angular using $resource and $cookies.
		  	*/
		  	Todo.USER=user;
		  	
		  	return !jQuery.isBlank(user);
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
		      			$scope.rememberMe(user); 
		      		}
		      		
		      		$window.location.href='#'+todoApp.ROUTES.todos; 
		      	},
		      error: function(xhr)  { $window.location.href='#'+todoApp.ROUTES.signup; }
		    });
		  };
		  
		  $scope.rememberMe=function(user){
		  	var options={
		  		path: '/app',
		  		expires: Date.today().add({months: 6})
		  	};
		  	
		  	$cookies.putObject(LOGIN_COOKIE_NAME,user,options);
		  	
		  	var cookieSet = $cookies.get(LOGIN_COOKIE_NAME);
		  	console.log('cookie set: '+JSON.stringify(cookieSet));
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