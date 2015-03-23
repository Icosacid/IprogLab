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

		if (model.selected.SaladID !== 0){
			//context = this ;
			
			this.addToList(model.dishObjectArray.SaladObject.Title, model.getDishPrice("Salad",model.dishObjectArray.SaladObject.RecipeID));
		// 	model.getDishAPI(model.selected.SaladID,function(){
		// 	var SaladName = model.getDish(model.selected.SaladID).Title;
		// 	context.addToList(SaladName,1/*model.getDishPrice(model.selected.SaladID)*/);
		// });
		}
		if (model.selected.mainDishID !== 0){
			
			this.addToList(model.dishObjectArray.mainDishObject.Title, model.getDishPrice("Main Dish",model.dishObjectArray.mainDishObject.RecipeID));
		// 	context2 = this ;
		// 	model.getDishAPI(model.selected.mainDishID,function(){
		// 	var mainName = model.getDish(model.selected.mainDishID).Title;
		// 	context2.addToList(mainName,2/*model.getDishPrice(model.selected.mainDishID)*/);
		// });
		}
		if (model.selected.dessertID !== 0){
			this.addToList(model.dishObjectArray.dessertObject.Title, model.getDishPrice("Desserts",model.dishObjectArray.dessertObject.RecipeID));
		// 	context3 = this ;
	
		// 	model.getDishAPI(model.selected.dessertID,function(){
		// 	var DessertName = model.getDish(model.selected.dessertID).Title;
		// 	context3.addToList(DessertName,3/*model.getDishPrice(model.selected.dessertID)*/);
		// });
		}
		if (parseInt(model.selected.SaladID + model.selected.mainDishID + model.selected.dessertID) == 0){
			this.addPendingLineToList();
		}
	
	}
	this.setLeftTotalPerPerson = function(){
		jQuery('#left .pricearea .perpersonpricearea p.price').html(model.getTotalPerPerson());
	}
	this.setLeftTotal = function(){
		jQuery('#left .pricearea .totalpricearea p.totalprice').html(model.getTotal());
		console.log(model.getTotal());
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
			var rowHTML = '<div class="row"><p class="quantity">'+ingredients[key].MetricQuantity*guests+" "+ingredients[key].MetricUnit+'</p><p class="what">'+ingredients[key].Name+'</p><p class="unit">SEK</p><p class="price">'+ingredients[key].Quantity*guests+'</p></div>';
			// Append it
			jQuery('.dishUI .ingredients .inglist').append(rowHTML);
			totalPersonPrice += ingredients[key].Quantity;
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
		// Salad
		if (model.selected.SaladID !== 0){
			//console.log(model.dishObjectArray.SaladObject.Title);
			jQuery("#SaladNameFRUI").html(model.dishObjectArray.SaladObject.Title);
			jQuery("#SaladDescFRUI").html(model.dishObjectArray.SaladObject.Subcategory);
			jQuery(".fullrecipeUI .element .Salad img").attr('src',model.dishObjectArray.SaladObject.ImageURL); 
		}
		if (model.selected.mainDishID !== 0){
			// Main Dish
			//console.log(model.dishObjectArray.mainDishObject.Title);
			jQuery("#mainNameFRUI").html(model.dishObjectArray.mainDishObject.Title);
			jQuery("#mainDescFRUI").html(model.dishObjectArray.mainDishObject.Subcategory);
			jQuery(".fullrecipeUI .element .main img").attr('src',model.dishObjectArray.mainDishObject.ImageURL);
		}
		if (model.selected.dessertID !== 0){
			// Dessert
			//console.log(model.dishObjectArray.dessertObject.Title);
			jQuery("#dessertNameFRUI").html(model.dishObjectArray.dessertObject.Title);
			jQuery("#dessertDescFRUI").html(model.dishObjectArray.dessertObject.Subcategory);
			jQuery(".fullrecipeUI .element .dessert img").attr('src',model.dishObjectArray.dessertObject.ImageURL);
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
		
		document.getElementById("loading").style.display="none";
   		console.log(document.getElementById("loading").style.display);
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
 
