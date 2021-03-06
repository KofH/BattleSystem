
define(function(require) {
	"use strict";
	
  	var	Backbone = require('libs/backbone');
  	var Weapons = require('battle-engine/Items/Weapons');
  	var Armors = require('battle-engine/Items/Armors');
  	var Actions = require('battle-engine/Actions/Actions');
  	var Characters = require('battle-engine/Characters/Characters');
    var Bview = require('battle-engine/View/infoFighters');
  	
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
	
  Model.prototype.loadCharacters = function(file){
    this.characters.load(file, Bview);
  };
  
  Model.prototype.loadTurns = function(file, eventCall){
    var filereader = new FileReader();
    var self = this;
    
    filereader.onloadend = function(){
      var obj = JSON.parse(filereader.result);
      var length = obj.tick[obj.combat[0]].length;
      for (var i = 0; i < length; i++)
        self.newCharacter( obj.tick[obj.combat[0]][i] );
      
      self.turns.tick = self.characters.arrayToCollection(obj.tick);
      self.turns.combat = obj.combat;
      self.turns.current = obj.current;
      eventCall();
    }
    filereader.readAsText(file, 'utf8');
  }

	Model.prototype.newCharacter = function (data) {
		console.log("New Character");
		if ( (data.faction == "ally" && this.characters.contAllies() < this.MAX_ALLIES) ||
		  data.faction == "enemy" && this.characters.contEnemies() < this.MAX_ENEMIES) {
			var char = this.characters.newCharacter(data);
			new Bview({model: char});
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
    this.saveTick();
		this.characters.turn();
	};
	
	Model.prototype.waitCheck = function(){
		return this.characters.waitCheck();
	};
	
	Model.prototype.deadFaction = function(){
	  return this.characters.deadFaction();
	}
	
	Model.prototype.setActive = function(){
		this.active = this.characters.getCharacter({wait:0});	
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
	    this.characters.characterList.set(this.turns.tick[i].models);
	};
	
	Model.prototype.saveCombat = function(){
    this.saveTick();
	  this.turns.combat[this.turns.combat.length] = this.turns.tick.length -1;
    this.turns.current++;
	};
	
	Model.prototype.spliceCombat = function(combatTurn){
	  if(combatTurn < this.turns.combat.length){
	    this.turns.tick.splice(this.turns.combat[combatTurn] + 1, this.turns.tick.length);
	    this.turns.combat.splice(combatTurn, this.turns.combat.length);
      this.turns.current = combatTurn - 1;
      var models = this.turns.tick[this.turns.tick.length -1].models;
      this.characters.characterList.set(models);
	   }
	};
	
	/**
	 * End class
	 */
	return Model;
});