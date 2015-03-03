
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
		  combat: [],
		  current: -1
		};
	}

	/********************************
	 *       PUBLIC FUNCTIONS       *
	 ********************************/
  
  Model.prototype.browseSlider = function(buttonValue){
    switch(buttonValue){
        case "sliderFirstTurn":
        this.turns.current = 0
        break;
        
        case "sliderPreviousTurn":
        if(this.turns.current > 0)
          this.turns.current--
        break;
        
        case "sliderNextTurn":
        if (this.turns.current < this.turns.combat.length-1)
          this.turns.current++
        break;
        
        case "sliderLastTurn":
        this.turns.current = this.turns.combat.length-1
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
	
	Model.prototype.resetCombat = function(){
		this.characters.reset();
		this.turns = {
	      tick: [],
	      combat: [],
	      current: -1
	    };
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

	
	/********************************
	 *      PRIVATE FUNCTIONS       *
	 ********************************/
	
	Model.prototype.searchCharacter = function(){
		var searchCharacter = prompt("Choose your target");
	  return this.characters.get(searchCharacter);
	};

	Model.prototype.saveTick = function(){
	  this.turns.tick[this.turns.tick.length] = this.characters.characterList.clone(true);
	}
  
  Model.prototype.loadCombatTurn = function(currentTurn){
    var tick = this.turns.combat[currentTurn];
    this.loadTick(tick);
  };
	
	Model.prototype.loadTick = function(i){
	  if (this.turns.tick[i] != undefined)
	    this.characters.characterList = this.turns.tick[i].clone(true);
	};
	
	Model.prototype.saveCombat = function(){
	  this.turns.combat[this.turns.combat.length] = this.turns.tick.length -1;
    this.turns.current++;
	};
	
	Model.prototype.spliceCombat = function(){
	  if(this.turns.current < this.turns.combat.length){
	    this.turns.tick.splice(this.turns.combat[this.turns.current] + 1, this.turns.tick.length);
	    this.turns.combat.splice(this.turns.current, this.turns.combat.length);
      this.turns.current--;
	   }
	};
	
	/**
	 * End class
	 */
	return Model;
});