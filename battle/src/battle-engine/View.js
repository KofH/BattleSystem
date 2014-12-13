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
  
   /*View.prototype.step = function(){
      
    };
    //*/

  View.prototype.initialize = function(engine){
    this._buttonAction = engine.stepSelectAction.bind(engine);
    this._buttonTarget = engine.stepSelectTarget.bind(engine);
    
    document.getElementById("buttonLoadAndSave").onclick = this.loadAndSavePrompt;
    document.getElementById("buttonNewCharacter").onclick = engine._newCharacterPrompt.bind(engine);
    document.getElementById("buttonModifyAttributes").onclick = this.modifyCharactersPrompt;
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
    document.getElementById("modifyCharacterSubmit").onclick = engine.modCharactersSaveAttr.bind(engine);
    //document.getElementById("modifyCharacterClose").onclick = this; //TODO
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
    document.getElementById("newCharacterInteligence").value = "";
    document.getElementById("newCharacterAP").value = "";
    document.getElementById("newCharacterActionAttack").checked = false;
    document.getElementById("newCharacterActionDefense").checked = false;
    document.getElementById("newCharacterActionAreaAttack").checked = false;
    document.getElementById("weaponList").value = "";
    document.getElementById("armorList").value = "";
  };

  View.prototype.newCharacterPrompt = function() {
    this.newCharacterPromptReset();
    document.getElementById('newCharacterPrompt').classList.toggle('Displayed');
    document.getElementById('newCharacterAlly').focus();
  };

  View.prototype.loadAndSavePrompt = function() {
    document.getElementById('loadAndSavePrompt').classList.toggle('Displayed'); 
  };

  View.prototype.modifyCharactersPrompt = function() {
    document.getElementById('modifyCharactersPrompt').classList.toggle('Displayed');
    document.getElementById('modifyCharacterSelected').focus();
  };

  View.prototype.saveCharacters = function(serialization) {
    var dataurl = "data:application/octet-stream;ucs2,"+ serialization;
    var x = document.getElementById("saveCharactersDownload");
    x.setAttribute("download", document.getElementById("saveCharactersFileName").value + ".txt");
    x.href = dataurl;
    x.click();
    document.getElementById('loadAndSavePrompt').classList.toggle('Displayed');
  };

  View.prototype.loadCharacters = function(characters) {
    this.modifyCharactersDataList(characters);
    document.getElementById('loadAndSavePrompt').classList.toggle('Displayed');
  };

  
  View.prototype.newCharacter = function() {
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
    
  View.prototype.stop = function() {
    document.getElementById("buttonStop").style.background = "#F00";
    document.getElementById("buttonStart").style.background = "#CCC";
  };

  View.prototype.start = function() {
    document.getElementById("buttonStop").style.background = "#CCC";
    document.getElementById("buttonStart").style.background = "#0F0";
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
