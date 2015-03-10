// View Object constructor
var View = function (container,model){

	model.attach(this);
	
	this.displayed = 0;
	
	/** In several UI **/
	this.setGuests = function(){
		jQuery('#left p.guests').html(model.getNumberOfGuests());
		jQuery('#guestTotal').html(model.getNumberOfGuests());
		jQuery('#guestTotal2').html(model.getNumberOfGuests());
	}
	
	/** Left menu UI **/
	this.addToList = function(name,price){
		var HTML = "<div class='element'><p class='name'>"+name+"</p><p class='price'>"+price+"</p></div>";
		jQuery('#left .list').append(HTML);
	}
	this.addPendingLineToList = function(){
		var pendingHTML = "<div class='element'><p class='name'>"+"Pending"+"</p><p class='price'>"+"..."+"</p></div>";
		jQuery('#left .list').append(pendingHTML);
	}
	this.emptyList= function(){
		jQuery('#left .list').html('');
	}
	this.shapeList = function(){
		if (model.selected.starterID !== 0){
			this.addToList(model.getDish(model.selected.starterID).name,model.getDishPrice(model.selected.starterID));
		}
		if (model.selected.mainDishID !== 0){
			this.addToList(model.getDish(model.selected.mainDishID).name,model.getDishPrice(model.selected.mainDishID));
		}
		if (model.selected.dessertID !== 0){
			this.addToList(model.getDish(model.selected.dessertID).name,model.getDishPrice(model.selected.dessertID));
		}
		if (parseInt(model.selected.starterID + model.selected.mainDishID + model.selected.dessertID) == 0){
			this.addPendingLineToList();
		}
	}
	this.setLeftTotalPerPerson = function(){
		jQuery('#left .pricearea .perpersonpricearea p.price').html(model.getTotalPerPerson());
	}
	this.setLeftTotal = function(){
		jQuery('#left .pricearea .totalpricearea p.totalprice').html(model.getTotal());
	}

	/** SelectDish UI **/
	this.clearBlocks = function(){
		jQuery('.selectUI .display').html('');
	}
	this.addBlock = function(id,imgsrc,name,description){
		var blockHTML = "<div class='block id"+id+"'><img src='"+imgsrc+"' alt='"+name+"'/><p class='name'>"+name+"</p><p class='description'>"+description+"</p></div>";
		//console.log("appended: ",blockHTML);
		jQuery('.selectUI .display').append(blockHTML);
	}
	
	/** Dish UI **/
	this.loadDishUI = function(id,name,imgsrc,text,ingredients,guests){
		console.log("loadDishUI called for "+name);
		// Replace fields
		jQuery('.dishUI .topleft p.name').html(name);
		jQuery('.dishUI .topleft img').attr('src',imgsrc);
		jQuery('.dishUI .topleft p.text').html(text);
		//change value of displayed to get the name of the dish
		this.displayed = id;
		// Ingredients display in the yellowish left area
		// Empty current
		jQuery('.dishUI .ingredients .inglist .row').remove();
		
		var totalPersonPrice = 0;
		for (key in ingredients){
			// Filled html row
			var rowHTML = '<div class="row"><p class="quantity">'+ingredients[key].quantity*guests+" "+ingredients[key].unit+'</p><p class="what">'+ingredients[key].name+'</p><p class="unit">SEK</p><p class="price">'+ingredients[key].price*guests+'</p></div>';
			// Append it
			jQuery('.dishUI .ingredients .inglist').append(rowHTML);
			totalPersonPrice += ingredients[key].price;
		}
		jQuery('.dishUI .ingredients .bottom p.total').html(totalPersonPrice*guests);
	}
	this.setIngredientsTotal = function(total){
		jQuery('.dishUI .ingredients .bottom p.total').html(total);
	}
	
	/** Confirm UI **/
	this.setSummaryTotal = function(){
		jQuery('.confirmUI .summary .totalright p.value').html(model.getTotal());
	}
	
	/** Full Recipe UI **/
	this.shapeFinalRecipe = function(){
		// Starter
		if (model.selected.starterID !== 0){
			jQuery("#starterNameFRUI").html(model.getDish(model.selected.starterID).name);
			jQuery("#starterDescFRUI").html(model.getDish(model.selected.starterID).description);
			jQuery(".fullrecipeUI .element .starter img").attr('src',model.getDish(model.selected.starterID).image); 
		}
		if (model.selected.mainDishID !== 0){
			// Main Dish
			jQuery("#mainNameFRUI").html(model.getDish(model.selected.mainDishID).name);
			jQuery("#mainDescFRUI").html(model.getDish(model.selected.mainDishID).description);
			jQuery(".fullrecipeUI .element .main img").attr('src',model.getDish(model.selected.mainDishID).image);
		}
		if (model.selected.dessertID !== 0){
			// Dessert
			jQuery("#dessertNameFRUI").html(model.getDish(model.selected.dessertID).name);
			jQuery("#dessertDescFRUI").html(model.getDish(model.selected.dessertID).description);
			jQuery(".fullrecipeUI .element .dessert img").attr('src',model.getDish(model.selected.dessertID).image);
		}
	}
	
	/** States management **/
	this.state = function(num){
		jQuery('html').removeClass().addClass('state'+num);
	}
	

	/** Update method for Observer pattern **/
	/*
	 * Unique update function that updates all DOM elements
	 * @param  {Object} object !!!OPTIONAL!!! object with parameters for the update
	 */
	this.update = function(object){
		if (typeof object !== "undefined" && object.length == 10){
			var dishesAPI = object;
			console.log(dishesAPI);
		}
		
		/** In several UI **/
		this.setGuests();
		
		/** Left menu UI **/
		this.emptyList();
		this.shapeList();
		this.setLeftTotalPerPerson();
		this.setLeftTotal();
		
		/** Confirm UI **/
		this.setSummaryTotal();
		
		/** Full Recipe UI **/
		this.shapeFinalRecipe();
	}
}
 
