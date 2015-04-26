
define(function(require) {
	"use strict";

	//INCLUDES
	
	
	function CoreLoop(){
		this.model = {};
		this._ready = false;
	};
	
	CoreLoop.prototype.initialize = function (model) {
		this.model = model;
		this._ready = false;
	};
	
	CoreLoop.prototype.setModel = function (model) {
		this.model = model;
	};
	
	CoreLoop.prototype.step = function () {
		if (this.model.waitCheck()){
			this.turnReady();
		}
		else{
			this.model.turn();
		}
	
		return this._ready;
	};
	
	CoreLoop.prototype.turnReady = function () {
		this.model.setActive();
		this.model.saveCombat();
		this._ready = true;
	};
	
	CoreLoop.prototype.executeAction = function (action, target) {
		if(this._ready){
			this.model.selectedAction = action;
			this.model.selectedTarget = target;
			this.model.execute();
			this._ready = false;
		}
	};
	
	return CoreLoop;

});