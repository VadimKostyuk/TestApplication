sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessagePopover",
	"sap/m/MessagePopoverItem"
], function(jQuery, Controller, Filter, JSONModel, MessagePopover, MessagePopoverItem) {
	"use strict";

	return Controller.extend("sap.suite.ui.commons.demokit.tutorial.icecream.01.controller.Freestyle", {
		
		mFilters: {
			accessory: [new sap.ui.model.Filter("Category", "Accessory")],
			graphicsCards: [new sap.ui.model.Filter("Category", "Graphics Card")],
			laptop: [new sap.ui.model.Filter("Category", "Laptop")],
			projector: [new sap.ui.model.Filter("Category", "Projector" )]
		},
		
		onInit: function () {
			this.oModel = new JSONModel();
			this.oModel.loadData(jQuery.sap.getModulePath("sap.suite.ui.commons.demokit.tutorial.icecream.01.model.data", "/Freestyle.json"), null, false);
			this.oSemanticPage = this.byId("mySemanticPage");
			this.oSemanticPage.setModel(this.oModel);

			var oMessageProcessor = new sap.ui.core.message.ControlMessageProcessor();
			var oMessageManager = sap.ui.getCore().getMessageManager();

			oMessageManager.registerMessageProcessor(oMessageProcessor);

			oMessageManager.addMessages(
				new sap.ui.core.message.Message({
					message: "Something wrong happened",
					type: sap.ui.core.MessageType.Error,
					processor: oMessageProcessor
				})
			);
		},

		onQuickFilter: function(oEvent) {
			var sKey = oEvent.getParameter("key"),
				oFilter = this.mFilters[sKey],
				oTable = this.byId("iconTabBar"),
				oBinding = oTable.getBinding("items");
			if (oFilter) {
				oBinding.filter(oFilter);
			} else {
				oBinding.filter([]);
			}
		},
		
		onUpdateFinished: function(oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				oModel = this.getModel(),
				oViewModel = this.getModel("freestyleView"),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
				// iterate the filters and request the count from the server
				jQuery.each(this._mFilters, function(sFilterKey, oFilter) {
					oModel.read("/ProductCollection/$count", {
						filters: oFilter,
						success: function(oData) {
							var sPath = "/" + sFilterKey;
							oViewModel.setProperty(sPath, oData);
						}
					});
				});
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},
			
		onMessagesButtonPress: function(oEvent) {
			var oMessagesButton = oEvent.getSource();

			if (!this._messagePopover) {
				this._messagePopover = new MessagePopover({
					items: {
						path: "message>/",
						template: new MessagePopoverItem({
							description: "{message>description}",
							type: "{message>type}",
							title: "{message>message}"
						})
					}
				});
				oMessagesButton.addDependent(this._messagePopover);
			}
			this._messagePopover.toggle(oMessagesButton);
		},
		
		toMainPage: function() {
			this.getRouter().navTo("home");
		},
		
		onSaveButtonPress: function(oEvent) {
			sap.m.MessageToast.show("Pressed custom button " + oEvent.getSource().getId());
		},

		showFooter: function() {
			this.oSemanticPage.setShowFooter(!this.oSemanticPage.getShowFooter());
		}
	});
});