
define(function(require) {
  "use strict";
  // INCLUDES
    var ViewModel = require('battle-engine/ViewModel');

  /**
   * Constructor
   * @classDescription lalala
   */
  function Engine() {
	  this.TIME_INTERVAL = 1000; // ms
      this._on = false;
      this._viewModel = new ViewModel();
  }
  
  /********************
   * PUBLIC FUNCTIONS *
   ********************/
  /**
   * Initialize the engine
   * @param canvas
   */
  Engine.prototype.initialize = function () {

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
  
  };
  
  /*********************
   * PRIVATE FUNCTIONS *
   *********************/
  Engine.prototype._configureEvents = function () {
  };
  
  Engine.prototype._step = function () {
	  this._viewModel.model.showInfoFighters();
   
	  if (this._on) {
    	this._viewModel.model.turn();
    	this._viewModel.model.showInfoFighters();
    	while (this._viewModel.model.characters.where({wait: 0}).length > 0){
    		this.on = true;
    		console.log("combat!");
    		this._viewModel.model.active = this._viewModel.model.characters.findWhere({wait: 0});
    		this._viewModel.model.execute(this._viewModel.model);
    		if(this._viewModel.model.contAllies == 0 || this._viewModel.model.contEnemies == 0){
    			this.on = false
    			alert("Combat ended!!");
    			this.stop();
    		}
    	}
    	this.on = false;
    }
	  
  };
  
  /**
   * End class
   */
  return Engine;
});
