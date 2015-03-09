// Controller Object constructor
var Controller = function (view,model){
	 idArray = [];
	/** Controller variables **/
	var state = 1;
	this.searchStatus = 'starter';
	var self = this;
	/** Initial search type **/
	displayDishes('starter',false);

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
	jQuery("#confirmButton").off().on("click", function(){
		state = 2;
		view.state(2);
		model.addDishToMenu(view.displayed);
	});
	
	// Go to confirmUI
	jQuery('#left .confirm p').off().on('click',function(){
		state = 4;
		view.state(4);
		console.log("confirmUI");

		//Set the right starter, main dish and dessert
		$("#starterName").html(model.getDish(model.selected.starterID).name);
		$("#starterPrice").html(model.getDishPrice(model.selected.starterID));
		//$(".confirmUI .summary .starter img").empty();
		$(".confirmUI .summary .starter img").attr('src',model.getDish(model.selected.starterID).image); 

		$("#mainName").html(model.getDish(model.selected.mainDishID).name);
		$("#mainPrice").html(model.getDishPrice(model.selected.mainDishID));
		$(".confirmUI .summary .maindish img").attr('src',model.getDish(model.selected.mainDishID).image); 
		$("#dessertName").html(model.getDish(model.selected.dessertID).name);
		$("#dessertPrice").html(model.getDishPrice(model.selected.dessertID));
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
	});
	
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
	
	/** Filter functions **/
	function displayDishes(type,filter){
		console.log("Controller.displayDishes() called");
		
		// Retrieve data from model
		var dishes = model.getAllDishes(type,filter);
		console.log(type,filter,dishes);
		var type = "dessert";
		var dishesAPI = model.getAllDishesAPI(type);
		// Stores ID to attach listeners
		
		// Launch content to view (Clear the display+Add the blocks)
		view.clearBlocks(); // Might remove all listeners
		
		// for (var key=0;key<dishesAPI.length;key++){
		// 	this.addBlock(dishesAPI[key].RecipeID,dishesAPI[key].ImageURL,dishesAPI[key].Title,dishesAPI[key].WebURL);
		// 	idArray.push(dishesAPI[key].RecipeID);
		// }
		for (var key=0;key<dishes.length;key++){
			view.addBlock(dishes[key].id,dishes[key].image,dishes[key].name,dishes[key].description);
			idArray.push(dishes[key].id);
		}
		// Create listeners for all dishes regardless of whether they're actually displayed or not
		console.log(idArray);
		dishListeners(idArray);
	}
	
	//plus guest in the mainUI
	jQuery("#plusGuest").off().on("click", function(){
		model.setNumberOfGuests(model.guests+1);
	});
	
	//minus guest on the mainUI
	jQuery("#minusGuest").off().on("click", function(){ 
		model.setNumberOfGuests(model.guests-1);
	});

	// Selection of menu type
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
        var titleKeyword = valval;
        var url = "http://api.bigoven.com/recipes?pg=1&rpp=25&title_kw="
                  + titleKeyword 
                  + "&api_key="+apiKey;
        $.ajax({
            type: "GET",
            dataType: 'json',
            cache: false,
            url: url,
            success: function (data) {
                //alert('success');
                displayDishes(self.searchStatus,data.Results);
                for (i=0; i<data.Results.length; i++){
                	console.log(data.Results[i]);
                	
                }
                //console.log(data);
        }
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