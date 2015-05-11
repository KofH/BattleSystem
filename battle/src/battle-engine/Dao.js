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
	
	Dao.prototype.initialize = function (model) {
		this.model = model;
		this.characters = model.characters;
		
		this.fileReader.onerror = function () { console.error("Error reading file")};

	};
	
	Dao.prototype.fileLoadCharacters = function (file) {
		var self = this;
		
		this.fileReader.onloadend = function () {
      var obj = JSON.parse(self.fileReader.result);
      for (var i = 0; i < obj.length; i++){
        self.model.newCharacter(obj[i]);
      }
		};
		this.fileReader.readAsText(file,'utf8');	
	};
	
	Dao.prototype.fileSaveCharacters = function (file) {};
	
	Dao.prototype.fileLoadCombat = function (file) {
		var self = this;
		
		this.fileReader.onloadend = function(){	//TODO
   		var obj = JSON.parse(self.fileReader.result);
      var length = obj.tick[obj.combat[0]].length;
      for (var i = 0; i < length; i++)
        self.model.newCharacter(obj.tick[obj.combat[0]][i]);
      self.model.turns.tick = self.model.characters.arrayToCollection(obj.tick);
      self.model.turns.combat = obj.combat;
      self.model.turns.current = obj.current;
    }
		
		this.fileReader.readAsText(file,'utf8');
	};
	
	Dao.prototype.fileSaveCombat = function (file) {};
	
	Dao.prototype.fileLoadWeapons = function (file) {};
	
	Dao.prototype.fileSaveWeapons = function (file) {};
	
	Dao.prototype.fileLoadArmors = function (file) {};
	
	Dao.prototype.fileSaveArmors = function (file) {};
	
	return Dao;
	
});