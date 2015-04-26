
define(function(require) {
	"use strict";

	//INCLUDES
	var CoreLoop = require('battle-engine/CoreLoop');
	var Model = require('battle-engine/Model');
	var EventManager = require('battle-engine/EventManager');

	
	function Simulator() {
		this.TIME_INTERVAL = 300;
		this._on = false;
		this._interval = {};
		
		this.coreLoop = new CoreLoop();
		this.model = new Model();
		this.eventManager = new EventManager();
	};
	
	Simulator.prototype.initialize = function () {
		this._interval = setInterval(this.step.bind(this), this.TIME_INTERVAL);
		this.coreLoop.initialize(this.model, this.eventManager);
	};
	
	Simulator.prototype.start = function () {
		this._on = true;
	};
	
	Simulator.prototype.stop = function () {
		this._on = false;	
	};
	
	Simulator.prototype.oneStep = function () {
		this._on = true;
  	this.step();
  	this._on = false;
	};
	
	Simulator.prototype._configureEvents = function () {
		
	};
	
	Simulator.prototype.step = function () {
		if (this._on) 
			this.on = this.coreLoop.step();
	};
	
	Simulator.prototype.newCharacter = function (characterData) {
		this.model.newCharacter(characterData);
	};
	
	return Simulator;

});