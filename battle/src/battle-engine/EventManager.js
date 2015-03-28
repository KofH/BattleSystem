define(function(require) {
	"use strict";
	// INCLUDES
//	var KeyBoardManager = require('game-engine/event-manager/KeyboardManager');
//	var MouseManager = require('game-engine/event-manager/MouseManager');

	/**
	 * Constructor
	 */
	function EventManager() {
//		this._canvas = null;
		this._view = null;
	//	this._keyboard = new KeyBoardManager();
	//	this._mouse = new MouseManager();
	}

	/********************************
	 *     PUBLIC FUNCTIONS         *
	 ********************************/
	EventManager.prototype.step = function() {
		console.log("EventMan - STEP!");
	//	this._keyboard.step();
	//	this._mouse.step();
	};

	EventManager.prototype.setCanvas = function(canvas) {
		this._canvas = canvas;
	//	this._keyboard.setCanvas(canvas);
	//	this._mouse.setCanvas(canvas);
	};

	EventManager.prototype.setView = function(view) {
		this._view = view;
	//	this._keyboard.setview(View);
	//	this._mouse.setview(View);
	};
	
	EventManager.prototype.addListener = function(event, func){
	  window.addEventListener(event, func);
	}
	
  EventManager.prototype.dispatchEvent = function(event, params){
    var ev = new Event(event);
    ev.params = params;
    window.dispatchEvent(ev);
  }
	
	EventManager.prototype.removeListener = function(event, func){
	  window.removeListener(event, func);
	};
	
  EventManager.prototype.initialize = function() {
    var self = this;
    this.addListener("initialize", function (ev) { self._view.initialize(ev); } );
    this.addListener("startCombat", function () { self._view.start(); } );  
    this.addListener("stopCombat", function () { self._view.stop(); } );
   
    this.addListener("combatTurnSet", function (ev) { self._view.sliderBrowser(ev); } );
    this.addListener("combatShowActions", function (ev) { self._view.showActiveActions(ev); } );
    this.addListener("combatShowTargets", function (ev) { self._view.selectTargetButtonEnable(ev); } );
    this.addListener("combatExecuteAction", function (ev) { self._view.disableButtons(ev); } );
    
    //this.addListener("newCharacter", function (ev) {};
    
    this.addListener("start", function () { console.log("startEvent") } );
    this.addListener("tick", function () { console.log("tickEvent") } );
    this.addListener("inputNeeded", function () { console.log("inputNeededEvent") } );
    this.addListener("action", function () { console.log("action") } );
    this.addListener("outOfCombat", function () { console.log("outOfCombatEvent") } );
    this.addListener("death", function () { console.log("deathEvent") } );
    this.addListener("orderTactic", function () { console.log("orderTacticEvent") } );
    this.addListener("orderAttitude", function () { console.log("orderAttitudeEvent") } );
    this.addListener("orderFlee", function () { console.log("orderFleeEvent") } );
    this.addListener("setting", function () { console.log("settingEvent") } );
    this.addListener("end", function () { console.log("endEvent") } );
    this.addListener("script", function () { console.log("scriptEvent") } );
  };
  
	
	/********************************
	 *      PRIVATE FUNCTIONS       *
	 ********************************/

	/**
	 * End class
	 */
	return EventManager;
});
