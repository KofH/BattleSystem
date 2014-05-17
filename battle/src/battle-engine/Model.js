
define(function(require) {
	"use strict";
	/**
	 * Constructor
	 */
	
  	var	Backbone = require('libs/backbone');
  	
  	var Character = Backbone.Model.extend({
  		
  		defaults: {
			wait: 100
			},
			
  		initialize: function(model){
  			
  			{ ///////////////  Actions  /////////////////////////
  	
  				var actions = [];
  				if (document.getElementById("newCharacterActionAttack").checked) {
  					actions.push(document.getElementById("newCharacterActionAttack").value)
  				}
  				
  				if (document.getElementById("newCharacterActionDefense").checked) {
  					actions.push(document.getElementById("newCharacterActionDefense").value);
  				}
  				
  				if (document.getElementById("newCharacterActionAreaAttack").checked) {
  					actions.push(document.getElementById("newCharacterActionAreaAttack").value);
  				}
  				this.set({actions: actions});
  				
  			}
  			
  			this.set({id:this.get("name")});
  			alert("Character " + this.get("name") + " created! ");  
  			
  			//////////////////    Subattributes
  			
  			this.on("change:strength", function(character){
  				character.set({hp: character.get("strength") * 3});   	/////////////// CORRECTO
  				character.set({offense: character.get("strength") * 5}); 
  				character.set({defense: (character.get("strength") + character.get("agility")) * 3});
  			})
  			
  			this.on("change:agility", function(character){
  				character.set({initiative : character.get("agility") * 3});
  				character.set({defense: (character.get("strength") + character.get("agility")) * 3});
  			})
  			
  			this.on("change:inteligence", function(character){
  			})
  			
  			//////////////////       Turn
  			
  			this.on("change:wait", function(character){
  				if (character.get("wait")<= 0)
  					alert(character.get("name") + " is ready for action!");
  			})
  			
  			//////////////////      Death
  			this.on("change:hp", function(character){
  				if(character.get("hp") <= 0){
  					alert(character.get("name") + " has fainted!");
  					character.set({wait: Infinity});
  				}
  			})
  		}
	  	
  	});
  	
  	var Characters = Backbone.Collection.extend({
  		model: Character,  	
  	
  		initialize: function(model){   
  			
  			////////////// FUTURE USE
	  		
  			/*this.on("add", function(character){
	  		 * 
	  		});
	  		
	  		this.on("change:hp", function(character){
  				
  			});
  			
  			this.on("change:wait", function(model, character){
  				
  			});*/

  		}
  	});
  	
	function Model() {
		this.MAX_ALLIES = 4;
		this.MAX_ENEMIES = 6;
		this.contAllies = 0;
		this.contEnemies = 0;
		this.characters = new Characters();
		this.active = {};
		this.actions = {
				attack: function(model){
					var target = model.searchCharacter();
					var damage = model.active.get("strength") * 2;
					alert("Damage " + damage);
					model.characters[target].set({hp: model.characters[target].get("hp") - (damage - model.characters[target].get("defense"))});
					alert("Character HP: " + model.characters[target].get("hp"));
					model.active.set({wait: 50});
				},
				
				defPosition: function(model){
					var defense = model.active.defense + 5;
					model.active.defense = defense;
					alert("Defense: " + defense);
					model.active.wait = 20;			
				},
				
				areaAttack: function(model){
					var factionObjetiveSelected = prompt("ally or enemy");
					var factionObj;
					if (factionObjetiveSelected == "ally") {
						factionObj = model.contAllies;
					} else if (factionObjetiveSelected == "enemy"){
						factionObj = model.contEnemies;
					} else {
						alert("ERROR!");
					}
					var damage = model.active.inteligence / factionObj;
					for (var contSearch = 0; contSearch < model.characters.length; contSearch++) {
						if (model.characters[contSearch].get("faction") == factionObjetiveSelected) {
							model.characters[contSearch].set({hp: characters[contSearch].get("hp")-(damage - model.characters[contSearch].get("defense"))});
						}
					}
					alert("Area Attack!");
				}
		};

	}
	
	/********************************
	 *       PUBLIC FUNCTIONS       *
	 ********************************/
	/*Model.prototype.step = function(){
		console.log("Model  - STEP!");
	};*/
	
	Model.prototype.loadCharacters = function(){
		var filereader = new FileReader();
		var self = this;

		filereader.onloadend = function (){
			self.characters = new Characters(JSON.parse(filereader.result));
			self.contAllies = self.characters.where({faction: "ally"}).length;
			self.contEnemies = self.characters.where({faction: "enemy"}).length;
		}

		var file = document.getElementById("fileUpload").files[0];
		filereader.readAsText(file,'utf8');
	};
	
	Model.prototype.saveCharacters = function(){
		var serialization = JSON.stringify(this.characters);
		var dataurl = "data:application/octet-stream;ucs2,"+ serialization;
		window.open(dataurl);
	};
	
	Model.prototype.newCharacterPrompt = function(){
		document.getElementById('newCharacterPrompt').classList.toggle('Displayed');
		document.getElementById('newCharacterAlly').focus();
	};
	
	Model.prototype.newCharacter = function () {
		document.getElementById('newCharacterPrompt').classList.toggle('Displayed');
		console.log("New Character");
		var characterFaction;
		if (document.getElementById('newCharacterAlly').checked){
			var characterFaction = document.getElementById('newCharacterAlly').value;
		} else {
			var characterFaction = document.getElementById('newCharacterEnemy').value;
		}
		var valid = false;
		
		if (this.contAllies < this.MAX_ALLIES && characterFaction == "ally") {
			this.contAllies++;
			valid = true;
		} else if (this.contEnemies < this.MAX_ENEMIES && characterFaction == "enemy") {
			this.contEnemies++;
			valid = true;
		} else {
			alert("Too many character of this faction!");
		}
		if (valid){
			var character = new Character({
					name: document.getElementById('newCharacterName').value,
					faction: characterFaction
			});

			this.characters.add(character);
			
			character.set({
				strength: parseInt(document.getElementById('newCharacterStrength').value),
				agility: parseInt(document.getElementById('newCharacterAgility').value),
				inteligence: parseInt(document.getElementById('newCharacterInteligence').value),
			});
			
			this.newCharacterPromptReset();
		}
	};	
	
	Model.prototype.modifyAttributes = function () {
		var searchFighter = prompt("Which character do you want to change?");
		var character =  this.characters.get(searchFighter);
		
		if (character != undefined) {
			modAttr = prompt("What Attribute do you want to modify? strength, agility or inteligence");
			character.set({modAttr: parseInt(prompt("Insert the New Value"))});
			console.log(modAttr + " for " + character.get("name") + " is now " + character.get(modAttr));
		} else {
			console.log("Fighter Not Found!")
		}
	};
	
	
	Model.prototype.test = function(){
		document.getElementById('newCharacterPrompt').classList.toggle('Displayed');
	};
	
	
	Model.prototype.newCharacterPromptReset = function (){
		if (document.getElementById("newCharacterAlly").checked){
			document.getElementById("newCharacterAlly").checked = false;
		}else if (document.getElementById("newCharacterEnemy").checked){
			document.getElementById("newCharacterEnemy").checked = false;
		}
		document.getElementById("newCharacterName").value = "";
		document.getElementById("newCharacterStrength").value = "";
		document.getElementById("newCharacterAgility").value = "";
		document.getElementById("newCharacterInteligence").value = "";
		document.getElementById("newCharacterActionAttack").checked = false;
		document.getElementById("newCharacterActionDefense").checked = false;
		document.getElementById("newCharacterActionAreaAttack").checked = false;
	};
	
	Model.prototype.turn = function(){
		for (var i = 0; i < this.characters.length; i++){
			var newWait = this.characters.at(i).get("wait") - this.characters.at(1).get("initiative");
			if (newWait < 0) newWait = 0;
			this.characters.at(i).set({wait:newWait});
		}
		
	}
	
	Model.prototype.execute = function(model){
		var selectedAction = prompt(model.active.get("name") + "! Select an action to perform: " +
				this.active.get("actions").toString());
		this.actions[selectedAction](model);
	}
	
	/********************************
	 *      PRIVATE FUNCTIONS       *
	 ********************************/
	
	Model.prototype.searchCharacter = function(){
		var searchCharacter = prompt("Choose your target");
	    return this.characters.get(searchCharacter);
	};
	
	
	Model.prototype.showInfoFighters = function(){
		var items = document.getElementById("infoFightersContent");
		while (items.hasChildNodes()) {
			items.removeChild(items.firstChild);
		}
		for (var i = 0; i < this.characters.length; i++) {		
			
			var item = document.createElement("li");
			item.innerHTML = this.characters.at(i).get("name");
			
			var str = document.createElement("ul");
			str.innerHTML = "Wait: " + this.characters.at(i).get("wait");
			item.appendChild(str);
			items.appendChild(item);

		}
	};
	
	/**
	 * End class
	 */
	return Model;
});