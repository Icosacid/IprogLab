jQuery(document).ready(function(){

	// Instantiate our model
	var model = new DinnerModel();
	
	//console.log(model.getNumberOfGuests());
	// Create the needed controllers and views
	//console.log(model.getTotalMenuPrice());
	var view = new View(jQuery("#whole"));
	var controller = new Controller(view,model);

	//this.g = view.find("#guest");
	$("#guest").append(model.getNumberOfGuests()); //add to be appened for the first printing of the page
	//$("#guestTotal").append(model.getNumberOfGuests()); // moved to the confirm dinner button function
	//$("#totalPrice").append(model.getTotalMenuPrice());
});