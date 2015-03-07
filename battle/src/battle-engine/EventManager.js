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
		this._listeners = {};
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
    window.dispatchEvent(new Event(event, params));
  }
	
	EventManager.prototype.removeListener = function(event, func){
	  window.removeListener(event, func);
	};
	
  EventManager.prototype.initialize = function() {
    var self = this;
    this.addListener("initialize", function () { self._view.initialize(); } );
    this.addListener("startCombat", function (params) { self._view.start(); } );  
    this.addListener("stopCombat", function() { self._view.stop(); } );
    
    };
   
	/********************************
	 *      PRIVATE FUNCTIONS       *
	 ********************************/

	/**
	 * End class
	 */
	return EventManager;
});
