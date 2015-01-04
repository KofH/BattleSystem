define(function(require) {
  "use strict";

  /**
   * Constructor
   */
  function View() {
    this._buttonAction = function(){};
    this._buttonTarget = function(){};
  };

  /*****************************************************************************
   * PUBLIC FUNCTIONS *
   ****************************************************************************/
  
   View.prototype.step = function(model){
     this.showInfoFighters(model.characters.characterList);
     this.generateButtons(model.characters.characterList);
    };
    

  View.prototype.initialize = function(engine){
    this._buttonAction = engine.stepSelectAction.bind(engine);
    this._buttonTarget = engine.stepSelectTarget.bind(engine);
    this.selectEquipment(engine._model.weapons.weaponList,
						 engine._model.armors.armorList);
    document.getElementById("buttonResetCharacters").onclick = engine._resetCharacters.bind(engine);
    document.getElementById("buttonStart").onclick = engine.start.bind(engine);
    document.getElementById("buttonStop").onclick = engine.stop.bind(engine);
    document.getElementById("buttonStep").onclick = engine.tick.bind(engine);
    document.getElementById("newCharacterNext").onclick = engine._newCharacter.bind(engine);
    document.getElementById("newCharacterReset").onclick = this.newCharacterPromptReset;
    document.getElementById("buttonLoadCharacters").onclick = engine._loadCharacters.bind(engine);
    document.getElementById("buttonSaveCharacters").onclick = engine._saveCharacters.bind(engine);
    document.getElementById("buttonLoadWeapons").onclick = engine._loadWeapons.bind(engine);
    document.getElementById("buttonSaveWeapons").onclick = engine._saveWeapons.bind(engine);
    document.getElementById("buttonLoadArmors").onclick = engine._loadArmors.bind(engine);
    document.getElementById("buttonSaveArmors" ).onclick = engine._saveArmors.bind(engine);
		$(function () {
  		$('[data-toggle="tooltip"]').tooltip()
		});
	  //IMPROVE THIS
	  $('#slider-step').noUiSlider({
		  start: [ 0 ],
		  step: 1,
		  range: {
			  'min': [ 0 ],
			  'max': [ 0 ]
		  },
			format: wNumb({
				decimals: 0,
			})
	  });
	  $('#slider-step').Link('lower').to($('#slider-step-value'));
  }; 
  
  View.prototype.get = function(param){
    return document.getElementById(param);
  };
  
  View.prototype.askReset = function(){
    return confirm('Are you sure you want to Reset Characters?');
  };
  
  View.prototype.showInfoFighters = function(characters) { 
    var allies = document.getElementById("infoFightersAllies");
    var enemies = document.getElementById("infoFightersEnemies");

    while (allies.hasChildNodes()) {
      allies.removeChild(allies.firstChild);
    }
    while (enemies.hasChildNodes()) {
      enemies.removeChild(enemies.firstChild);
    }
    for (var i = 0; i < characters.length; i++) {

      var item = document.createElement("li");
      item.innerHTML = characters.at(i).get("name");
			item.setAttribute("id", "Info" + item.innerHTML);

      var str = document.createElement("ul");
      str.innerHTML = "Strength: " + characters.at(i).get("strength");
      item.appendChild(str);

      var agi = document.createElement("ul");
      agi.innerHTML = "Agility: " + characters.at(i).get("agility");
      item.appendChild(agi);

      var int = document.createElement("ul");
      int.innerHTML = "Intelligence: " + characters.at(i).get("intelligence");
      item.appendChild(int);

      var hp = document.createElement("ul");
      hp.innerHTML = "HP: " + characters.at(i).get("hp");
      hp.style.color = "#088A08";
      item.appendChild(hp);

      var ap = document.createElement("ul");
      ap.innerHTML = "AP: " + characters.at(i).get("ap");
      ap.style.color = "#2E2EFE";
      item.appendChild(ap);

      var wait = document.createElement("ul");
      wait.innerHTML = "Wait: " + characters.at(i).get("wait");
      wait.style.color = "#8A0886";
      item.appendChild(wait);
			
			var divW = document.createElement("div");
			divW.setAttribute("class","progress");
			
			var waitBar = document.createElement("div");
			waitBar.style.width = (100-characters.at(i).get("wait")) + "%";
			if (characters.at(i).get("wait") == 0) waitBar.setAttribute("class","progress-bar progress-bar-material-lightblue");
			else waitBar.setAttribute("class","progress-bar progress-bar-material-purple");
			divW.appendChild(waitBar);
			item.appendChild(divW);
			
      if (characters.at(i).get("faction") == "ally") {
        allies.appendChild(item);
      } else {
        enemies.appendChild(item);
      }
    }
  };
  
  View.prototype.generateButtons = function(characters){
    for (var i = 0; i < characters.length; i++){
      this.characterButton(characters.at(i).attributes, this.stepSelectTarget);
      this.factionButton(characters.at(i).get("faction"), this.stepSelectTarget);
    }
  };
  
  View.prototype.setTurn = function(turn){
    var value = document.getElementById("slider-step-value").value;
    document.getElementById("slider-step").destroy();
    $('#slider-step').noUiSlider({
      start: [ turn ],
      step: 1,
      range: {
        'min': [ 0 ],
        'max': [ turn ]
      },
			format: wNumb({
				decimals: 0,
			})
    });
    $('#slider-step').Link('lower').to($('#slider-step-value'));
    document.getElementById("slider-step-value").value = turn;
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
  
  View.prototype.newCharacterPromptReset = function() {
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
    document.getElementById("newCharacterActionAttack").checked = false;
    document.getElementById("newCharacterActionDefense").checked = false;
    document.getElementById("newCharacterActionAreaAttack").checked = false;
    document.getElementById("weaponSelect").value = "";
    document.getElementById("armorSelect").value = "";
  };

  View.prototype.newCharacterPrompt = function() {
    this.newCharacterPromptReset();
    document.getElementById('newCharacterAlly').focus();
  };

  View.prototype.loadAndSavePrompt = function() {
  };

  View.prototype.modifyCharactersPrompt = function() {
    document.getElementById('modifyCharacterSelected').focus();
  };

  View.prototype.saveCharacters = function(serialization) {
    var dataurl = "data:application/octet-stream;ucs2,"+ serialization;
    var x = document.getElementById("saveCharactersDownload");
    x.setAttribute("download", document.getElementById("saveCharactersFileName").value + ".txt");
    x.href = dataurl;
    x.click();
  };

  View.prototype.loadCharacters = function(characters) {    ///NOT IN USE
    this.modifyCharactersDataList(characters);
  };

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
    
    return data;
  };
  
  View.prototype.showActiveActions = function(character){ 
    var div = document.getElementById("actionButtons");
    while(div.hasChildNodes()){
      div.removeChild(div.firstChild);
    }
    var title = document.createElement("h2");
    title.innerHTML = "What will " + character.get("name") + " do?";
    div.appendChild(title);
    
    for( var i = 0; i < character.get("actions").length; i++){
      var input = document.createElement("input");
      input.type = "button";
      input.value = character.get("actions")[i];
      input.onclick = this._buttonAction.bind(input, input);
      div.appendChild(input);
    }
  };
  
  View.prototype.characterButton = function(data, callback){
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
  
  View.prototype.factionButton = function(faction, callback){
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
    var input = document.createElement("input");
    input.type = "button";
    input.id = id;
    input.value = val;
    input.name = name;
    input.setAttribute("class","targetCharacters");
    input.setAttribute("disabled",true);
    input.onclick = this._buttonTarget.bind(input,input);
		//FIXME
    input.onmouseover = console.log.bind(console,"HOVER!");
    input.onmouseout = console.log.bind(console,"HOVER!");
    return input;
  };
  
  View.prototype.getSelectedActions = function(){  //TODO PROCEDURAL
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
    
    if (document.getElementById("newCharacterActionChangeFormation").checked) {
      actions.push(document.getElementById("newCharacterActionChangeFormation").value);
    }

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
  
  View.prototype.selectTargetButtonEnable = function(target, characters, active){    
    if (target === "character"){
      for (var i = 0; i < characters.length; i++) {
        document.getElementById(characters.at(i).get("name")).disabled = false;
      }
    }
    else if (target === "faction"){
      document.getElementById("factionAlly").disabled = false;
      document.getElementById("factionEnemy").disabled = false;
    }
    else if (target === "self"){
      document.getElementById(active.get("name")).disabled = false;
    }
  };
  
  View.prototype.disableButtons = function(characters){
    for (var i = 0; i < characters.length; i++) {
      document.getElementById(characters.at(i).get("name")).disabled = true;
    }
    document.getElementById("factionAlly").disabled = true;
    document.getElementById("factionEnemy").disabled = true;
    
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
