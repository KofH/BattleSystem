
define(function(require) {
	"use strict";

	/**
	 * Constructor
	 */
	
  	var	Backbone = require('libs/backbone');
  	var Weapons = require('battle-engine/Items/Weapons');
  	var Armors = require('battle-engine/Items/Armors');
  	var Actions = require('battle-engine/Actions/Actions');
  	var Characters = require('battle-engine/Characters/Characters');
 // 	var _calculated = function(thing){return thing};
 // 	_calculated._isCalculated = true;
  	
  
  	
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
  }
	
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
		if ( (data.faction == "ally" && characters.contAllies < this.MAX_ALLIES) ||
		  data.faction == "enemy" && characters.contEnemies < this.MAX_ENEMIES) {
		   
		  characters.newCharacter(data);
		}
		else { console.log("Too many character of this faction!"); }
		
	};	
	
	Model.prototype.getCharactersSerial = function(){
	  return this.characters.stringify();
	};
	
	
	Model.prototype.resetCharacters = function(){
		if (confirm('Are you sure you want to Reset Characters?')) {
			this.characters.reset();
		}	  
	};

	
	Model.prototype.turn = function(){		
		this.characters.turn();
		this.saveTurn();
	};
	
	
	Model.prototype.selectTargetButtonEnable = function(x){ //TODO to viewmodel
		var target = this.actions.actionList.get(this.selectedAction).get("target");
		
		if (target === "character"){
			for (var i = 0; i < x.characters.length; i++) {
				document.getElementById(x.characters.at(i).get("name")).disabled = false;
			}
		}
		else if (target === "faction"){
			document.getElementById("factionAlly").disabled = false;
			document.getElementById("factionEnemy").disabled = false;
		}
		else if (target === "self"){
			document.getElementById(this.active.get("name")).disabled = false;
		}
	};
	
	Model.prototype.execute = function(x){
	  this.actions.actionList.get(this.selectedAction).get("effect", x);
	}
	
	/*Model.prototype.execute = function(model){
		var selectedAction = prompt(model.active.get("name") + "! Select an action to perform: " +
				this.active.get("actions").toString());
		this.actions.actionList.get(selectedAction).get("effect", model);
	};*/
	
	Model.prototype.modCharactersLoadAttr = function(){ //TODO to viewmodel
		for (var i = 0; i < this.characters.length; i++) {
			if (document.getElementById("modifyCharacterSelected").value == this.characters.at(i).get("name")) {
				document.getElementById("modCharactersStrength").value = this.characters.at(i).get("strength");
				document.getElementById("modCharactersAgility").value = this.characters.at(i).get("agility");
				document.getElementById("modCharactersInteligence").value = this.characters.at(i).get("inteligence");
				document.getElementById("modCharactersAP").value = this.characters.at(i).get("ap");
			}
		}
	};
	/**
	 * 
	 */
	Model.prototype.modCharactersSaveAttr = function(){ //TODO to viewmodel(data)
		this.characters.get(document.getElementById("modifyCharacterSelected").value).set({strength: parseInt(document.getElementById("modCharactersStrength").value)});
		this.characters.get(document.getElementById("modifyCharacterSelected").value).set({agility: parseInt(document.getElementById("modCharactersAgility").value)});
		this.characters.get(document.getElementById("modifyCharacterSelected").value).set({inteligence: parseInt(document.getElementById("modCharactersInteligence").value)});
		this.characters.get(document.getElementById("modifyCharacterSelected").value).set({ap: parseInt(document.getElementById("modCharactersAP").value)});
		document.getElementById('modifyCharactersPrompt').classList.toggle('Displayed');
	};
	
	/********************************
	 *      PRIVATE FUNCTIONS       *
	 ********************************/
	
	Model.prototype.searchCharacter = function(){
		var searchCharacter = prompt("Choose your target");
	    return this.characters.get(searchCharacter);
	};

	Model.prototype.showActiveActions = function(){ //TODO to viewmodel
		var div = document.getElementById("actionButtons");
		while(div.hasChildNodes()){
			div.removeChild(div.firstChild);
		}
		var title = document.createElement("h2");
		title.innerHTML = "What will " + this.active.get("name") + " do?";
		div.appendChild(title);
		
		for( var i = 0; i < this.active.get("actions").length; i++){
			var input = document.createElement("input");
			input.type = "button";
			input.value = this.active.get("actions")[i];
			input.onclick = this.stepSelectAction;
			div.appendChild(input);
		}
	};
	
	Model.prototype.stepSelectAction = function(){
		var x = engine._viewModel.model;
		x.selectedAction = this.value;
		console.log(this.value + "  selected!");
		
		engine._viewModel.model.selectTargetButtonEnable(x);
	};
	
	Model.prototype.stepSelectTarget = function(){
		var x = engine._viewModel.model;
		x.selectedTarget = this.id;
		console.log(this.id + " selected!");
		
		for (var i = 0; i < x.characters.length; i++) {
			document.getElementById(x.characters.at(i).get("name")).disabled = true;
		}
		document.getElementById("factionAlly").disabled = true;
		document.getElementById("factionEnemy").disabled = true;
		
		var div = document.getElementById("actionButtons");
		while(div.hasChildNodes()){
			div.removeChild(div.firstChild);
		}
		
		x.execute(x);
		x.showInfoFighters();
		
		if(engine._waitCheck()) { engine._combat(); }
		else { engine._on = true; }
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