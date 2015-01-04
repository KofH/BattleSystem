
define(function(require) {
  "use strict";
  // INCLUDES
    var View = require('battle-engine/View');
    var Model = require('battle-engine/Model');
//    var EventManager = require('battle-engine/EventManager');
  /**
   * Constructor
   * @classDescription 
   */
  function Engine() {
	  this.TIME_INTERVAL =300; // ms
      this._on = false;
      this._view = new View();
      this._model = new Model();
//      this._eventManager = new EventManager();
  };
  
  /********************
   * PUBLIC FUNCTIONS *
   ********************/
  /**
   * Initialize the engine
   * @param 
   */
  Engine.prototype.initialize = function () {
    this._view.initialize(this);
    this._interval = setInterval(this._step.bind(this), this.TIME_INTERVAL);
   // this._configureEvents();
  };
  
  Engine.prototype.stop = function () {
    this._on = false;
    this._view.stop();
  };
  
  Engine.prototype.start = function () {
    this._on = true;
    this._view.start();
  };
  
  Engine.prototype.tick = function(){
  	  this._on = true;
  	  this._step();
  	  this._on = false;
  };
  /*
  Engine.prototype.renderize = function () {
  
  };
  //*/
 /* Engine.prototype.click = function(btt){
    this._eventManager.dispatchEvent(btt.id);
  };
  //*/
  
  /*********************
   * PRIVATE FUNCTIONS *
   *********************/
  /*
  Engine.prototype._configureEvents = function () {
    this._eventManager.setView(this._view);
    this._eventManager.initialize();
  }; 
  //*/
  
  Engine.prototype._step = function() {
    if (this._on){
      if(this._model.deadFaction()){
        console.log("--- END OF COMBAT ---");
				$.snackbar({content: "COMBAT ENDED!"});
        this._on = false;
      }
      else if (this._waitCheck()){
        this._view.stop();
        this._on = false;
        this._combat();
        this._view.step(this._model);
        this._view.setTurn(this._model.turns.combatCount);
      }
      else{
        this._model.turn();
        this._view.step(this._model);
      }
    }
  };
  
  Engine.prototype._newCharacterPrompt = function(){
    this._view.newCharacterPrompt();
    this._view.selectEquipment(this._model.weapons.weaponList,
    this._model.armors.armorList);
  };
  
  Engine.prototype._newCharacter = function(){
    var data = this._view.newCharacter();
    this._model.newCharacter(data);
    this._view.characterButton(data, this.stepSelectTarget);
    this._view.factionButton(data.faction, this.stepSelectTarget);
    this._view.newCharacterPromptReset();
    this._view.modifyCharactersDataList(this._model.characters);
  };
  
  Engine.prototype._loadCharacters = function(){  
    this._model.loadCharacters(this._view.getCharactersFile(), this._view.showInfoFighters);
  };
  
  Engine.prototype._resetCharacters = function(){
    if(this._view.askReset()) this._model.resetCharacters();
    this._view.step(this._model);
  };
  
  Engine.prototype._saveCharacters = function(){
    var serialization = this._model.getCharactersSerial();
    this._view.saveCharacters(serialization);
  };
  
  Engine.prototype._loadWeapons = function(){
    //TODO implement
    console.log("TODO loadWeapons");
  };
  
  Engine.prototype._saveWeapons = function(){
    //TODO implement
    console.log("TODO saveWeapons");
  };
  
  Engine.prototype._loadArmors = function(){
    //TODO implement
    console.log("TODO loadArmors");
  };
  
  Engine.prototype._saveArmors = function(){
    //TODO implement
    console.log("TODO saveArmors");
  };
  
  
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
  };
  
  Engine.prototype._combat = function(){
    console.log("TURN!");
    this._model.active = this._model.characters.characterList.findWhere({wait: 0});
    this._model.saveCombat();
    this._view.showActiveActions(this._model.active);
    console.log("What will " + this._model.active.get("name") + " do?");
  };
  

  Engine.prototype.stepSelectAction = function(btt){
    this._model.selectedAction = btt.value;
    console.log(btt.value + "  selected!");
    var target = this._model.getActionTarget();
    var characters = this._model.characters.characterList;
    var active = this._model.active;
    this._view.selectTargetButtonEnable(target, characters, active);
  };
  
  Engine.prototype.stepSelectTarget = function(btt){
    this._model.selectedTarget = btt.id;
    console.log(btt.id + " selected!");
    this._view.disableButtons(this._model.characters.characterList);
    this._model.execute();
    this._view.showInfoFighters(this._model.characters.characterList);
  };

 
  /**
   * End class
   */
  return Engine;
});
