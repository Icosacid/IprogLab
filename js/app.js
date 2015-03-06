jQuery(document).ready(function(){

	// Instantiate our model
	var model = new DinnerModel();
	
	//console.log(model.getNumberOfGuests());
	// Create the needed controllers and views
	//console.log(model.getTotalMenuPrice());
	var view1 = new View(jQuery("#whole"),model);
	var controller = new Controller(view1,model);

	//this.g = view.find("#guest");
	$("#guest").append(model.getNumberOfGuests()); //add to be appened for the first printing of the page
	//$("#guestTotal").append(model.getNumberOfGuests()); // moved to the confirm dinner button function
	//$("#totalPrice").append(model.getTotalMenuPrice());
});