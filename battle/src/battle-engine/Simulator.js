
define(function(require) {
	"use strict";

	//INCLUDES
	var CoreLoop = require('battle-engine/CoreLoop');
	var Model = require('battle-engine/Model');
  var Dao = require('battle-engine/Dao');
	var EventManager = require('battle-engine/EventManager');

	
	function Simulator() {
		this.TIME_INTERVAL = 300;
		this._on = false;
		this._interval = {};
    this._continuedCombat = false;
		
		this.coreLoop = new CoreLoop();
		this.model = new Model();
    this.dao = new Dao();
	};
	
	Simulator.prototype.initialize = function () {
		this._interval = setInterval(this.step.bind(this), this.TIME_INTERVAL);
		this.coreLoop.initialize(this.model);
    this.dao.initialize(this.model);
    this.newCharacter({
      name: "Ada",
      strength : 2,
      agility : 4,
      intelligence: 4,
      faction: "ally",
      ap: 10,
      weapon: "Shortsword",
      armor: "Leather",
      formation: "Vanguard",
      actions: ["attack"]
      });
    
    this.newCharacter({
      name: "Orc",
      strength : 3,
      agility : 3,
      intelligence: 3,
      faction: "enemy",
      ap: 10,
      weapon: "Shortsword",
      armor: "Leather",
      formation: "Vanguard",
      actions: ["attack"]
      });
	};
	
	Simulator.prototype.start = function () {
		this._on = true;
	};
	
	Simulator.prototype.stop = function () {
		this._on = false;	
	};
	
	Simulator.prototype.oneStep = function () {
		this._on = true;
  	this.step();
  	this._on = false;
	};
	
	Simulator.prototype.step = function () {
		if (this._on) {
			if (!this.model.deadFaction()){
				this._on = !this.coreLoop.step();
				console.log(this.model.characters.infoWait());
			}
			else{
				clearInterval(this._interval);
				console.log("---- END OF COMBAT ----");
			}
		}
	};
  
  Simulator.prototype.executeAction = function(action, target){
    this.coreLoop.executeAction(action, target);
    if (this._continuedCombat) this._on = true;
    else this._on = false;
  };
	 
	Simulator.prototype.newCharacter = function (characterData) {
		this.model.newCharacter(characterData);
	};
	
  Simulator.prototype.changeAttributeCalculation = function(attr, exp) {
    this.model.characters.change(attr, exp);
  };
  
  Simulator.prototype.resetCombat = function() {
    this.model.resetCombat();
  };
  
  Simulator.prototype.loadCharacters = function(file) {
    this.dao.fileLoadCharacters(file);
  };
  
  Simulator.prototype.saveCharacters = function(file) {
    this.dao.fileSaveCharacters(file)
  };
  
  Simulator.prototype.loadCombat = function(file) {
    this.dao.fileLoadCombat(file);
  };
  
  Simulator.prototype.saveCombat = function(file){
    this.dao.fileSaveCombat(file);
  };
  
	return Simulator;

});