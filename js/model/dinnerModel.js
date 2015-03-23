//DinnerModel Object constructor
var DinnerModel = function() {
 	var apiKey = "dvxpWrF1lW3ITKs85zY3e6q7UnVE7zUD";
 	this._listeningViews = [];
 	this.attach = function (listeningView){
 		this._listeningViews.push(listeningView);
 		//console.log(listeningView);
 	};
 	this.notify = function(args){
 		for(var i = 0; i < this._listeningViews.length; i++){
 			this._listeningViews[i].update(args);
 		}
 		console.log("notifying");
 	};
	//TODO Lab 2 implement the data structure that will hold number of guest
	// and selected dinner options for dinner menu
	this.guests = 1;
	this.selected = {
		SaladID : 0,
		mainDishID : 0,
		dessertID : 0,
	};
	console.log("this.guests : " + this.guests);
	this.dishObjectArray = {
		SaladObject : null,
		mainDishObject : null,
		dessertObject : null,
	};

	this.totalPerPerson = 0;
	this.total = 0;
	
	// Sets the number of guests
	this.setNumberOfGuests = function(num){
		if (num > 0 && num <= 42){
			this.guests = num;
		}
		else {console.log("Guest number out of range");}
		this.setTotals();// Update totals
		this.notify();
	}
	// Sets the values of totalPerPerson and total
	this.setTotals = function(){
		var menuDishPrice = 0;
		if (this.selected.SaladID !== 0)
		{
			menuDishPrice += this.getDishPrice("Salad",this.selected.SaladID);
		}
		if (this.selected.mainDishID !== 0)
		{
			menuDishPrice += this.getDishPrice("Main Dish",this.selected.mainDishID);
		}
		if (this.selected.dessertID !== 0)
		{
			menuDishPrice += this.getDishPrice("Desserts", this.selected.dessertID);
		}
		// Update 1
		this.totalPerPerson = menuDishPrice;
		// Update 2
		this.total = this.totalPerPerson * this.guests;
		// Notify
		this.notify();
	}
	// Returns number of guests
	this.getNumberOfGuests = function(){
		return this.guests;
	}
	// Returns total per person
	this.getTotalPerPerson = function(){
		return this.totalPerPerson;
	}
	// Returns total

	this.getTotal = function(){
		return this.total;
	}

	//Returns the dish that is on the menu for selected type 
	this.getSelectedDish = function(type){
		if(type == 'Salad'){
			return this.getDish(this.selected.SaladID);
		}
		else if(type == 'main dish'){
			return this.getDish(this.selected.mainDishID);
		}
		else if(type == 'dessert'){
			return this.getDish(this.selected.dessertID);
		}
		else{console.log("Wrong dish type in getSelectedDish");}
	}

	//Returns all the dishes on the menu.
	this.getFullMenu = function(){
		var menu = [];
		// 3 different 'for' loops to have them in the order Salad-main-dessert
		// Salad
		for (var i=0;i<this.dishes.length;i++){
			if (this.dishes[i].id == this.selected.SaladID){
				menu.push(this.dishes[i]);
			}
		}
		// Main dish
		for (var i=0;i<this.dishes.length;i++){
			if (this.dishes[i].id == this.selected.mainDishID){
				menu.push(this.dishes[i]);
			}
		}
		// Dessert
		for (var i=0;i<this.dishes.length;i++){
			if (this.dishes[i].id == this.selected.dessertID){
				menu.push(this.dishes[i]);
			}
		}
	}

	//Returns all ingredients for all the dishes on the menu.
	this.getAllIngredients = function(){
		var ingredients = [];
		
		for (var i=0;i<this.dishes.length;i++){
			// Is the current dish on the menu?
			// If so, add all ingredients
			if (isDishOnMenu(this.dishes[i].id)){
				for (var j=0;j<this.dishes[i].ingredients.length;j++){
					ingredients.push(this.dishes[i].ingredients[j]);
				}
			}
		}
		
		return ingredients;
	}

	//Returns the total price of the menu (all the ingredients per guests).
	this.getTotalMenuPrice = function(){
		var price = 0;
		console.log(this.dishes);
		for (var i=0;i<this.dishes.length;i++){
			// Is the current dish on the menu?
			// If so, add price
			if (this.isDishOnMenu(this.dishes[i].id)){
				for (var j=0;j<this.dishes[i].ingredients.length;j++){
					price += parseFloat(this.dishes[i].ingredients[j].price);
				}
			}
		}
		
		return price;
	}

	//Adds the passed dish to the menu. If the dish of that type already exists on the menu
	//it is removed from the menu and the new one added.

					
	this.addDishToMenu = function(id){
		context = this ;

		this.getDishAPI(id, function(){
			var dishType = context.getDish(id).Category;
				if (dishType== 'Salad'){
					context.selected.SaladID = id;
					context.notify();
				}
				else if (dishType == 'Main Dish'){
					context.selected.mainDishID = id;
					context.notify();
				}
				else if (dishType == 'Desserts'){
					context.selected.dessertID = id;
					context.notify();
				}
				else{console.log("No match for dishType in addDishToMenu");}
				
				// Notify
				console.log(context.selected);
				
				// Update totals
				//context.setTotals();// Which will notify too
		});

	}

	//Removes dish from menu
	this.removeDishFromMenu = function(id){
		if (this.selected.startedID == id){
			this.selected.startedID = 0;
		}
		else if (this.selected.mainDishID == id){
			this.selected.mainDishID = 0;
		}
		else if (this.selected.dessertID == id){
			this.selected.dessertID = 0;
		}
		else {console.log("There was no dish to remove with id "+id);}
		this.notify();
	}

	//function that returns all dishes of specific type (i.e. "Salad", "main dish" or "dessert")
	//you can use the filter argument to filter out the dish by name or ingredient (use for search)
	//if you don't pass any filter all the dishes will be returned
	this.getAllDishes = function (type,filter){
	 return this.dishes;	
	}
	// function that checks if the dish is on the menu
	this.isDishOnMenu = function(id){
		return (this.selected.SaladID == id || this.selected.mainDishID == id || this.selected.dessertID == id);
	}

	// function that returns the size of the dishes array
	this.countDishes = function(){
		return this.dishes.length;
	}
	var theDish;
	var sumPrice;
	this.getDishPrice = function(type, id){

		console.log('getDishPrice called with id '+id);
			
			if(type == "Desserts"){theDish = this.dishObjectArray.dessertObject;};
			if(type == "Main Dish"){theDish = this.dishObjectArray.mainDishObject;};
			if(type == "Salad"){theDish = this.dishObjectArray.SaladObject;};

			console.log(theDish);
			sumPrice = 0 ;
			for(key in theDish.Ingredients) {
				sumPrice += theDish.Ingredients[key].Quantity;
			}
			console.log(sumPrice);
			return sumPrice;
	}
	var dishtest;
	//function that returns a dish of specific ID
	this.getDish = function (id){
		if (dishtest.Category == "Desserts"){this.selected.dessertID = id; this.dishObjectArray.dessertObject = dishtest;};
		if (dishtest.Category == "Main Dish"){this.selected.mainDishID = id; this.dishObjectArray.mainDishObject = dishtest;};
		if (dishtest.Category == "Salad"){this.selected.SaladID = id; this.dishObjectArray.SaladObject = dishtest;};
		console.log(this.dishObjectArray);
		return dishtest;
	}

	this.getDishAPI = function(recipeID, callback) {
		var apiKey = "dvx56Dym7twQKn2497tl070E54Y13cQM";

		// var recipeID = 196149;
		var url = "http://api.bigoven.com/recipe/" + recipeID + "?api_key="+apiKey;
		document.getElementById("loading").style.display="inline";
           	console.log(document.getElementById("loading").style.display);
		 $.ajax({
         type: "GET",
         dataType: 'json',
         cache: false,
         url: url,
         success: function (data) {
            console.log(data);
           	dishtest = data;
           	
            callback();
            },
			error: function(jqXHR,error, errorThrown) {  
               if(jqXHR.status&&jqXHR.status==400){
                    alert(jqXHR.responseText); 
               }else{
                   alert("Something went wrong");
               }
           }
         });
       }

	this.getRecipeJson = function(type, callback) {
		var apiKey = "dvx56Dym7twQKn2497tl070E54Y13cQM";
		//var recipeID = 196149;
		var url = "http://api.bigoven.com/recipe?include_primarycat=" +type+ "&pg=1&rpp=20" +"&api_key="+apiKey;
		//http://api.bigoven.com/recipes?include_primarycat=dessert&pg=1&rpp=20&api_key=dvx56Dym7twQKn2497tl070E54Y13cQM
		var self = this;
		document.getElementById("loading").style.display="inline";
		console.log(document.getElementById("loading").style.display);		
		$.ajax({
			type: "GET",
			dataType: 'json',
			cache: false,
			url: "http://api.bigoven.com/recipes?include_primarycat="+type+"&pg=1&rpp=20&api_key=" + apiKey,
			success: function (data) {

				self.dishes = [];
				for (var i = 0; i < data.Results.length; i++) {
				 	self.dishes.push(data.Results[i]);
				};
				self.notify(self.dishes);
				callback();

			},
			error: function(jqXHR,error, errorThrown) {  
               if(jqXHR.status&&jqXHR.status==400){
                    alert(jqXHR.responseText); 
               }else{
                   alert("Something went wrong");
               }
           }
		});
	}
	this.getSearchRecipeJson = function(type, Keyword, callback) {
		var apiKey = "dvxpWrF1lW3ITKs85zY3e6q7UnVE7zUD";
		//var recipeID = 196149;
		//var url = "http://api.bigoven.com/recipe?include_primarycat=" +type+ "&pg=1&rpp=20" +"&api_key="+apiKey;
		//http://api.bigoven.com/recipes?include_primarycat=dessert&pg=1&rpp=20&api_key=dvxpWrF1lW3ITKs85zY3e6q7UnVE7zUD
		var self = this;
		document.getElementById("loading").style.display="inline";
		console.log(document.getElementById("loading").style.display);		
		$.ajax({
			type: "GET",
			dataType: 'json',
			cache: false,
			url : "http://api.bigoven.com/recipes?include_primarycat=" +type+ "&pg=1&rpp=20&any_kw="+Keyword+"&api_key="+apiKey,
			success: function (data) {
				console.log(data);
				self.dishes = [];
				for (var i = 0; i < data.Results.length; i++) {
				 	self.dishes.push(data.Results[i]);
				};
				self.notify(self.dishes);
				callback();

			},
			error: function(jqXHR,error, errorThrown) {  
               if(jqXHR.status&&jqXHR.status==400){
                    alert(jqXHR.responseText); 
               }else{
                   alert("Something went wrong");
               }
           }
		});
	}
	
	// the dishes variable contains an array of all the 
	// dishes in the database. each dish has id, name, type,
	// image (name of the image file), description and
	// array of ingredients. Each ingredient has name, 
	// quantity (a number), price (a number) and unit (string 
	// defining the unit i.e. "g", "slices", "ml". Unit
	// can sometimes be empty like in the example of eggs where
	// you just say "5 eggs" and not "5 pieces of eggs" or anything else.
	this.dishes = [{
		'id':1,
		'name':'French toast',
		'type':'Salad',
		'image':'images/toast.jpg',
		'description':"In a large mixing bowl, beat the eggs. Add the milk, brown sugar and nutmeg; stir well to combine. Soak bread slices in the egg mixture until saturated. Heat a lightly oiled griddle or frying pan over medium high heat. Brown slices on both sides, sprinkle with cinnamon and serve hot.",
		'ingredients':[{ 
			'name':'eggs',
			'quantity':0.5,
			'unit':'',
			'price':10
			},{
			'name':'milk',
			'quantity':30,
			'unit':'ml',
			'price':6
			},{
			'name':'brown sugar',
			'quantity':7,
			'unit':'g',
			'price':1
			},{
			'name':'ground nutmeg',
			'quantity':0.5,
			'unit':'g',
			'price':12
			},{
			'name':'white bread',
			'quantity':2,
			'unit':'slices',
			'price':2
			}]
		},{
		'id':2,
		'name':'Sourdough Salad',
		'type':'Salad',
		'image':'images/sourdough.jpg',
		'description':"Here is how you make it... Lore ipsum...",
		'ingredients':[{ 
			'name':'active dry yeast',
			'quantity':0.5,
			'unit':'g',
			'price':4
			},{
			'name':'warm water',
			'quantity':30,
			'unit':'ml',
			'price':0
			},{
			'name':'all-purpose flour',
			'quantity':15,
			'unit':'g',
			'price':2
			}]
		},{
		'id':3,
		'name':'Baked Brie with Peaches',
		'type':'Salad',
		'image':'images/bakedbrie.jpg',
		'description':"Here is how you make it... Lore ipsum...",
		'ingredients':[{ 
			'name':'round Brie cheese',
			'quantity':10,
			'unit':'g',
			'price':8
			},{
			'name':'raspberry preserves',
			'quantity':15,
			'unit':'g',
			'price':10
			},{
			'name':'peaches',
			'quantity':1,
			'unit':'',
			'price':4
			}]
		},{
		'id':100,
		'name':'Meat balls',
		'type':'main dish',
		'image':'images/meatballs.jpg',
		'description':"Preheat an oven to 400 degrees F (200 degrees C). Place the beef into a mixing bowl, and season with salt, onion, garlic salt, Italian seasoning, oregano, red pepper flakes, hot pepper sauce, and Worcestershire sauce; mix well. Add the milk, Parmesan cheese, and bread crumbs. Mix until evenly blended, then form into 1 1/2-inch meatballs, and place onto a baking sheet. Bake in the preheated oven until no longer pink in the center, 20 to 25 minutes.",
		'ingredients':[{ 
			'name':'extra lean ground beef',
			'quantity':115,
			'unit':'g',
			'price':20
			},{
			'name':'sea salt',
			'quantity':0.7,
			'unit':'g',
			'price':3
			},{
			'name':'small onion, diced',
			'quantity':0.25,
			'unit':'',
			'price':2
			},{
			'name':'garlic salt',
			'quantity':0.7,
			'unit':'g',
			'price':2
			},{
			'name':'Italian seasoning',
			'quantity':0.6,
			'unit':'g',
			'price':3
			},{
			'name':'dried oregano',
			'quantity':0.3,
			'unit':'g',
			'price':3
			},{
			'name':'crushed red pepper flakes',
			'quantity':0.6,
			'unit':'g',
			'price':3
			},{
			'name':'Worcestershire sauce',
			'quantity':6,
			'unit':'ml',
			'price':7
			},{
			'name':'milk',
			'quantity':20,
			'unit':'ml',
			'price':4
			},{
			'name':'grated Parmesan cheese',
			'quantity':5,
			'unit':'g',
			'price':8
			},{
			'name':'seasoned bread crumbs',
			'quantity':15,
			'unit':'g',
			'price':4
			}]
		},{
		'id':101,
		'name':'MD 2',
		'type':'main dish',
		'image':'images/bakedbrie.jpg',
		'description':"Here is how you make it... Lore ipsum...",
		'ingredients':[{ 
			'name':'ingredient 1',
			'quantity':1,
			'unit':'pieces',
			'price':8
			},{
			'name':'ingredient 2',
			'quantity':15,
			'unit':'g',
			'price':7
			},{
			'name':'ingredient 3',
			'quantity':10,
			'unit':'ml',
			'price':4
			}]
		},{
		'id':102,
		'name':'MD 3',
		'type':'main dish',
		'image':'images/meatballs.jpg',
		'description':"Here is how you make it... Lore ipsum...",
		'ingredients':[{ 
			'name':'ingredient 1',
			'quantity':2,
			'unit':'pieces',
			'price':8
			},{
			'name':'ingredient 2',
			'quantity':10,
			'unit':'g',
			'price':7
			},{
			'name':'ingredient 3',
			'quantity':5,
			'unit':'ml',
			'price':4
			}]
		},{
		'id':102,
		'name':'MD 4',
		'type':'main dish',
		'image':'images/meatballs.jpg',
		'description':"Here is how you make it... Lore ipsum...",
		'ingredients':[{ 
			'name':'ingredient 1',
			'quantity':1,
			'unit':'pieces',
			'price':4
			},{
			'name':'ingredient 2',
			'quantity':12,
			'unit':'g',
			'price':7
			},{
			'name':'ingredient 3',
			'quantity':6,
			'unit':'ml',
			'price':4
			}]
		},{
		'id':200,
		'name':'Chocolat Ice cream',
		'type':'dessert',
		'image':'images/icecream.jpg',
		'description':"Here is how you make it... Lore ipsum...",
		'ingredients':[{ 
			'name':'ice cream',
			'quantity':100,
			'unit':'ml',
			'price':6
			}]
		},{
		'id':201,
		'name':'Vanilla Ice cream',
		'type':'dessert',
		'image':'images/icecream.jpg',
		'description':"Here is how you make it... Lore ipsum...",
		'ingredients':[{ 
			'name':'ice cream',
			'quantity':100,
			'unit':'ml',
			'price':6
			}]
		},{
		'id':202,
		'name':'Strawberry',
		'type':'dessert',
		'image':'images/icecream.jpg',
		'description':"Here is how you make it... Lore ipsum...",
		'ingredients':[{ 
			'name':'ice cream',
			'quantity':100,
			'unit':'ml',
			'price':6
			}]
		}
	];

}