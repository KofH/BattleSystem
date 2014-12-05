
define(function(require) {
  "use strict";
  // INCLUDES
    var ViewModel = require('battle-engine/ViewModel');
    var Model = require('battle-engine/Model');
  /**
   * Constructor
   * @classDescription lalala
   */
  function Engine() {
	  this.TIME_INTERVAL = 1000; // ms
      this._on = false;
      this._viewModel = new ViewModel();
      this._model = new Model();
  }
  
  /********************
   * PUBLIC FUNCTIONS *
   ********************/
  /**
   * Initialize the engine
   * @param canvas
   */
  Engine.prototype.initialize = function () {
    this._interval = setInterval(this._step.bind(this), this.TIME_INTERVAL);
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
  
  Engine.prototype._newCharacterPrompt = function(){
    this._viewModel.newCharacterPrompt();
    this._viewModel.selectEquipment(this._model.weapons.weaponList,
        this._model.armors.armorList);
  }
  
  Engine.prototype._newCharacter = function(){
    var data = this._viewmodel.newCharacter();
    this._model.newCharacter(data);
    this._viewModel.characterButton(data, this._model.stepSelectTarget());
    this._viewModel.factionButton(data.faction, this._model.stepSelectTarget());
    this._viewModel.newCharacterPromptReset();
    this._viewModel.modifyCharactersDataList(this._model.characters);
  }
  
  Engine.prototype._step = function() {
    this._viewModel.showInfoFighters(this._model.characters.characterList);
    if(this._on){
      this._model.turn();
      this._viewModel.showInfoFighters(this._model.characters.characterList);
      if (this._waitCheck()){
        this._on = false;
        this._combat();
      }
    }
  }
  
  Engine.prototype._loadCharacters = function(){  //TODO filereader.onloadend() concurrency
    var characters = this._model.loadCharacters(this._viewModel.getCharactersFile());
    this._viewModel.loadCharacters(characters);
    for (var i = 0; i < characters.length; i++){
      this._viewModel.characterButton(characters.at(i).attributes, this._model.stepSelectTarget());
      this._viewModel.factionButton(characters.at(i).get("faction"), this._model.stepSelectTarget());
    }
  }
  
  Engine.prototype._saveCharacters = function(){
    var serialization = this._model.getCharactersSerial();
    this._viewModel.saveCharacters(serialization);
  }
  
  Engine.prototype._loadWeapons = function(){
    //TODO implement
    console.log("TODO loadWeapons");
  }
  
  Engine.prototype._saveWeapons = function(){
    //TODO implement
    console.log("TODO saveWeapons");
  }
  
  Engine.prototype._loadArmors = function(){
    //TODO implement
    console.log("TODO loadArmors");
  }
  
  Engine.prototype._saveArmors = function(){
    //TODO implement
    console.log("TODO saveArmors");
  }
  
  Engine.prototype.modCharactersLoadAttr = function() {
    this.model.modCharactersLoadAttr(); //TODO implement
    console.log("TODO loadAttr");
  };
  
  Engine.prototype.modCharactersSaveAttr = function() {
    this.model.modCharactersSaveAttr(); //TODO implement
    console.log("TODO saveAttr");
  };
  
  Engine.prototype._waitCheck = function(){
    return (this._model.characters.characterList.where({wait: 0}).length > 0)
  }
  
  Engine.prototype._combat = function(){
    console.log("TURN!");
    this._viewModel.model.active = this._viewModel.model.characters.findWhere({wait: 0});
    this._viewModel.model.showActiveActions();
    console.log("What will " + this._viewModel.model.active.get("name") + " do?");
  }
  
  Engine.prototype._executeAction = function(){
    this._viewModel.model.execute();
    if(this._waitCheck()){
      this._combat();
    }
    else{
      this._initialize();
    }
  }
  

  
  /**
   * End class
   */
  return Engine;
});
