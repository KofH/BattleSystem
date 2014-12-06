define(function(require) {
  "use strict";
  // INCLUDES
  // var Model = require('battle-engine/Model');

  
  /**
   * Constructor
   */
  function ViewModel() {
    // this.model = new Model();
  }

  /*****************************************************************************
   * PUBLIC FUNCTIONS *
   ****************************************************************************/
  /*
   * ViewModel.prototype.step = function(){ this.model.step();
   * console.log("ViewModel - STEP!"); };
   */

  ViewModel.prototype.showInfoFighters = function(characters) { 
    
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

      var str = document.createElement("ul");
      str.innerHTML = "Strength: " + characters.at(i).get("strength");
      item.appendChild(str);

      var agi = document.createElement("ul");
      agi.innerHTML = "Agility: " + characters.at(i).get("agility");
      item.appendChild(agi);

      var int = document.createElement("ul");
      int.innerHTML = "Inteligence: " + characters.at(i).get("inteligence");
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

      if (characters.at(i).get("faction") == "ally") {
        allies.appendChild(item);
      } else {
        enemies.appendChild(item);
      }
    }
  };
  
  ViewModel.prototype.selectEquipment = function(weapons, armors) {
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
  
  ViewModel.prototype.newCharacterPromptReset = function() {
    if (document.getElementById("newCharacterAlly").checked) {
      document.getElementById("newCharacterAlly").checked = false;
    } else if (document.getElementById("newCharacterEnemy").checked) {
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

  ViewModel.prototype.newCharacterPrompt = function() {
    this.newCharacterPromptReset();
    document.getElementById('newCharacterPrompt').classList.toggle('Displayed');
    document.getElementById('newCharacterAlly').focus();
  };

  ViewModel.prototype.loadAndSavePrompt = function() {
    document.getElementById('loadAndSavePrompt').classList.toggle('Displayed'); 
  };

  ViewModel.prototype.modifyCharactersPrompt = function() {
    document.getElementById('modifyCharactersPrompt').classList.toggle('Displayed');
    document.getElementById('modifyCharacterSelected').focus();
  };

  ViewModel.prototype.saveCharacters = function(serialization) {
    var dataurl = "data:application/octet-stream;ucs2,"+ serialization;
    var x = document.getElementById("saveCharactersDownload");
    x.setAttribute("download", document.getElementById("saveCharactersFileName").value + ".txt");
    x.href = dataurl;
    x.click();
    document.getElementById('loadAndSavePrompt').classList.toggle('Displayed');
  };

  ViewModel.prototype.loadCharacters = function(characters) {
    this.modifyCharactersDataList(characters);
    document.getElementById('loadAndSavePrompt').classList.toggle('Displayed');
  };

  
  ViewModel.prototype.newCharacter = function() {
    document.getElementById('newCharacterPrompt').classList.toggle('Displayed')
    var data = {};
    data.name = document.getElementById('newCharacterName').value;    //NAME
    if (document.getElementById('newCharacterAlly').checked){       //FACTION
      data.faction = document.getElementById('newCharacterAlly').value;
    } else {
      data.faction = document.getElementById('newCharacterEnemy').value;
    }
    data.strength = parseInt(document.getElementById('newCharacterStrength').value);  //STR
    data.agility = parseInt(document.getElementById('newCharacterAgility').value);   //AGI
    data.inteligence = parseInt(document.getElementById('newCharacterInteligence').value); //INT
    data.ap = parseInt(document.getElementById('newCharacterAP').value);          //AP
    
    data.weapon = document.getElementById("weaponList").value;  //WEAPON
    data.armor = document.getElementById("armorList").value;   //ARMOR
    
    if (document.getElementById('newCharacterVanguard').checked)  //FORMATION
      data.formation = "vanguard";
    else
      data.formation = "rearguard";
    
    data.actions = this.getSelectedActions();                      //ACTIONS
    
    return data;
  };
  
  ViewModel.prototype.showActiveActions = function(character){ //TODO to viewmodel
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
      input.onclick = Engine.stepSelectAction;
      div.appendChild(input);
    }
  };
  
  ViewModel.prototype.characterButton = function(data, callback){
    if (document.getElementById(data.name) == null) {
      var allies = document.getElementById("targetCharactersAlly");
      var enemies = document.getElementById("targetCharactersEnemy");
        
      var input = this.createBtt(data.name, data.name, data.name,
          callback);
        
        if(data.faction == "ally"){
          allies.appendChild(input);
        }
        else {
          enemies.appendChild(input);
        }
    }
  };
  
  ViewModel.prototype.factionButton = function(faction, callback){
    if (faction == "ally" && document.getElementById("factionAlly") == null){
      var targetAllies = document.getElementById("targetFactions");
      targetAllies.appendChild(this.createBtt("factionAlly", "Allies", "ally", callback));
    }
    else if (faction == "enemy" && document.getElementById("factionEnemy") == null){
      var targetEnemies = document.getElementById("targetFactions");
      targetEnemies.appendChild(this.createBtt("factionEnemy", "Enemies", "enemy", callback));
    }
  }
  
  ViewModel.prototype.createBtt = function(id, val, name, callback) {
    var input = document.createElement("input");
    input.type = "button";
    input.id = id;
    input.value = val;
    input.name = name;
    input.setAttribute("class","targetCharacters");
    input.setAttribute("disabled",true);
    input.onclick = callback;
    return input;
  };
  
  ViewModel.prototype.getSelectedActions = function(){  //TODO PROCEDURAL
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
    return actions;
  }

  ViewModel.prototype.modifyCharactersDataList = function(characters){ 
    var x = document.getElementById("modifyCharactersList");
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
  
  ViewModel.prototype.stop = function() {
    document.getElementById("buttonStop").style.background = "#F00";
    document.getElementById("buttonStart").style.background = "#CCC";
  };

  ViewModel.prototype.start = function() {
    document.getElementById("buttonStop").style.background = "#CCC";
    document.getElementById("buttonStart").style.background = "#0F0";
  };
  
  ViewModel.prototype.getCharactersFile = function() {
    return document.getElementById("fileUploadCharacters").files[0];
  }
  /**
   * End class
   */
  return ViewModel;
});
