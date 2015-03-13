// Controller Object constructor
var Controller = function (view,model){

	idArray = [];

	/** Controller variables **/
	var state = 1;
	this.searchStatus = 'Salad';
	var self = this;
	
	/** Initial search type **/
	

	/** Initial AJAX load **/
	model.getRecipeJson(jQuery('select').val(), function(){
   document.getElementById("loading").style.display="none";
   console.log(document.getElementById("loading").style.display);
   displayDishes();
	});
	
	/** Listeners to panels **/
	// #hello listener
	jQuery('#hello .create p').off().on('click',function(){
		// Update state
		state = 2;
		// CSS state
		view.state(2);
	});
	
	// Back from DishUI to selectUI
	jQuery('.dishUI .back p').off().on('click',function(){
		state = 2;
		view.state(2);
		console.log("dishUIback");
	});
	
	// Back from DishUI to selectUI but with dish selection
	jQuery('#confirmButton').off().on('click', function(){
		state = 2;
		view.state(2);
		console.log(view.displayed);
		model.addDishToMenu(view.displayed);
	});
	
	// Go to confirmUI
	jQuery('#left .confirm p').off().on('click',function(){
		state = 4;
		view.state(4);
		console.log("confirmUI");

		//Set the right Salad, main dish and dessert
		$("#SaladName").html(model.dishObjectArray.SaladObject.Title);
		$("#SaladPrice").html(model.getDishPrice("Salad",model.selected.SaladID));
		//$(".confirmUI .summary .Salad img").empty();
		$(".confirmUI .summary .Salad img").attr('src',model.dishObjectArray.SaladObject.ImageURL); 
		$("#mainName").html(model.dishObjectArray.mainDishObject.Title);
		$("#mainPrice").html(model.getDishPrice("Main Dish",model.selected.mainDishID));
		$(".confirmUI .summary .maindish img").attr('src',model.dishObjectArray.mainDishObject.ImageURL); 
		$("#dessertName").html(model.dishObjectArray.dessertObject.Title);
		$("#dessertPrice").html(model.getDishPrice("Desserts",model.selected.dessertID));
		$(".confirmUI .summary .dessert img").attr('src',model.dishObjectArray.dessertObject.ImageURL); 


	});
	
	// Back from confirmUI and fullrecipeUI to selectUI
	jQuery('.confirmUI .goback p, .fullrecipeUI .goback p').off().on('click',function(){
		state = 2;
		view.state(2);
		console.log("confirmUI and fullrecipeUI to selectUI");
	});
	
	// Go to fullrecipeUI
	jQuery('.confirmUI .print p').off().on('click',function(){
		state = 5;
		view.state(5);
		model.notify();
		console.log("fullrecipeUI");
	});
	
	/** Listeners for dishes **/
	// Dish listeners on selectUI to display DishUI
	// Tiggered in displayDishes()
	function dishListeners(idArray){
		console.log("Controller.dishListeners() called");
	
		for (key in idArray){		//return the food that correspond to the id 
			(function(key){
				jQuery('.selectUI .display .block.id'+idArray[key]+' *').off().on('click',function(){
					console.log("Click detected");
					state = 3;
					view.state(3);
					console.log(idArray[key]);
					model.getDishAPI(idArray[key], function(){
						var dish = model.getDish(idArray[key]); 
						view.loadDishUI(dish.RecipeID,dish.Title,dish.ImageURL,dish.Subcategory,dish.Ingredients,model.guests);	
						document.getElementById("loading").style.display="none";
						console.log(document.getElementById("loading").style.display);
					});
				});
			})(key);
		}

	};

	/** Filter functions **/
	function displayDishes(type,filter){
		console.log("Controller.displayDishes() called");
		
		// Retrieve data from model
		var dishes = model.getAllDishes();
		console.log(type,filter,dishes);
		// Stores ID to attach listeners
		
		// Launch content to view (Clear the display+Add the blocks)
		view.clearBlocks(); // Might remove all listeners
		
		// for (var key=0;key<dishesAPI.length;key++){
		// 	this.addBlock(dishesAPI[key].RecipeID,dishesAPI[key].ImageURL,dishesAPI[key].Title,dishesAPI[key].WebURL);
		// 	idArray.push(dishesAPI[key].RecipeID);
		// }
		for (var key=0;key<dishes.length;key++){
			view.addBlock(dishes[key].RecipeID,dishes[key].ImageURL,dishes[key].Title,dishes[key].Subcategory);
			idArray.push(dishes[key].RecipeID);
		}
		// Create listeners for all dishes regardless of whether they're actually displayed or not
		console.log(idArray);
		dishListeners(idArray);
	}
	
	//plus guest in the mainUI
	jQuery('#plusGuest').off().on('click', function(){
		model.setNumberOfGuests(model.guests+1);
	});
	
	//minus guest on the mainUI
	jQuery('#minusGuest').off().on('click', function(){ 
		model.setNumberOfGuests(model.guests-1);
	});

	// Selection of menu type
	jQuery('select').change(function(){
		model.getRecipeJson(jQuery('select').val(), function(){
		document.getElementById("loading").style.display="none";
		console.log(document.getElementById("loading").style.display);
		displayDishes();
	});
		// displayDishes($(this).val(),false);
		self.searchStatus = $(this).val();
	});
	/** Listener for search bar **/
	var isOK = false;
	var validRegex = /\w{2,}/;//2 or more characters
	// Check that the boxes contain enough info to launch search request
	jQuery('.searchform input.searchfield').on('input', function() { 
		var valval = jQuery('.searchform input.searchfield').val()
		isOK = validRegex.test(valval);
		if(isOK){
			isOK = true;
			// Load the content live! (= not use the button, actually...)
	model.getSearchRecipeJson(jQuery('select').val(),valval, function(){
		document.getElementById("loading").style.display="none";
		console.log(document.getElementById("loading").style.display);
		displayDishes();
	});
		}
		else{
			isOK = false;
			// Reload the whole content
			displayDishes(self.searchStatus,false);
		}
	});
	jQuery('.searchform').submit(function(event){
		// Stop form from submitting normally
		event.preventDefault();
		// Do nothing!!
	});
	
}