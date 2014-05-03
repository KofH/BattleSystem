
define(function(require) {
  "use strict";
  // INCLUDES
  //	var	Backbone = require('libs/backbone');
  	
  //var EventManager = require('game-engine/EventManager'),
  //    Render = require('game-engine/Render'),
    var ViewModel = require('battle-engine/ViewModel');
  //  var Model = require('battle-engine/Model');
  /**
   * Constructor
   * @classDescription lalala
   */
  function Engine() {
    this.TIME_INTERVAL = 1000; // ms
      this._on = false;
//    this._canvas = null;
    
 //   this._evManager = new EventManager();
      this._viewModel = new ViewModel();
//    this._render = new Render(this._viewModel);
  }
  
  /********************
   * PUBLIC FUNCTIONS *
   ********************/
  /**
   * Initialize the engine
   * @param canvas
   */
  Engine.prototype.initialize = function () {
  //  this._canvas = canvas;
  //  this._render.setCanvas(this._canvas);
  //  this._evManager.setCanvas(this._canvas);
    
  //  this._configureEvents();
    setInterval(this._step.bind(this), this.TIME_INTERVAL);
	  
  };
  
  Engine.prototype.stop = function () {
    this._on = false;
    this._viewModel.stop();
  };
  
  Engine.prototype.start = function () {
    this._on = true;
    this._viewModel.start();
  };
  
  Engine.prototype.tick = function(){
	  this._on = true;
	  this._step();
	  this._on = false;
  };
  
  Engine.prototype.renderize = function () {
  //  if (!this._on) { 
  //    this._step(); 
  //  }
  };
  
  /*********************
   * PRIVATE FUNCTIONS *
   *********************/
  Engine.prototype._configureEvents = function () {
 //   this._evManager.setViewModel(this._viewModel);
  };
  
  Engine.prototype._step = function () {
    if (this._on) {
  //    this._evManager.step();
  //    this._viewModel.step();
  //    this._render.step();
    	this._viewModel.model.turn();
    	this._viewModel.model.showInfoFighters();
    	while (this._viewModel.model.activeCharacters.length > 0){
    		this.on = true;
    		console.log("combat!");
    		this._viewModel.model.active = this._viewModel.model.activeCharacters.pop();
    		this._viewModel.model.execute(this._viewModel.model);
    	}
    	this.on = false;
    }
	  
  };
  
  /**
   * End class
   */
  return Engine;
});
