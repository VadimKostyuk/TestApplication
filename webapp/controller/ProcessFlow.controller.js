sap.ui.define (["sap/ui/core/mvc/Controller"], 
function(Controller) {
	"use sctric";
	
	return Controller.extend("sap.suite.ui.commons.demokit.tutorial.icecream.01.controller.ProcessFlow", {
		
		onNavButtonPressed: function() {
			this.getOwnerComponent().getRouter().navTo("home");	
		}
	});
});