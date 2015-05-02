
define(function(require) {
  "use strict";

  /**
   * Constructor
   */	
  function View() {
    this._buttonAction = function(){};
    this._buttonTarget = function(){};
		this._active = "";
  };
 /*****************************************************************************
   * PUBLIC FUNCTIONS *
   ****************************************************************************/
  
   View.prototype.step = function(model){
	 };

  View.prototype.initialize = function(params){
    var self = this;
		var engine = params.engine;
    this._buttonAction = engine.stepSelectAction.bind(engine);
    this._buttonTarget = engine.stepSelectTarget.bind(engine);
//    this.selectEquipment(engine._model.weapons.weaponList,
//						 engine._model.armors.armorList);
//    this.selectActions(engine._model.actions.actionList);
    document.getElementById("buttonResetCombat").onclick = function() {
      if (self.askReset()) engine._resetCombat (engine);
    };
    document.getElementById("buttonStart").onclick = engine.start.bind(engine);
    document.getElementById("buttonStop").onclick = engine.stop.bind(engine);
    document.getElementById("buttonStep").onclick = engine.tick.bind(engine);
    document.getElementById("newCharacterNext").onclick = engine._newCharacter.bind(engine, function(){ return self.newCharacter(); });
    document.getElementById("newCharacterReset").onclick = this.newCharacterPromptReset;
    document.getElementById("buttonLoadCharacters").onclick = engine._loadCharacters.bind(engine, function() { return self.getCharactersFile(); });
    document.getElementById("buttonSaveCharacters").onclick = engine._saveCharacters.bind(engine);
    document.getElementById("buttonLoadCombat").onclick = engine._loadCombat.bind(engine, function() { return self.getCombatFile(); });
    document.getElementById("buttonSaveCombat").onclick = engine._saveCombat.bind(engine);
    document.getElementById("sliderFirstTurn").onclick = engine._sliderBrowser.bind(engine, "sliderFirstTurn");
    document.getElementById("sliderPreviousTurn").onclick = engine._sliderBrowser.bind(engine, "sliderPreviousTurn");
    document.getElementById("sliderNextTurn").onclick = engine._sliderBrowser.bind(engine, "sliderNextTurn");
    document.getElementById("sliderLastTurn").onclick = engine._sliderBrowser.bind(engine, "sliderLastTurn");
    document.getElementById("continuedCombat").onclick = engine.continuedCombat.bind(engine, function() {return self.get("continuedCombat").checked});
    
		$(function () {
  		$('[data-toggle="tooltip"]').tooltip()
		});
		
	  $('#slider-step').noUiSlider({
		  start: [ 0 ],
		  step: 1,
		  range: {
			  'min': [ 0 ],
			  'max': [ 0 ]
		  },
			format: wNumb({
				decimals: 0,
			}),
	  });
	  
	  $('#slider-step').on({
	    slide: function() { 
	      engine._loadingCombat  = true;
	      engine.setCurrentTurn(parseInt(document.getElementById("slider-step-value").value - 1));
	      engine._model.loadCombatTurn(engine._model.turns.current);
	    }
	  });
	  
	  $('#slider-step').Link('lower').to($('#slider-step-value'));
  };
	
	View.prototype._configureEvents = function (eventManager){
    var self = this;
    eventManager.addListener("initialize", function (ev) { self.initialize(ev.detail); } );
    eventManager.addListener("start", function (ev) { 
      self.start();
      self.generateButtons(ev.detail);
    });  
    eventManager.addListener("stop", function () { self.stop(); } );
    eventManager.addListener("turnSet", function (ev) { self.sliderBrowser(ev.detail); } );
    eventManager.addListener("showActions", function (ev) { self.showActiveActions(ev.detail); } );
    eventManager.addListener("showTargets", function (ev) { self.selectTargetButtonEnable(ev.detail); } );
    eventManager.addListener("action", function (ev) { self.disableButtons(ev.detail); } );
    eventManager.addListener("newCharacter", function (ev) {
      self.newCharacterPromptReset();
      self.characterButton(ev.detail);
      self.factionButton(ev.detail.data.faction);
    });
    
    eventManager.addListener("saveCharacters", function (ev) { self.saveCharacters(ev.detail)} );
    eventManager.addListener("saveCombat", function (ev) { self.saveTurns(ev.detail)} );
	}
  
  View.prototype.get = function(param){
    return document.getElementById(param);
  };
  
  View.prototype.askReset = function(){
    return confirm('Are you sure you want to Reset the Combat?');
  };
  
  View.prototype.generateButtons = function(params){
    var characters = params.characterList;
    for (var i = 0; i < characters.length; i++){
      this.characterButton({data: characters.at(i).attributes});
      this.factionButton({faction: characters.at(i).get("faction")});
    }
  };
  
   View.prototype.sliderBrowser = function(params){
     var currentTurn = params.currentTurn;
     var turns = params.turns;
    var value = document.getElementById("slider-step-value").value;
    $('#slider-step').noUiSlider({
      range: {
        'min': [ 1 ],
        'max': [ turns ]
      },
      start: [ currentTurn ]
    }, true);
    document.getElementById("slider-step-value").value = currentTurn;
  };
  
  View.prototype.selectEquipment = function(weapons, armors) {
    var weaponSelect = document.getElementById('weaponSelect'); //Can be omitted?
    var armorSelect = document.getElementById('armorSelect');   //Can be omitted?
    while (weaponSelect.hasChildNodes()) {
      weaponSelect.removeChild(weaponSelect.firstChild);
    }
    while (armorSelect.hasChildNodes()) {
      armorSelect.removeChild(armorSelect.firstChild);
    }
    
    for(var i = 0; i < weapons.length; i++) {
        var opt = document.createElement('option');
        opt.innerHTML = weapons.at(i).get("name");
        opt.value = opt.innerHTML;
        weaponSelect.appendChild(opt);
    }
    for(var i = 0; i < armors.length; i++) {
        var opt = document.createElement('option');
        opt.innerHTML = armors.at(i).get("name");
        opt.value = opt.innerHTML;
        armorSelect.appendChild(opt);
    }
  };
  
  View.prototype.selectActions = function(actionsList){
    var actionSelect = document.getElementById('actionSelect');

    for(var i = 0; i < actionsList.length; i++){
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.value = actionsList.at(i).get('name');
      input.id = actionsList.at(i).get('name');
      
      var label = document.createElement('label');
      label.innerHTML = actionsList.at(i).get('name');
      label.setAttribute('class', 'col-xs-4 col-sm-4 col-md-4 col-lg-4');
      
      var spanRipple = document.createElement('span');
      spanRipple.setAttribute('class','ripple')
      var span = document.createElement('span');
      span.setAttribute('class','check');
      
      actionSelect.appendChild(label);
      label.appendChild(input);
      label.insertBefore(span, label.childNodes[0]);
      label.insertBefore(spanRipple, label.childNodes[0]);
      label.insertBefore(input, label.childNodes[0]);
      
    }
  };
  
  View.prototype.newCharacterPromptReset = function() { //TODO
    if (document.getElementById("newCharacterAlly").checked) {
      document.getElementById("newCharacterAlly").checked = false;
    } else if (document.getElementById("newCharacterEnemy").checked) {
      document.getElementById("newCharacterEnemy").checked = false;
    }
    document.getElementById("newCharacterName").value = "";
    document.getElementById("newCharacterStrength").value = "";
    document.getElementById("newCharacterAgility").value = "";
    document.getElementById("newCharacterIntelligence").value = "";
    document.getElementById("newCharacterAP").value = "";
  };

  View.prototype.newCharacterPrompt = function() {
    this.newCharacterPromptReset();
    document.getElementById('newCharacterAlly').focus();
  };
  
  View.prototype.modifyCharactersPrompt = function() {
    document.getElementById('modifyCharacterSelected').focus();
  };

  View.prototype.saveCharacters = function(params) {
    var serialization = params.serialization;
    var dataurl = "data:application/octet-stream;ucs2,"+ serialization;
    var x = document.getElementById("saveCharactersDownload");
    x.setAttribute("download", document.getElementById("saveCharactersFileName").value + ".txt");
    x.href = dataurl;
    x.click();
		$.snackbar({content: "Characters saved as " + document.getElementById("saveCharactersFileName").value + ".txt"});
  };
  
  View.prototype.saveTurns = function(params){
    var serialization = params.serialization
    var dataurl = "data:application/octet-stream;ucs2,"+ serialization;
    var x = document.getElementById("saveCombatDownload");
    x.setAttribute("download", document.getElementById("saveCombatFileName").value + ".txt");
    x.href = dataurl;
    x.click();
    $.snackbar({content: "Turns saved as " + document.getElementById("saveCharactersFileName").value + ".txt"});
  }

  View.prototype.newCharacter = function() {
    var data = {};
    data.name = document.getElementById('newCharacterName').value;    //NAME
    if (document.getElementById('newCharacterAlly').checked){       //FACTION
      data.faction = document.getElementById('newCharacterAlly').value;
    } else {
      data.faction = document.getElementById('newCharacterEnemy').value;
    }
    data.strength = parseInt(document.getElementById('newCharacterStrength').value);  //STR
    data.agility = parseInt(document.getElementById('newCharacterAgility').value);   //AGI
    data.intelligence = parseInt(document.getElementById('newCharacterIntelligence').value); //INT
    data.ap = parseInt(document.getElementById('newCharacterAP').value);          //AP
    
    data.weapon = document.getElementById("weaponSelect").value;  //WEAPON
    data.armor = document.getElementById("armorSelect").value;   //ARMOR
    
    if (document.getElementById('newCharacterVanguard').checked)  //FORMATION
      data.formation = "vanguard";
    else
      data.formation = "rearguard";
    
    data.actions = this.getSelectedActions();                      //ACTIONS
    
		$.snackbar({content: data.name + " created!"});
    return data;
  };
  
  View.prototype.showActiveActions = function(params){ 
    var character = params.character;
    var div = document.getElementById("actionButtons");
    while(div.hasChildNodes()){
      div.removeChild(div.firstChild);
    }
    var title = document.createElement("h2");
    title.innerHTML = "What will " + character.get("name") + " do?";
    $.snackbar({content: "What will " + character.get("name") + " do?"	});
    div.appendChild(title);
    
    for( var i = 0; i < character.get("actions").length; i++){
      var input = document.createElement("a");
			var aContent = document.createTextNode(character.get("actions")[i]);
      input.href = "javascript:void(0);";
      input.value = character.get("actions")[i];
			input.setAttribute("class","btn btn-default btn-raised margin5");
      input.onclick = this._buttonAction.bind(input, input);
			input.appendChild(aContent);
      div.appendChild(input);
    };
  };
  
  View.prototype.characterButton = function(params){
    var data = params.data;
    if (document.getElementById(data.name) == null) {
      var allies = document.getElementById("targetCharactersAlly");
      var enemies = document.getElementById("targetCharactersEnemy");
        
      var input = this.createBtt(data.name, data.name, data.name);
        if(data.faction == "ally"){
          allies.appendChild(input);
        }
        else {
          enemies.appendChild(input);
        }
    }
  };
  
  View.prototype.drawTurnList = function(array){
    var div = document.getElementById('turnList');
    
    while(div.hasChildNodes()){
      div.removeChild(div.firstChild);
    }
    
    var list = document.createElement('ul');
    list.setAttribute('class','noPadding');
    list.setAttribute('style','list-style-type: none;');
    
    for(var i = 0; i < array.length; i++){
      var item = document.createElement('li');
      item.appendChild(document.createTextNode(array[i]));
      list.appendChild(item);
    }
    
    div.appendChild(list);
  };
  
  View.prototype.factionButton = function(params){
    var faction = params.faction;
    if (faction == "ally" && document.getElementById("factionAlly") == null){
      var targetAllies = document.getElementById("targetFactions");
      targetAllies.appendChild(this.createBtt("factionAlly", "Allies", "ally"));
    }
    else if (faction == "enemy" && document.getElementById("factionEnemy") == null){
      var targetEnemies = document.getElementById("targetFactions");
      targetEnemies.appendChild(this.createBtt("factionEnemy", "Enemies", "enemy"));
    }
  };
  
  View.prototype.createBtt = function(id, val, name) {
    var input = document.createElement("a");
		var aContent = document.createTextNode(name);
    input.href = "javascript:void(0);";
    input.id = id;
    input.value = val;
    input.name = name;
    input.setAttribute("class","btn btn-default btn-raised margin5");
		input.setAttribute("disabled",true);
    input.onclick = this._buttonTarget.bind(input,input);
		input.appendChild(aContent);
		input.onmouseover = function(){
			if(document.getElementById("Info" + name).getAttribute("class") == "defaultCharacter sample shadow-z-1"){
				document.getElementById("Info" + name).setAttribute("class","onMouseOverCharacter sample shadow-z-2");
			};
		};
    input.onmouseout = function(){
			if(document.getElementById("Info" + name).getAttribute("class") == "onMouseOverCharacter sample shadow-z-2"){
				document.getElementById("Info" + name).setAttribute("class","defaultCharacter sample shadow-z-1");
			};
		};
    return input;
  };
  
  View.prototype.getSelectedActions = function(){  //TODO PROCEDURAL
    var actions = [];
    var x = document.getElementById('actionSelect');
    
    for(var i = 0; i < x.childElementCount ; i++){
      if (x.childNodes[i].firstChild.checked){
        actions.push(x.childNodes[i].firstChild.value)
      };
    };
    return actions;
  };

  View.prototype.modifyCharactersDataList = function(characters){ 
    var x = document.getElementById("modifyCharacterSelected");
    while (x.hasChildNodes()){
      x.removeChild(x.firstChild);
    }
    
    for(var i = 0; i < characters.length; i++){
      var opt = document.createElement('option');
      opt.innerHTML = characters.at(i).get("name");
      opt.value = opt.innerHTML;
      x.appendChild(opt);
    }
  };

  View.prototype.stop = function() {
		document.getElementById("buttonStop").setAttribute("class","btn btn-danger noMargin");
		document.getElementById("buttonStart").setAttribute("class","btn btn-flat btn-success noMargin");
  };

  View.prototype.start = function() {
    document.getElementById("buttonStop").setAttribute("class","btn btn-flat btn-danger noMargin");
    document.getElementById("buttonStart").setAttribute("class","btn btn-success noMargin");
  };
  
  View.prototype.getCharactersFile = function() {
    return document.getElementById("fileUploadCharacters").files[0];
  };
  
  View.prototype.getCombatFile = function() {
    return document.getElementById("fileUploadCombat").files[0];
  };
  
  View.prototype.selectTargetButtonEnable = function(params){ 
    var target = params.target;
    var characters = params.characters;
    var active = params.active;
    if (target === "character"){
      for (var i = 0; i < characters.length; i++) {
				var x = document.getElementById(characters.at(i).get("name"));
				if(characters.at(i).get("faction") == "ally"){
					x.setAttribute("class","btn btn-material-lightblue margin5");
				}
				else{
					x.setAttribute("class","btn btn-material-red margin5");
				}
				if(characters.at(i).get("name") === active.get("name")){
					var span = document.createElement('span')
					x.appendChild(span);
					if(active.get("faction") === "ally"){
						x.setAttribute("class","btn btn-material-lightblue btn-raised margin5");
					}
					else{
						x.setAttribute("class","btn btn-material-red btn-raised margin5");
					}
				}
        document.getElementById(characters.at(i).get("name")).removeAttribute("disabled");
      }
    }
    else if (target === "faction"){
      document.getElementById("factionAlly").removeAttribute("disabled");
      document.getElementById("factionEnemy").removeAttribute("disabled");
    }
    else if (target === "self"){
      document.getElementById(active.get("name")).removeAttribute("disabled");
    }
  };
  
  View.prototype.disableButtons = function(characters, active){
    for (var i = 0; i < characters.length; i++) {
			var x = document.getElementById(characters.at(i).get("name"));
      x.setAttribute("disabled",true);
			x.setAttribute("class","btn btn-default btn-raised margin5");
			if(characters.at(i).get("name") === active.get("name")){
				x.removeChild(x.lastChild);
			}
    }
    document.getElementById("factionAlly").setAttribute("disabled",true);
    document.getElementById("factionEnemy").setAttribute("disabled",true);
    
    var div = document.getElementById("actionButtons");
    while(div.hasChildNodes()){
      div.removeChild(div.firstChild);
    }
  };
  
  /**
   * End class
   */
  return View;
});
