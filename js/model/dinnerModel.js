//DinnerModel Object constructor
var DinnerModel = function() {
 
	//TODO Lab 2 implement the data structure that will hold number of guest
	// and selected dinner options for dinner menu
	this.guests = 1;
	this.selected = {
		starterID : 0,
		mainDishID : 0,
		dessertID : 0,
	};

	this.setNumberOfGuests = function(num) {
		if (num > 0 && num <= 42){
			this.guests = num;
		}
		else {console.log("Guest number out of range");}
	}

	// should return 
	this.getNumberOfGuests = function() {
		//console.log("hej"); //testing if the function is cqlled
		return this.guests;
	}

	//Returns the dish that is on the menu for selected type 
	this.getSelectedDish = function(type) {
		if(type == 'starter'){
			return this.getDish(this.selected.starterID);
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
	this.getFullMenu = function() {
		var menu = [];
		// 3 different 'for' loops to have them in the order starter-main-dessert
		// Starter
		for (var i=0;i<dishes.length;i++){
			if (dishes[i].id == this.selected.starterID){
				menu.push(dishes[i]);
			}
		}
		// Main dish
		for (var i=0;i<dishes.length;i++){
			if (dishes[i].id == this.selected.mainDishID){
				menu.push(dishes[i]);
			}
		}
		// Dessert
		for (var i=0;i<dishes.length;i++){
			if (dishes[i].id == this.selected.dessertID){
				menu.push(dishes[i]);
			}
		}
	}

	//Returns all ingredients for all the dishes on the menu.
	this.getAllIngredients = function() {
		var ingredients = [];
		
		for (var i=0;i<dishes.length;i++){
			// Is the current dish on the menu?
			// If so, add all ingredients
			if (isDishOnMenu(dishes[i].id)){
				for (var j=0;j<dishes[i].ingredients.length;j++){
					ingredients.push(dishes[i].ingredients[j]);
				}
			}
		}
		
		return ingredients;
	}

	//Returns the total price of the menu (all the ingredients per guests).
	this.getTotalMenuPrice = function() {
		var price = 0;
		for (var i=0;i<dishes.length;i++){
			// Is the current dish on the menu?
			// If so, add price
			if (this.isDishOnMenu(dishes[i].id)){
				for (var j=0;j<dishes[i].ingredients.length;j++){
					price += parseFloat(dishes[i].ingredients[j].price);
				}
			}
		}
		
		return price;
	}

	//Adds the passed dish to the menu. If the dish of that type already exists on the menu
	//it is removed from the menu and the new one added.
	this.addDishToMenu = function(id) {
		var dishType = this.getDish(id).type;
		if (dishType == 'starter'){
			this.selected.starterID = id;
		}
		else if (dishType == 'main dish'){
			this.selected.mainDishID = id;
		}
		else if (dishType == 'dessert'){
			this.selected.dessertID = id;
		}
		else{console.log("No match for dishType in addDishToMenu");}
	}

	//Removes dish from menu
	this.removeDishFromMenu = function(id) {
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
	}

	//function that returns all dishes of specific type (i.e. "starter", "main dish" or "dessert")
	//you can use the filter argument to filter out the dish by name or ingredient (use for search)
	//if you don't pass any filter all the dishes will be returned
	this.getAllDishes = function (type,filter) {
	  return $(dishes).filter(function(index,dish) {
		var found = true;
		if(filter){
			found = false;
			$.each(dish.ingredients,function(index,ingredient) {
				if(ingredient.name.indexOf(filter)!=-1) {
					found = true;
				}
			});
			if(dish.name.indexOf(filter) != -1)
			{
				found = true;
			}
		}
	  	return dish.type == type && found;
	  });	
	}
	this.getDishPrice= function(id){
		console.log('getDishPrice called with id '+id);
		var theDish = this.getDish(id);
		var sumPrice = 0;
			for(key in theDish.ingredients){
				sumPrice += theDish.ingredients[key].price;
		}
		return sumPrice;
	}
	//function that returns a dish of specific ID
	this.getDish = function (id) {
	  for(key in dishes){
			if(dishes[key].id == id) {
				return dishes[key];
			}
		}
	}
	
	// function that checks if the dish is on the menu
	this.isDishOnMenu = function(id){
		return (this.selected.starterID == id || this.selected.mainDishID == id || this.selected.dessertID == id);
	}

	// function that returns the size of the dishes array
	this.countDishes = function(){
		return dishes.length;
	}
	// the dishes variable contains an array of all the 
	// dishes in the database. each dish has id, name, type,
	// image (name of the image file), description and
	// array of ingredients. Each ingredient has name, 
	// quantity (a number), price (a number) and unit (string 
	// defining the unit i.e. "g", "slices", "ml". Unit
	// can sometimes be empty like in the example of eggs where
	// you just say "5 eggs" and not "5 pieces of eggs" or anything else.
	var dishes = [{
		'id':1,
		'name':'French toast',
		'type':'starter',
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
		'name':'Sourdough Starter',
		'type':'starter',
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
		'type':'starter',
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