
define(function(require) {
	"use strict";
	
  	var	Backbone = require('libs/backbone');
  	var Weapons = require('battle-engine/Items/Weapons');
  	var Armors = require('battle-engine/Items/Armors');
  	var Actions = require('battle-engine/Actions/Actions');
  	var Characters = require('battle-engine/Characters/Characters');
  	
  /**
	 * Constructor
	 */
	function Model() {
		this.MAX_ALLIES = 4;
		this.MAX_ENEMIES = 6;

		this.characters = new Characters();
		this.weapons = new Weapons();
		this.armors = new Armors();
		this.actions = new Actions();
		
		this.active = {};
		this.selectedAction = "";
		this.selectedTarget = "";

		this.turns = {
		  tick: [],
		  tickCount: 0,
		  combat: [],
		  combatCount: 0, 
		  current: 0
		};
	}
	
	/********************************
	 *       PUBLIC FUNCTIONS       *
	 ********************************/
  
  Model.prototype.browseSlider = function(buttonValue){
    switch(buttonValue){
        case "sliderFirstTurn":
        this.turns.current = 1
        this.loadCombatTurn(this.turns.current)
        break;
        
        case "sliderPreviousTurn":
        if(this.turns.current != 1){
        this.turns.current--
        this.loadCombatTurn(this.turns.current)
        }
        break;
        
        case "sliderNextTurn":
        if (this.turns.current != this.turns.combat.length){
        this.turns.current++
        this.loadCombatTurn(this.turns.current)
        }
        break;
        
        case "sliderLastTurn":
        this.turns.current = this.turns.combat.length
        this.loadCombatTurn(this.turns.current)
        console.log(buttonValue)
        break;
    }
  };
	
  Model.prototype.loadCharacters = function(file, callback){
    this.characters.load(file, callback);
  };
  
  Model.prototype.loadTurns = function(file, callback){
    var filereader = new FileReader();
    var self = this;
    
    filereader.onloadend = function(){
      self.turns = JSON.parse(filereader.result);
      //TODO CALLBACK
    }
    filereader.readAsText(file, 'utf8');
  }

	Model.prototype.newCharacter = function (data) {
		console.log("New Character");
		if ( (data.faction == "ally" && this.characters.contAllies() < this.MAX_ALLIES) ||
		  data.faction == "enemy" && this.characters.contEnemies() < this.MAX_ENEMIES) {
		   
		  this.characters.newCharacter(data);
		}
		else { console.log("Too many character of this faction!"); }
	};	
	
	Model.prototype.getCharactersSerial = function(){
	  return this.characters.stringify();
	};
	
	Model.prototype.getTurnsSerial = function(){
	  return JSON.stringify(this.turns);
	};
	
	Model.prototype.getActionTarget = function(){
    return this.actions.actionList.get(this.selectedAction).get("target");
	}; 
	
	Model.prototype.resetCharacters = function(){
		this.characters.reset();
	};
	
	Model.prototype.turn = function(){		
		this.characters.turn();
		this.saveTick();
	};
	
	Model.prototype.deadFaction = function(){
	  return this.characters.deadFaction();
	}
	
	Model.prototype.execute = function(){
	  this.actions.actionList.get(this.selectedAction).get("effect", this);
	  this.saveTick();
	};

	/*  /////NOT IN USE////
	
	Model.prototype.modCharactersLoadAttr = function(){ //TODO to View
		for (var i = 0; i < this.characters.length; i++) {
			if (document.getElementById("modifyCharacterSelected").value == this.characters.at(i).get("name")) {
				document.getElementById("modCharactersStrength").value = this.characters.at(i).get("strength");
				document.getElementById("modCharactersAgility").value = this.characters.at(i).get("agility");
				document.getElementById("modCharactersInteligence").value = this.characters.at(i).get("inteligence");
				document.getElementById("modCharactersAP").value = this.characters.at(i).get("ap");
			}
		}
	};

	Model.prototype.modCharactersSaveAttr = function(){ //TODO to View(data)
		this.characters.get(document.getElementById("modifyCharacterSelected").value).set({strength: parseInt(document.getElementById("modCharactersStrength").value)});
		this.characters.get(document.getElementById("modifyCharacterSelected").value).set({agility: parseInt(document.getElementById("modCharactersAgility").value)});
		this.characters.get(document.getElementById("modifyCharacterSelected").value).set({inteligence: parseInt(document.getElementById("modCharactersInteligence").value)});
		this.characters.get(document.getElementById("modifyCharacterSelected").value).set({ap: parseInt(document.getElementById("modCharactersAP").value)});
		document.getElementById('modifyCharactersPrompt').classList.toggle('Displayed');
	};
	//*/
	
	
	/********************************
	 *      PRIVATE FUNCTIONS       *
	 ********************************/
	
	Model.prototype.searchCharacter = function(){
		var searchCharacter = prompt("Choose your target");
	  return this.characters.get(searchCharacter);
	};

	Model.prototype.saveTick = function(){
	  this.turns.tick[this.turns.tickCount] = this.characters.characterList.clone(true);
	  this.turns.tickCount++;
	  this.turns.actual = this.turns.tickCount;
	}
  
  Model.prototype.loadCombatTurn = function(currentTurn){
    var tick = this.turns.combat[currentTurn - 1];
    this.loadTick(tick);
  };
	
	Model.prototype.loadTick = function(i){
	  this.characters.characterList = this.turns.tick[i];
	  this.turns.tickCount = i+1;
	  this.turns.actual = this.turns.tickCount;
	}
	
	Model.prototype.saveCombat = function(){
	  this.turns.combat[this.turns.combatCount] = this.turns.tick.length -1;
	  this.turns.combatCount++;
    this.turns.current++;
	}
	
	/**
	 * End class
	 */
	return Model;
});