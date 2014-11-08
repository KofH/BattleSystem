
define(function(require) {
	"use strict";
	/**
	 * Constructor
	 */
	
  	var	Backbone = require('libs/backbone');
  	var Weapons = require('battle-engine/Items/Weapons');
  	var Armors = require('battle-engine/Items/Armors');
  	var Actions = require('battle-engine/Actions/Actions');

 // 	var _calculated = function(thing){return thing};
 // 	_calculated._isCalculated = true;
  	
  	var Character = Backbone.Model.extend({
  	  
  	  get: function(attr) {                  ////////////// Backbone getter fix
  	     /// && value._isCalculated
  	    var value = Backbone.Model.prototype.get.call(this, attr);
  	      return _.isFunction(value) ? value.call(this) : value;
  	    },
  	 
  		defaults: {
  			wait: 100,
  			weapon: "",
  			armor: "",
  			actions: []
			},
			
  		initialize: function(model){
  			
  			{ ///////////////  Actions  /////////////////////////
  	
  				var actions = [];
  				if (document.getElementById("newCharacterActionAttack").checked) {
  					actions.push(document.getElementById("newCharacterActionAttack").value)
  				}
  				else if (this.get("actions").indexOf("attack") >= 0){
  				  actions.push("attack");
  				}
					
  				if (document.getElementById("newCharacterActionDefense").checked) {
  					actions.push(document.getElementById("newCharacterActionDefense").value);
  				}
  				else if (this.get("actions").indexOf("defPosition") >= 0){
  				  actions.push("defPosition");
  				}
  				
  				if (document.getElementById("newCharacterActionAreaAttack").checked) {
  					actions.push(document.getElementById("newCharacterActionAreaAttack").value);
  				}
  				else if (this.get("actions").indexOf("areaAttack") >= 0){
  				  actions.push("areaAttack");
  				}
  				
  				if (document.getElementById("newCharacterActionChangeFormation").checked) {
            actions.push(document.getElementById("newCharacterActionChangeFormation").value);
          }
          else if (this.get("actions").indexOf("changeFormation") >= 0){
            actions.push("changeFormation");
          }
  				this.set({actions: actions});
  				
  			}
  			
  			{//////////////////// FORMATION ////////////////////
  			  
  			  if (document.getElementById('newCharacterVanguard').checked)
  			    this.set({formation:"vanguard"});
  			  else
  			    this.set({formation:"rearguard"});
  			}
  			
  			{//////////////////// INVENTORY ////////////////////
  				
  				if (this.get("weapon") === "") {
  					this.set({weapon: document.getElementById("weaponList").value});
  				}
  				
  				if (this.get("armor") === ""){
  					this.set({armor: document.getElementById("armorList").value});
  				}
  				
  			}
  			
  			this.set({id:this.get("name")});
  		//	alert("Character " + this.get("name") + " created! ");
  			
  			
  			//////////////////    Subattributes
  			
  			var self = this;

        this.set({
          
          maxHp: function (){
            return this.get("strength") * 3;
          },
          
          initiative: function (){
           return  this.get("agility") * 3;
          },
          
          offense: function (){
           return this.get("strength") * 5;
          },
          
          defense: function (){
            return this.get("strength") + this.get("agility") * 3;
          }
        });
        
  			this.set({
  			  hp: function (){
            return this.get("maxHp");
  			  }
  			});
  			//////////////////       Turn
  			
  			/*this.on("change:wait", function(character){
  				if (character.get("wait")<= 0)
  					alert(character.get("name") + " is ready for action!");
  			})*/
  			
  			//////////////////      Death
  			this.on("change:hp", function(character){
  				if(character.get("hp") <= 0){
  					console.log(character.get("name") + " has fainted!");
  					character.set({wait: Infinity});
  				}
  			});
  			{//////////////////		Show Target Character
  				if (document.getElementById(this.get("name")) == null) {
  					var allies = document.getElementById("targetCharactersAlly");
  	  				var enemies = document.getElementById("targetCharactersEnemy");
  	  				
  	  				var input = document.createElement("input");
  	  				input.type = "button";
  	  				input.id = this.get("id");
  	  				input.value = this.get("name");
  	  				input.name = this.get("name");
  	  				input.setAttribute("class","targetCharacters");
  	  				input.setAttribute("disabled",true);
  	  				input.onclick = engine._viewModel.model.stepSelectTarget;
  	  				
  	  				if(this.get("faction") == "ally"){
  	  					allies.appendChild(input);
  	  				}
  	  				else {
  	  					enemies.appendChild(input);
  	  				}
  				}
  			}
  			{//////////////////		Show Faction Buttons
  				if (document.getElementById("factionAlly") == null) {
  					var targetAllies = document.getElementById("targetFactions");
  					
  					var input = document.createElement("input");
  					input.type = "button";
  					input.id = "factionAlly";
  					input.value = "Allies";
  					input.name = "ally";
  					input.setAttribute("class","targetCharacters");
  					input.setAttribute("disabled",true);
  					input.onclick = engine._viewModel.model.stepSelectTarget;
  					
  					targetAllies.appendChild(input);
  					
  				} else if (document.getElementById("factionEnemy") == null) {
  					var targetEnemies = document.getElementById("targetFactions");
  					
  					var input = document.createElement("input");
  					input.type = "button";
  					input.id = "factionEnemy";
  					input.value = "Enemies";
  					input.name = "enemy";
  					input.setAttribute("class","targetCharacters");
  					input.setAttribute("disabled",true);
  					input.onclick = engine._viewModel.model.stepSelectTarget;
  					
  					targetEnemies.appendChild(input);
  					
  				}
  			}
  		}
	  	
  	});
  	
  	var Characters = Backbone.Collection.extend({
  		model: Character,  
  		
      clone: function(deep) {            ///////// Backbone deep cloning fix
        if(deep) {
          return new this.constructor(_.map(this.models, function(m) { return m.clone(); }));
        }else{
          return Backbone.Collection.prototype.clone();
        }
      },
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
		this.defaultCharacters = new Characters();
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
	
	Model.prototype.loadCharacters = function(){
		var filereader = new FileReader();
		var self = this;

		filereader.onloadend = function (){
			self.defaultCharacters = new Characters(JSON.parse(filereader.result));
			self.characters = self.defaultCharacters.clone(true); 
			
			self.contAllies = self.characters.where({faction: "ally"}).length;
			self.contEnemies = self.characters.where({faction: "enemy"}).length;
			self.modifyCharactersDataList();
		}

		var file = document.getElementById("fileUploadCharacters").files[0];
		filereader.readAsText(file,'utf8');
		document.getElementById('loadAndSavePrompt').classList.toggle('Displayed');
	};
	
	Model.prototype.loadAndSavePrompt = function(){
		document.getElementById('loadAndSavePrompt').classList.toggle('Displayed');
	};
	
	Model.prototype.saveCharacters = function(){
		var serialization = JSON.stringify(this.characters);
		var dataurl = "data:application/octet-stream;ucs2,"+ serialization;
		var x = document.getElementById("saveCharactersDownload");
		x.setAttribute("download", document.getElementById("saveCharactersFileName").value + ".txt");
		x.href = dataurl;
		x.click();
		document.getElementById('loadAndSavePrompt').classList.toggle('Displayed');
	};
	
	Model.prototype.newCharacterPrompt = function(){
		this.newCharacterPromptReset();
		document.getElementById('newCharacterPrompt').classList.toggle('Displayed');
		document.getElementById('newCharacterAlly').focus();
		this.selectEquipment();
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
			console.log("Too many character of this faction!");
		}
		if (valid){
			var character = new Character({
					name: document.getElementById('newCharacterName').value,
					faction: characterFaction
			});

			character.set({
				strength: parseInt(document.getElementById('newCharacterStrength').value),
				agility: parseInt(document.getElementById('newCharacterAgility').value),
				inteligence: parseInt(document.getElementById('newCharacterInteligence').value),
				ap: parseInt(document.getElementById('newCharacterAP').value),
			});
			
			this.defaultCharacters.add(character);
      this.characters.add(character.clone());
			
			this.newCharacterPromptReset();
			this.modifyCharactersDataList();
		}
	};	
	
	Model.prototype.resetCharacters = function(){
		if (confirm('Are you sure you want to Reset Characters?')) {
			this.characters = this.defaultCharacters.clone(true);
		}	  
	};
	
	Model.prototype.modifyCharactersPrompt = function(){
		document.getElementById('modifyCharactersPrompt').classList.toggle('Displayed');
		document.getElementById('modifyCharacterSelected').focus();
		
	};
	
	/*         /////   NOT IN USE
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
	}; */
	
	
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
		document.getElementById("newCharacterAP").value = "";
		document.getElementById("newCharacterActionAttack").checked = false;
		document.getElementById("newCharacterActionDefense").checked = false;
		document.getElementById("newCharacterActionAreaAttack").checked = false;
		document.getElementById("weaponList").value = "";
		document.getElementById("armorList").value = "";
	};
	
	Model.prototype.turn = function(){
		for (var i = 0; i < this.characters.length; i++){
			var newWait = this.characters.at(i).get("wait") - this.characters.at(i).get("initiative");
			if (newWait < 0) newWait = 0;
			this.characters.at(i).set({wait:newWait});
		}
		this.saveTurn();
	};
	
	Model.prototype.selectTargetButtonEnable = function(x){
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
	
	Model.prototype.modCharactersLoadAttr = function(){
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
	Model.prototype.modCharactersSaveAttr = function(){
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
	
	
	Model.prototype.showInfoFighters = function(){
		var allies = document.getElementById("infoFightersAllies");
		var enemies = document.getElementById("infoFightersEnemies");
		
		while (allies.hasChildNodes()) {
			allies.removeChild(allies.firstChild);
		}
		while (enemies.hasChildNodes()) {
			enemies.removeChild(enemies.firstChild);
		}
		for (var i = 0; i < this.characters.length; i++) {		
			
			var item = document.createElement("li");
			item.innerHTML = this.characters.at(i).get("name");
			
			var str = document.createElement("ul");
			str.innerHTML = "Strength: " + this.characters.at(i).get("strength");
			item.appendChild(str);
			
			var agi = document.createElement("ul");
			agi.innerHTML = "Agility: " + this.characters.at(i).get("agility");
			item.appendChild(agi);
			
			var int = document.createElement("ul");
			int.innerHTML = "Inteligence: " + this.characters.at(i).get("inteligence");
			item.appendChild(int);
			
						
			var hp = document.createElement("ul");
			hp.innerHTML = "HP: " + this.characters.at(i).get("hp");
			hp.style.color="#088A08";
			item.appendChild(hp);
			
			var ap = document.createElement("ul");
			ap.innerHTML = "AP: " + this.characters.at(i).get("ap");
			ap.style.color="#2E2EFE";
			item.appendChild(ap);
			
			var wait = document.createElement("ul");
			wait.innerHTML = "Wait: " + this.characters.at(i).get("wait");
			wait.style.color="#8A0886";
			item.appendChild(wait);
			
			if (this.characters.at(i).get("faction") == "ally") {
				allies.appendChild(item);
			}
			else {
				enemies.appendChild(item);
			}
		}
	};
	
	Model.prototype.modifyCharactersDataList = function(){
		var x = document.getElementById("modifyCharactersList");
		while (x.hasChildNodes()){
			x.removeChild(x.firstChild);
		}
		
		for(var i = 0; i < this.characters.length; i++){
			var opt = document.createElement('option');
			opt.innerHTML = this.characters.at(i).get("name");
			opt.value = opt.innerHTML;
			x.appendChild(opt);
		}
	};

	Model.prototype.selectEquipment = function(){
		var weaponSelect = document.getElementById('weaponSelect');
		while (weaponSelect.hasChildNodes()) {
			weaponSelect.removeChild(weaponSelect.firstChild);
		}
		while (armorSelect.hasChildNodes()) {
			armorSelect.removeChild(armorSelect.firstChild);
		}
		
		for(var i = 0; i < this.weapons.weaponList.length; i++) {
		    var opt = document.createElement('option');
		    opt.innerHTML = this.weapons.weaponList.at(i).get("name");
		    opt.value = opt.innerHTML;
		    weaponSelect.appendChild(opt);
		}
		for(var i = 0; i < this.armors.armorList.length; i++) {
		    var opt = document.createElement('option');
		    opt.innerHTML = this.armors.armorList.at(i).get("name");
		    opt.value = opt.innerHTML;
		    armorSelect.appendChild(opt);
		}
	};
	
	Model.prototype.showActiveActions = function(){
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
	  this.turns[this.turnCount] = this.characters.clone(true);
	  this.turnCount++;
	}
	
	Model.prototype.loadTurn = function(i){
	  this.characters = this.turns[i];
	  this.turnCount = i;
	}
	
	/**
	 * End class
	 */
	return Model;
});