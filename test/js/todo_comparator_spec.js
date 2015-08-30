describe('TodoComparator',function(){
	describe('asc sort',function(){
		var todoComparator=new todoApp.TodoComparator();
		var todos=[];
		
		beforeAll(function() {
		    todos=[{id:6,description:'6'},{id:1,description:'1'},{id:3,description:'3'}];
		    todos.sort(todoComparator.compare);
		  });
	
		it('shall sort in asc order',function(){
			expect(todoComparator.isAsc()).toBe(true);
			expect(todos[0].id).toEqual(1);
			expect(todos[1].id).toEqual(3);	
			expect(todos[2].id).toEqual(6);				
		});
	});
	
	describe('desc sort',function(){
		var todoComparator=new todoApp.TodoComparator(todoApp.TodoComparator.SORT_OPTIONS.DESC);
		var todos=[];
		
		beforeAll(function() {
		    todos=[{id:6,description:'6'},{id:1,description:'1'},{id:3,description:'3'}];
		    todos.sort(todoComparator.compare);
		  });
	
		it('shall sort in asc order',function(){
			expect(todoComparator.isDesc()).toBe(true);
			expect(todos[0].id).toEqual(6);
			expect(todos[1].id).toEqual(3);	
			expect(todos[2].id).toEqual(1);				
		});
	});
});