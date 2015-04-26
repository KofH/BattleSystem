
define(function(require) {
	"use strict";

	//INCLUDES
	
	
	function CoreLoop(){
		this.model = {};
		this.eventManager = {};
	};
	
	CoreLoop.prototype.initialize = function (model, eventManager) {
		this.model = model;
		this.eventManager = eventManager;
		//this._configureEvents();
	};
	
	CoreLoop.prototype.setModel = function (model) {
		this.model = model;
	};
	
	CoreLoop.prototype.setEventManager = function (eventManager) {
		this.eventManager = evenManager;
	};
	
	CoreLoop.prototype._configureEvents = function () {
		
	};
	
	CoreLoop.prototype.step = function () {
		if(this.model.deadFaction()){
			console.log("--- END OF COMBAT ---");
			return false;
		}
		
		else if (this.model.waitCheck()){
			this.combat();
			return false;
		}
		
		else{
			this.model.turn();
		}
		
		return true;
	};
	
	CoreLoop.prototype.combat = function () {
		this.model.setActive();
		this.model.saveCombat();
	};
	
	CoreLoop.prototype.executeAction = function (action, target) {
		this.model.selectedAction = action;
		this.model.selectedTarget = target;
		this.model.execute();
	};
	
	return CoreLoop;

});