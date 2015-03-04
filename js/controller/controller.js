// Controller Object constructor
var Controller = function (view,model) {

	/** Controller variables **/
	var state = 1;
	this.searchStatus = 'starter';
	var self = this;
	
	/** Initial HTML fill (temporary) **/ 
	// #left
	/** Initial search type **/
	displayDishes('starter',false);
	//view.addToList("Lasagne",77.5);
	//view.setLeftTotal(77.50);
	
	/** Listeners for dishes **/
	// Dish listeners on selectUI to display DishUI
	// Tiggered in displayDishes()
	function dishListeners(idArray){
		console.log("Controller.dishListeners() called");
		
		for (key in idArray){
			(function(key){
				jQuery('.selectUI .display .block.id'+idArray[key]+' *').off().on('click',function(){
					console.log("Click detected");
					state = 3;
					view.state(3);
					var dish = model.getDish(idArray[key]);
					view.loadDishUI(dish.id,dish.name,dish.image,dish.description,dish.ingredients,model.guests);
				});
			})(key);
		}
	};
	
	/** Listeners to panels (forever in the DOM, <3) **/
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
	
	// Go to confirmUI
	jQuery('#left .confirm p').off().on('click',function(){
		state = 4;
		view.state(4);
		console.log("confirmUI");
		$("#guestTotal").empty();
		$("#guestTotal").append(model.getNumberOfGuests()); // print nbr of ppl
		//Set the right starter, main dish and dessert
		$("#starterName").empty();
		$("#starterName").append(model.getDish(model.selected.starterID).name);
		$("#starterPrice").empty();
		$("#starterPrice").append(model.getDishPrice(model.selected.starterID));
		//$(".confirmUI .summary .starter img").empty();
		$(".confirmUI .summary .starter img").attr('src',model.getDish(model.selected.starterID).image); 

		$("#mainName").empty();
		$("#mainName").append(model.getDish(model.selected.mainDishID).name);
		$("#mainPrice").empty();
		$("#mainPrice").append(model.getDishPrice(model.selected.mainDishID));
		$(".confirmUI .summary .maindish img").attr('src',model.getDish(model.selected.mainDishID).image); 
		$("#dessertName").empty();
		$("#dessertName").append(model.getDish(model.selected.dessertID).name);
		$("#dessertPrice").empty();
		$("#dessertPrice").append(model.getDishPrice(model.selected.dessertID));
		$(".confirmUI .summary .dessert img").attr('src',model.getDish(model.selected.dessertID).image); 


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
		console.log("fullrecipeUI");
		$("#guestTotal2").empty();
		$("#guestTotal2").append(model.getNumberOfGuests()); // print nbr of ppl
				//Set the right starter, main dish and dessert
		$("#starterNameFRUI").empty();
		$("#starterNameFRUI").append(model.getDish(model.selected.starterID).name);
		$("#starterDescFRUI").empty();
		$("#starterDescFRUI").append(model.getDish(model.selected.starterID).description);
		$(".fullrecipeUI .element .starter img").attr('src',model.getDish(model.selected.starterID).image);  

		$("#mainNameFRUI").empty();
		$("#mainNameFRUI").append(model.getDish(model.selected.mainDishID).name);
		$("#mainDescFRUI").empty();
		$("#mainDescFRUI").append(model.getDish(model.selected.mainDishID).description);
		$(".fullrecipeUI .element .main img").attr('src',model.getDish(model.selected.mainDishID).image); 

		$("#dessertNameFRUI").empty();
		$("#dessertNameFRUI").append(model.getDish(model.selected.dessertID).name);
		$("#dessertDescFRUI").empty();
		$("#dessertDescFRUI").append(model.getDish(model.selected.dessertID).description);
		$(".fullrecipeUI .element .dessert img").attr('src',model.getDish(model.selected.dessertID).image); 
	});
	
	/** Filter functions **/
	function displayDishes(type,filter){
		console.log("Controller.displayDishes() called");
		
		// Retrieve data from model
		var dishes = model.getAllDishes(type,filter);
		console.log(type,filter,dishes);
		
		// Stores ID to attach listeners
		var idArray = [];
		
		// Launch content to view (Clear the display+Add the blocks)
		view.clearBlocks(); // Might remove all listeners
		for (var key=0;key<dishes.length;key++){
			view.addBlock(dishes[key].id,dishes[key].image,dishes[key].name,dishes[key].description);
			idArray.push(dishes[key].id);
		}
		// Create listeners for all dishes regardless of whether they're actually displayed or not
		dishListeners(idArray);
	}
		//plus guest in the mainUI
	document.getElementById("plusGuest").addEventListener("click", function(){
		// console.log(document.getElementById("guest").innerHTML);
		//temp=document.getElementById("guest").innerHTML + 1;
		model.setNumberOfGuests(model.guests+1);
		view.setGuests(model.guests);
		PlottingRecipe();
		var tempplus = model.getDishPrice(model.selected.starterID) + model.getDishPrice(model.selected.mainDishID) + model.getDishPrice(model.selected.dessertID);
		view.setLeftTotal(tempplus * model.guests);
	});
	//minus guest on the mainUI
	document.getElementById("minusGuest").addEventListener("click", function(){ 
		model.setNumberOfGuests(model.guests-1);
		view.setGuests(model.guests);
		PlottingRecipe();
	});
	
	//Function that update the recipe on the left. So it can update when adding or removing a guest and changing the dish on the menu

	PlottingRecipe = function(){
		view.emptyList();
		model.addDishToMenu(view.displayed);
		var menuDishPrice = 0;
		if (model.selected.starterID !== 0)
		{
			view.addToList(model.getDish(model.selected.starterID).name,model.getDishPrice(model.selected.starterID));
			menuDishPrice += model.getDishPrice(model.selected.starterID);
		}	
		if (model.selected.mainDishID !== 0)
		{
			view.addToList(model.getDish(model.selected.mainDishID).name,model.getDishPrice(model.selected.mainDishID));
			menuDishPrice += model.getDishPrice(model.selected.mainDishID);
		}
		if (model.selected.dessertID !== 0)
		{
			view.addToList(model.getDish(model.selected.dessertID).name,model.getDishPrice(model.selected.dessertID));
			menuDishPrice += model.getDishPrice(model.selected.dessertID);
		}
		view.setLeftTotalPerPerson(menuDishPrice);
		view.setLeftTotal(menuDishPrice * model.guests);
		view.setSummaryTotal(menuDishPrice * model.guests);
	}

	document.getElementById("confirmButton").addEventListener("click", function(){
		PlottingRecipe();
	});
		
	// selection of menu type
	
	jQuery('select').change(function(){
		displayDishes($(this).val(),false);
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
			displayDishes(self.searchStatus,valval);
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