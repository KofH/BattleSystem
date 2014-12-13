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
	  if (!this._listeners[event]) this._listeners[event] = [];
	  if (func instanceof Function) this._listeners[event].push(func);
	  return this;
	}
	
	EventManager.prototype.dispatchEvent = function(event, params){
	  for(var i = 0, l = this._listeners[event].length; i < l; i++){
	    this._listeners[event][i].call(this._view,params);   
	  }
	}
	
	EventManager.prototype.removeListener = function(event, func){
	  if(this.listeners[event]){
	    for(var i = 0, l = this._listeners[event].length; i < l; i++){
	      if(this._listeners[event][i] === func){
	        this.listeners[event].slice(i,l);
	        break;
	      }
	    }
	  }
	};
	
  EventManager.prototype.initialize = function() {
    this.addListener("buttonLoadAndSave", this._view.loadSavePrompt)
    this.addListener("buttonNewCharacter", this._view.newCharacterPrompt);      //FIXME engine
    this.addListener("buttonModifyAttributes", this._view.modifyCharactersPrompt);
    this.addListener("buttonResetCharacters", this._view.askReset);             //FIXME asking
    this.addListener("buttonStart", this._view.start);                          //FIXME .on
    this.addListener("buttonStop", this._view.stop);                            //FIXME .on
    this.addListener("buttonStep", this._view.step);                             //FIXME tick unuse
    //this.addListener("newCharacterNext",   TODO lot of view calls 
    this.addListener("newCharacterReset", this._view.newCharacterPromptReset);
    this.addListener("buttonLoadCharacters", this._view.loadCharacters);        //FIXME characters args
    this.addListener("buttonSaveCharacters", this._view.saveCharacters);        //FIXME serialization args
    //this.addListener("buttonLoadWeapons"                                      //TODO
    //this.addListener("buttonSaveWeapons"                                      //TODO
    //this.addListener("buttonLoadArmors"                                       //TODO
    //this.addListener("buttonSaveArmors"                                       //TODO
    //this.addListener("modifyCharacterSubmit"                                    //TODO                                    
    //this.addListener("modifyCharacterClose"                                     //TODO
   };
	/********************************
	 *      PRIVATE FUNCTIONS       *
	 ********************************/

	/**
	 * End class
	 */
	return EventManager;
});
