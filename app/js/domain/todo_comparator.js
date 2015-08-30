todoApp.TodoComparator=function TodoComparator(sortOption){
	(function init(){
		if(jQuery.isBlank(sortOption)){
			sortOption=todoApp.TodoComparator.SORT_OPTIONS.ASC;
		}
	})()

	this.compare=function(objLeft,objRight){
		if(jQuery.isBlank(objLeft)){
			throw '[TodoComparator][compare] objLeft is blank';
		}
		else if(jQuery.isBlank(objRight)){
			throw '[TodoComparator][compare] objLeft is blank';
		}
		else if(jQuery.isBlank(objLeft.id)){
			throw '[TodoComparator][compare] objLeft.id is blank';
		}
		else if(jQuery.isBlank(objRight.id)){
			throw '[TodoComparator][compare] objRight.id is blank';
		}
	
		return (objLeft.id - objRight.id)*sortOption;
	};

	/*
	Getters
	*/
	this.isAsc=function(){
		return sortOption === todoApp.TodoComparator.SORT_OPTIONS.ASC; 
	};
	
	this.isDesc=function(){
		return sortOption === todoApp.TodoComparator.SORT_OPTIONS.DESC; 
	};
	
	this.getSortOption=function(){
		return sortOption;
	};
	
	/*
	Mutators
	*/
	this.setSortOption=function(sortOptionInput){
		if(!jQuery.isBlank(sortOptionInput)){
			sortOption=sortOptionInput;
		}else{
			throw 'Sort option is blank: '+sortOptionInput;
		}
	};
}

todoApp.TodoComparator.SORT_OPTIONS={ASC:1,DESC:-1};