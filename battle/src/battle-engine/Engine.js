
define(function(require) {
  "use strict";
  // INCLUDES
    var View = require('battle-engine/View');
    var Model = require('battle-engine/Model');
    var EventManager = require('battle-engine/EventManager');
  /**
   * Constructor
   * @classDescription 
   */
  function Engine() {
	  this.TIME_INTERVAL = 300; // ms
      this._on = false;
      this._view = new View();
      this._model = new Model();
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
		this._interval = setInterval(this._step.bind(this), this.TIME_INTERVAL);
    this._eventManager.dispatchEvent("initialize", {engine: this});
  };
  
  Engine.prototype.stop = function () {
    this._on = false;
    this._eventManager.dispatchEvent("stopCombat");
  };
  
  Engine.prototype.start = function () {
    this._on = true;
    this._eventManager.dispatchEvent("startCombat");
  };
  
  Engine.prototype.tick = function(){
  	 this._on = true;
  	 this._step();
  	 this._on = false;
  };
  
  Engine.prototype.changeCharacters = function (attr, exp){
    this._model.characters.change(attr, exp);
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
  
  Engine.prototype._configureEvents = function () {
    this._eventManager.setView(this._view);
    this._eventManager.initialize();
  }; 
  
  
  Engine.prototype._step = function() {
    if (this._on){

      if (this._loadingCombat) {
        this._model.spliceCombat();
        this._loadingCombat = false;
      }
      
      if(this._model.deadFaction()){
        this._model.saveCombat();
        this._eventManager.dispatchEvent("combatTurnSet", 
            {currentTurn: this._model.turns.combat.length, turns: this._model.turns.combat.length});
        console.log("--- END OF COMBAT ---");
        $.snackbar({content: "COMBAT ENDED!"});
        this._on = false;
      }
      
      else if (this._waitCheck()){
        this._eventManager.dispatchEvent("stopCombat");
        this._on = false;
        this._combat();
        this._view.step(this._model);
        this._eventManager.dispatchEvent("combatTurnSet", 
            {currentTurn: this._model.turns.combat.length, turns: this._model.turns.combat.length});
      }
      
      else{
        this._model.turn();
        this._view.step(this._model);
      }
    }
  };
  
  Engine.prototype._newCharacterPrompt = function(){   //TODO to view
    this._view.newCharacterPrompt();  
    this._view.selectEquipment(this._model.weapons.weaponList,
    this._model.armors.armorList);
  };
  
  Engine.prototype._newCharacter = function(callback){  //TODO refactor needed
    var data = callback();
    this._model.newCharacter(data);
//    this._view.characterButton(data, this.stepSelectTarget);
//    this._view.factionButton(data.faction, this.stepSelectTarget);
//    this._view.newCharacterPromptReset();
//    this._view.modifyCharactersDataList(this._model.characters);
    
    this._eventManager.dispatchEvent("newCharacter", {data: data, call: this.stepSelectTarget});
    
  };
  
  Engine.prototype._loadCharacters = function(callback){
    var file = callback();
    this._model.loadCharacters(file);
  };
  
  Engine.prototype._resetCombat = function(){ //TODO refactor needed
    if(this._view.askReset()) this._model.resetCombat();
    this._view.step(this._model);
  };
  
  Engine.prototype._saveCharacters = function(){
    var serialization = this._model.getCharactersSerial();
  //  this._view.saveCharacters(serialization);
    this._eventManager.dispatchEvent("saveCharacters", {serialization: serialization });
  };
  
  Engine.prototype._loadCombat = function(){
    this._model.loadTurns(this._view.getCombatFile(), console.log("loadTurns Callback"));
  }
  
  Engine.prototype._saveCombat = function(){
    var serialization = this._model.getTurnsSerial();
    this._view.saveTurns(serialization);
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
  
  Engine.prototype._waitCheck = function(){
    return (this._model.characters.characterList.where({wait: 0}).length > 0)
  };
  
  Engine.prototype._combat = function(){
    console.log("TURN!");
    this._model.active = this._model.characters.characterList.findWhere({wait: 0});
    this._model.saveCombat();
    this._eventManager.dispatchEvent("combatShowActions", {character: this._model.active});
    console.log("What will " + this._model.active.get("name") + " do?");
  };
  

  Engine.prototype.stepSelectAction = function(btt){
    this._model.selectedAction = btt.value;
    console.log(btt.value + "  selected!");
    var target = this._model.getActionTarget();
    var characters = this._model.characters.characterList;
    var active = this._model.active;
    this._eventManager.dispatchEvent("combatShowTargets", 
        {target: target, characters: characters, active: active});
  };
  
  Engine.prototype.stepSelectTarget = function(btt){
    this._model.selectedTarget = btt.id;
    console.log(btt.id + " selected!");
    this._model.execute();
    this._view.showInfoFighters(this._model.characters.characterList);
    this._eventManager.dispatchEvent("combatExecuteAction", 
        {characters: this._model.characters.characterList, active: this._model.active}); 
    this._on = true;
  };
  
  Engine.prototype._sliderBrowser = function(button){
    this._loadingCombat = true;
    this._model.browseSlider(button);
    this._eventManager.dispatchEvent("combatTurnSet",
        {currentTurn: this._model.turns.current+1, turns: this._model.turns.combat.length});
    this._model.loadCombatTurn(this._model.turns.current);
    this._view.showInfoFighters(this._model.characters.characterList);
  };

  Engine.prototype.setCurrentTurn = function(n){
    if (n >= 0 && n < this._model.turns.combat.length){
      this._model.turns.current = n;
    }
  };
  
  /**
   * End class
   */
  return Engine;
});
