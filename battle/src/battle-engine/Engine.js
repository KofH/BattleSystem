
define(function(require) {
  "use strict";
  // INCLUDES
    var View = require('battle-engine/View');
    var Simulator = require('battle-engine/Simulator');
    var infoFighters = require('battle-engine/View/infoFighters');
    var EventManager = require('battle-engine/EventManager');
		
  /**
   * Constructor
   * @classDescription 
   */
  function Engine() {
		this._view = new View();
		this._simulator = new Simulator();
		this._eventManager = new EventManager();
		this._loadingCombat = false;
  };
  
  /********************
   * PUBLIC FUNCTIONS *
   ********************/
  /**
   * Initialize the engine
   * @param 
   */
  Engine.prototype.initialize = function () {
    this._configureEvents();
    this._simulator.initialize();
    this._eventManager.dispatchEvent("initialize", {engine: this});
  };
  
  Engine.prototype.stop = function () {
    this._simulator.stop();
   	this._eventManager.dispatchEvent("stop");
  };
  
  Engine.prototype.start = function () {
    this._simulator.start();
    this._eventManager.dispatchEvent("start", {characterList: this._simulator.model.characters.characterList});
  };
  
  Engine.prototype.tick = function(){
  	 this._simulator.oneStep();
  };
  
  Engine.prototype.changeAttributeCalculation = function (attr, exp){
    this._simulator.changeAttributeCalculation(attr, exp);
  };
  
  /*********************
   * PRIVATE FUNCTIONS *
   *********************/
  
  Engine.prototype._configureEvents = function () {
    this._eventManager.addListener("start", function () { console.log("startEvent") } );
    this._eventManager.addListener("tick", function () { console.log("tickEvent") } );
    this._eventManager.addListener("inputNeeded", function () { console.log("inputNeededEvent") } );
    this._eventManager.addListener("action", function () { console.log("action") } );
    this._eventManager.addListener("outOfCombat", function () { console.log("outOfCombatEvent") } );
    this._eventManager.addListener("death", function () { console.log("deathEvent") } );
    this._eventManager.addListener("orderTactic", function () { console.log("orderTacticEvent") } );
    this._eventManager.addListener("orderAttitude", function () { console.log("orderAttitudeEvent") } );
    this._eventManager.addListener("orderFlee", function () { console.log("orderFleeEvent") } );
    this._eventManager.addListener("setting", function () { console.log("settingEvent") } );
    this._eventManager.addListener("end", function () { console.log("endEvent") } );
    this._eventManager.addListener("script", function () { console.log("scriptEvent") } );
    
    this._view._configureEvents(this._eventManager);
  }; 
  
  Engine.prototype._step = function() {
    if (this._on){
      if (this._loadingCombat) {
        this._simulator.model.spliceCombat();
        this._loadingCombat = false;
      }
    
    }
  };
  
  Engine.prototype._newCharacter = function(callback){  
    var data = callback();
    this._simulator.newCharacter(data);
    this._eventManager.dispatchEvent("newCharacter", {data: data});
  };
  
  Engine.prototype._resetCombat = function(){ 
    this._simulator.resetCombat();
    this._eventManager.dispatchEvent("reset");
  };
    
  Engine.prototype._loadCharacters = function(callback){
    var file = callback();
    this._simulator.loadCharacters(file);
  };
  
  Engine.prototype._saveCharacters = function(){  //TODO
    this._simulator.saveCharacters(file);
    this._eventManager.dispatchEvent("saveCharacters", {serialization: serialization});
  };
  
  Engine.prototype._loadCombat = function(callback){
    var file = callback();
    this._simulator.loadCombat(file);
 //   this._eventManager.dispatchEvent("turnSet", 
 //       {currentTurn: 0, turns: self._model.turns.combat.length}); 
  }
  
  Engine.prototype._saveCombat = function(){
    var serialization = this._model.getTurnsSerial();
    this._simulator.saveCombat(file);
 //   this._eventManager.dispatchEvent("saveCombat", {serialization:serialization});
  }
  
  Engine.prototype._loadWeapons = function(){
    //TODO implement>
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
  

  
  Engine.prototype._combat = function(){
    console.log("TURN!");
    this._model.active = this._model.characters.characterList.findWhere({wait: 0});
    this._model.saveCombat();
    this._eventManager.dispatchEvent("showActions", {character: this._model.active});
    console.log("What will " + this._model.active.get("name") + " do?");
    this._eventManager.dispatchEvent("inputNeeded");
  };
  

  Engine.prototype.stepSelectAction = function(btt){
    this._model.selectedAction = btt.value;
    console.log(btt.value + "  selected!");
    var target = this._model.getActionTarget();
    var characters = this._model.characters.characterList;
    var active = this._model.active;
    this._eventManager.dispatchEvent("showTargets", 
        {target: target, characters: characters, active: active});
  };
  
  Engine.prototype.stepSelectTarget = function(btt){
    this._model.selectedTarget = btt.id;
    console.log(btt.id + " selected!");
    this._model.execute();
    this._eventManager.dispatchEvent("action", 
        {characters: this._model.characters.characterList, active: this._model.active}); 
    this._on = true;
  };
  
  Engine.prototype._sliderBrowser = function(button){ 
    this._loadingCombat = true;
    this._model.browseSlider(button);
    this._eventManager.dispatchEvent("turnSet",
        {currentTurn: this._model.turns.current+1, turns: this._model.turns.combat.length});
    this._model.loadCombatTurn(this._model.turns.current);
  };

  Engine.prototype.setCurrentTurn = function(n){
    if (n >= 0 && n < this._model.turns.combat.length){
      this._model.turns.current = n;
    }
  };
  
  Engine.prototype.turnListSim = function(waitSim){
    var myChars = this._model.characters.characterList.clone(true);
    var myArray = [];
    
    while(myArray.length < 10){
      if(myChars.where({wait: 0}).length > 0){
        myArray.push(myChars.where({wait: 0})[0].get("id"));
        myChars.where({wait: 0})[0].set({wait: waitSim});
      }
      else {
        for (var i = 0; i < myChars.length; i++){
          var newWait = myChars.at(i).get("wait") - myChars.at(i).get("initiative");
          if (newWait < 0) newWait = 0;
          myChars.at(i).set({wait: newWait});
        }
      }
    };
    
    return myArray;
  };
  
  Engine.prototype.continuedCombat = function(mode){
    this._simulator._continuedCombat = mode();
  };
  
  /**
   * End class
   */
  return Engine;
});
