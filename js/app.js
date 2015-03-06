jQuery(document).ready(function(){

	// Instantiate our model
	var model = new DinnerModel();
	
	// Create the needed controllers and views
	var view1 = new View(jQuery("#whole"),model);
	var controller1 = new Controller(view1,model);
	
});