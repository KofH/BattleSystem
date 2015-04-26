define(function(require) {
	"use strict";
	
	//INCLUDES
	var Model = require('battle-engine/Model');
	var Characters = require('battle-engine/Characters/Characters');
	
	function Dao() {
		this.fileReader = new FileReader();
		this.model = {};
		this.characters = {};
	};
	
	Dao.prototype.setModel = function (model) {
		this.model = model;
	};
	
	Dao.prototype.setCharacters = function (characters) {
		this.characters = characters;
	};
	
	Dao.prototype.initialize = function (model, characters) {
		this.model = model;
		this.characters = characters;
		
		this.fileReader.onerror = function () { console.error("Error reading file")};

	};
	
	Dao.prototype.fileLoadCharacters = function (file) {
		var characters = this.characters;
		this.filereader.onload = function () {
			characters.defaultCharacterList = new CharacterList(JSON.parse(filereader.result));
      characters.characterList = self.defaultCharacterList.clone(true);
		/*
    if(Bview != undefined)
			for (var i = 0; i < self.characterList.length; i++)
				new Bview({model: self.characterList.at(i)});
		//*/
		};

		filereader.readAsText(file,'utf8');	
	};
	
	Dao.prototype.fileSaveCharacters = function (data, file) {};
	
	Dao.prototype.fileLoadCombat = function (file) {
		var model = this.model;
		
		filereader.onloadend = function(){	//TODO
   		var obj = JSON.parse(filereader.result);
      var length = obj.tick[obj.combat[0]].length;
      for (var i = 0; i < length; i++)
        model.newCharacter(obj.tick[obj.combat[0]][i]);
      model.turns.tick = model.characters.arrayToCollection(obj.tick);
      model.turns.combat = obj.combat;
      model.turns.current = obj.current;
    }
		
		filereader.readAsText(file,'utf8');
	};
	
	Dao.prototype.fileSaveCombat = function (data, file) {};
	
	Dao.prototype.fileLoadWeapons = function (file) {};
	
	Dao.prototype.fileSaveWeapons = function (data, file) {};
	
	Dao.prototype.fileLoadArmors = function (file) {};
	
	Dao.prototype.fileSaveArmors = function (data, file) {};
	
	return Dao;
	
});