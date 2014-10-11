
define(function(require) {
  "use strict";
	// INCLUDES
	var Model = require('battle-engine/Model');
	
	/**
	 * Constructor
	 */
	function ViewModel() {
		this.model = new Model();
	}
	
	/********************************
	 *       PUBLIC FUNCTIONS       *
	 ********************************/
	/*ViewModel.prototype.step = function(){
		this.model.step();
		console.log("ViewModel - STEP!");
	};*/
		ViewModel.prototype.newCharacterPrompt = function(){
			this.model.newCharacterPrompt();
		};
		
		ViewModel.prototype.loadAndSavePrompt = function(){
			this.model.loadAndSavePrompt();
		};
		
		ViewModel.prototype.modifyCharactersPrompt = function(){
			this.model.modifyCharactersPrompt();
		};
		
		ViewModel.prototype.saveCharacters = function(){
			this.model.saveCharacters();
		};
		
		ViewModel.prototype.loadCharacters = function(){
			this.model.loadCharacters();
		};
		
		ViewModel.prototype.newCharacter = function(){
			this.model.newCharacter();
		};
		
		ViewModel.prototype.newCharacterPromptReset = function(){
			this.model.newCharacterPromptReset();
		};
		
		ViewModel.prototype.stop = function(){
			document.getElementById("buttonStop").style.background="#F00";
			document.getElementById("buttonStart").style.background="#CCC";
		};
		
		ViewModel.prototype.start = function(){
			document.getElementById("buttonStop").style.background="#CCC";
			document.getElementById("buttonStart").style.background="#0F0";
		};
		
		ViewModel.prototype.modCharactersLoadAttr = function(){
			this.model.modCharactersLoadAttr();
		};
		ViewModel.prototype.modCharactersSaveAttr = function(){
			this.model.modCharactersSaveAttr();
		};
	/**
	 * End class
	 */
	return ViewModel;
});
