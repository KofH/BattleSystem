define(function(require) {
	"use strict";
	// INCLUDES
//	var KeyBoardManager = require('game-engine/event-manager/KeyboardManager');
//	var MouseManager = require('game-engine/event-manager/MouseManager');

	/**
	 * Constructor
	 */
	function EventManager() {
	//	this._canvas = null;
	//	this._viewModel = null;
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
	//	this._canvas = canvas;
	//	this._keyboard.setCanvas(canvas);
	//	this._mouse.setCanvas(canvas);
	};

	EventManager.prototype.setViewModel = function(viewModel) {
	//	this._viewModel = viewModel;
	//	this._keyboard.setViewModel(viewModel);
	//	this._mouse.setViewModel(viewModel);
	};
	/********************************
	 *      PRIVATE FUNCTIONS       *
	 ********************************/

	/**
	 * End class
	 */
	return EventManager;
});
