define(function (require) {
  "use strict";
  // INCLUDES
  	var	Backbone = require('../libs/backbone');
  //var EventManager = require('game-engine/EventManager'),
  //    Render = require('game-engine/Render'),
  //    ViewModel = require('game-engine/ViewModel');
  
  /**
   * Constructor
   * @classDescription lalala
   */
  function Engine() {
    this.TIME_INTERVAL = 1000; // ms
    this._on = false;
//    this._canvas = null;
    
    this._evManager = new EventManager();
//    this._viewModel = new ViewModel();
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
 //   this._on = false;
  };
  
  Engine.prototype.start = function () {
 //   this._on = true;
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
  //  if (this._on) {
  //    this._evManager.step();
  //    this._viewModel.step();
  //    this._render.step();
  //  }
  };
  
  /**
   * End class
   */
  return Engine;
});
