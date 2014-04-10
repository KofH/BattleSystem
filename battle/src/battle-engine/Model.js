
define(function(require) {
	"use strict";
	/**
	 * Constructor
	 */
	
  	var	Backbone = require('libs/backbone');
  	
  	var Character = Backbone.Model.extend({
  		initialize: function(){
  			alert("Character " + this.get("name") + " created! ");
  			
  			this.on("change:wait", function(model){
  				if(model.get("wait") <= 0){
  					alert(model.get("name") + " is ready for action!");
  					model.get("activeArray").push(model);
  				}
  			})
  		}
  	});
  	
	function Model() {
		this.MAX_ALLIES = 4;
		this.MAX_ENEMIES = 6;
		this.contAllies = 0;
		this.contEnemies = 0;
		
		this.characters = [];
		this.activeCharacters = [];
		this.active = {};
		this.actions = {
				attack: function(model){
					var target = model.searchCharacter();
					var damage = model.active.get("strength") * 2;
					alert("Damage " + damage);
					model.characters[target].set({hp: model.characters[target].get("hp") - damage});
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
							model.characters[contSearch].set({hp: characters[contSearch].get("hp")-damage});
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
		var characters;
		filereader.onloadend = function (){
			characters = [];
			characters = JSON.parse(filereader.result);
			self.contAllies = 0;
			self.contEnemies = 0;
			for (var i = 0; i < characters.length; i++){
				if (characters[i].faction == "ally")
					self.contAllies++;
				else
					self.contEnemies++;
				self.characters[i]=new Character({
					name: characters[i].name,
					strength: characters[i].strength,
					agility: characters[i].agility,
					inteligence: characters[i].inteligence,
					hp: characters[i].hp,
					wait: characters[i].wait,
					initiative: characters[i].initiative,
					offense: characters[i].offense,
					defense: characters[i].defense,
					actions: characters[i].actions,
					faction: characters[i].faction,
					activeArray: self.activeCharacters
				});
			}
			self.showInfoFighters();			
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
			var self = this;
			this.characters[this.contAllies+this.contEnemies-1] = new Character({
					name: document.getElementById('newCharacterName').value,
					strength: parseInt(document.getElementById('newCharacterStrength').value),
					agility: parseInt(document.getElementById('newCharacterAgility').value),
					inteligence: parseInt(document.getElementById('newCharacterInteligence').value),
					hp: 0,
					wait: 100,
					initiative: 0,
					offense: 0,
					defense: 0,
					actions: [],
					faction: characterFaction,
					activeArray: self.activeCharacters
			});
			
			
			this.newCharacterActions();
			this.calcSubAttributes();
			this.newCharacterPromptReset();
		}
	};	
	
	Model.prototype.fightersGenerator = function (){
		for (var fighterAlly = 1; contAllies < MAX_ALLIES; contAllies++, fighterAlly++){
			var name = "Ally" + fighterAlly;
			characters[contAllies] = {
					name: name,
					strength: 1,
					agility: 1,
					inteligence: 1,
					hp: 0,
					wait: 0,
					initiative: 0,
					attack: 0,
					defense: 0,
					faction: "ally"
			};
			calcSubAttributes();
		}
		
		for (var fighterEnemy = 1; contEnemies < MAX_ENEMIES; contEnemies++, fighterEnemy++){
			var name = "Enemy" + fighterEnemy;
	        characters[MAX_ALLIES + contEnemies] = {
	        	name: name,
	    		strength: 1,
				agility: 1,
				inteligence: 1,
				hp: 0,
				wait: 0,
				initiative: 0,
				attack: 0,
				defense: 0,
				faction: "enemy"
	        };
	        calcSubAttributes();
		}
	};
	
	Model.prototype.modifyAttributes = function () {
		var searchFighter = prompt("Which character do you want to change?"), contSearch = 0, found = true;
		while (searchFighter != this.characters[contSearch].get("name") && found) {
			if (contSearch > MAX_ALLIES + MAX_ENEMIES) { //Control de ERRORES en el caso de que no encuentre nada
				found = false;
			}		
			contSearch++
		}
		
		if (found) {
			modAttr = prompt("What Attribute do you want to modify? strength, agility or inteligence");
			this.characters[contSearch].set({modAttr: parseInt(prompt("Insert the New Value"))});
			console.log(modAttr + " for " + this.characters[contSearch].get("name") + " is now " + this.characters[contSearch].get(modAttr));
		} else {
			console.log("Fighter Not Found!")
		}
		this.calcSubAttributes();
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
			var newWait = this.characters[i].get("wait") - this.characters[i].get("initiative");
			if (newWait < 0) newWait = 0;
			this.characters[i].set({wait:newWait});
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
		var searchCharacter = prompt("Choose your target"), contSearch = 0, found = true;
		while (contSearch < this.characters.length) {
			if (searchCharacter == this.characters[contSearch].get("name")){
				return contSearch;
	        }
	        contSearch++
		}
	    return -1;
	};
	
	Model.prototype.newCharacterActions = function (){
		var contActions = 0;
		var actions = [];
		if (document.getElementById("newCharacterActionAttack").checked) {
			actions[contActions] = document.getElementById("newCharacterActionAttack").value;
			contActions++;
		}
		if (document.getElementById("newCharacterActionDefense").checked) {
			actions[contActions] = document.getElementById("newCharacterActionDefense").value;
			contActions++;
		}
		if (document.getElementById("newCharacterActionAreaAttack").checked) {
			actions[contActions] = document.getElementById("newCharacterActionAreaAttack").value;
			contActions++;
		}
		
		this.characters[this.contAllies+this.contEnemies-1].set({actions: actions});
		
	};
	

	Model.prototype.calcSubAttributes = function (){ // Función a la que llamaremos para refrescar los subatributos
		var contCalcSub = 0;
		while (contCalcSub < this.characters.length) {
			this.characters[contCalcSub].set({
				hp: this.characters[contCalcSub].get("strength") * 3,
				initiative: this.characters[contCalcSub].get("agility") * 3,
				offense: this.characters[contCalcSub].get("strength") * 5,
				defense: (this.characters[contCalcSub].get("strength") + this.characters[contCalcSub].get("agility")) * 3,
			});
			contCalcSub++;
		}
		this.showInfoFighters();
	};
	
	
	Model.prototype.showInfoFighters = function(){
		var items = document.getElementById("infoFightersContent");
		while (items.hasChildNodes()) {
			items.removeChild(items.firstChild);
		}
		for (var i = 0; i < this.characters.length; i++) {		
			
			var item = document.createElement("li");
			item.innerHTML = this.characters[i].get("name");
			
			var str = document.createElement("ul");
			str.innerHTML = "Wait: " + this.characters[i].get("wait");
			item.appendChild(str);
			items.appendChild(item);

		}
	};
	
	/**
	 * End class
	 */
	return Model;
});