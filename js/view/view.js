// View Object constructor
var View = function (container,model){

	model.addObserver(this);
	
	this.displayed = 0;
	
	/** In several UI **/
	this.setGuests = function(num){
		jQuery('#left p.guests').html(num);
		jQuery('#guestTotal').html(num);
	}
	
	/** Left menu UI **/
	this.addToList = function(name,price){
		var HTML = "<div class='element'><p class='name'>"+name+"</p><p class='price'>"+price+"</p></div>";
		jQuery('#left .list').append(HTML);
	}
	this.emptyList= function(){
		jQuery('#left .list').html('');
	}
	this.setLeftTotalPerPerson = function(total){
		jQuery('#left .pricearea .perpersonpricearea p.price').html(total);

	}
	this.setLeftTotal = function(total){
		jQuery('#left .pricearea .totalpricearea p.totalprice').html(total);
	}

	/** SelectDish UI **/
	this.clearBlocks = function(){
		display.html('');
	}
	this.addBlock = function(id,imgsrc,name,description){
		var blockHTML = "<div class='block id"+id+"'><img src='"+imgsrc+"' alt='"+name+"'/><p class='name'>"+name+"</p><p class='description'>"+description+"</p></div>";
		console.log("appended: ",blockHTML);
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
	this.setSummaryTotal = function(total){
		jQuery('.confirmUI .summary .totalright p.value').html(total);
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
	
		/** In several UI **/
		this.setGuests(model.getNumberOfGuests());
		
		/** Left menu UI **/
		this.setLeftTotalPerPerson(model.getTotalPerPerson());
		this.setLeftTotal(model.getTotal());
		
		/** Confirm UI **/
		this.setSummaryTotal(model.getTotal());
	}
}
 
