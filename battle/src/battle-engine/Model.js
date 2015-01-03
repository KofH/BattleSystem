
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
		this.turns = [];
		this.turnCount = 0;
	}
	
	/********************************
	 *       PUBLIC FUNCTIONS       *
	 ********************************/
	
  Model.prototype.loadCharacters = function(file){
    this.characters.load(file);
    return this.characters.characterList;
  };
	
	Model.prototype.saveCharacters = function(){
		var serialization = JSON.stringify(this.characters.characterList);
		var dataurl = "data:application/octet-stream;ucs2,"+ serialization;
		var x = document.getElementById("saveCharactersDownload");
		x.setAttribute("download", document.getElementById("saveCharactersFileName").value + ".txt");
		x.href = dataurl;
		x.click();
		document.getElementById('loadAndSavePrompt').classList.toggle('Displayed');
	};
	
	Model.prototype.newCharacter = function (data) {
		console.log("New Character");
		if ( (data.faction == "ally" && this.characters.contAllies < this.MAX_ALLIES) ||
		  data.faction == "enemy" && this.characters.contEnemies < this.MAX_ENEMIES) {
		   
		  this.characters.newCharacter(data);
		}
		else { console.log("Too many character of this faction!"); }
	};	
	
	Model.prototype.getCharactersSerial = function(){
	  return this.characters.stringify();
	};
	
	Model.prototype.getActionTarget = function(){
	    return this.actions.actionList.get(this.selectedAction).get("target");
	}; 
	
	Model.prototype.resetCharacters = function(){
		this.characters.reset();
	};
	
	Model.prototype.turn = function(){		
		this.characters.turn();
		this.saveTurn();
	};
	
	Model.prototype.deadFaction = function(){
	  return this.characters.deadFaction();
	}
	
	Model.prototype.execute = function(){
	  this.actions.actionList.get(this.selectedAction).get("effect", this);
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

	Model.prototype.saveTurn = function(){
	  this.turns[this.turnCount] = this.characters.characterList.clone(true);
	  this.turnCount++;
	}
	
	Model.prototype.loadTurn = function(i){
	  this.characters.characterList = this.turns[i];
	  this.turnCount = i+1;
	}
	
	/**
	 * End class
	 */
	return Model;
});