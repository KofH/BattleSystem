var MAX_ALLIES = 4, MAX_ENEMIES = 6;
var contAllies = 0, contEnemies = 0;
characters = [];
actions = {
		attack: function(){
			var target = searchCharacter();
			var damage = this.strength * 2;
			alert("Damage " + damage);
			characters[target].hp -= damage;
			alert("Character HP: " + characters[target].hp);
			this.prototype.wait = 50;
		},
		
		defPosition: function(){
			var defense = this.defense + 2;
			this.prototype.defense = defense;
			alert("Defense: " + defense);
			this.prototype.wait = 20;			
		},
		
		areaAttack: function(){
			var factionObjetiveSelected = prompt("ally or enemy");
			if (factionObjetiveSelected == "ally") {
				factionObj = contAllies;
			} else if (factionObjetiveSelected == "enemy"){
				factionObj = contEnemies;
			} else {
				alert("ERROR!");
			}
			var damage = this.inteligence / factionObj;
			for (var contSearch = 0; contSearch < characters.length; contSearch++) {
				if (characters[contSearch].faction = factionObjetiveSelected) {
					characters[contSearch].hp -= damage;
				}
			}
			alert("Area Attack!");
		}
};

searchCharacter = function(){
	var searchCharacter = prompt("Choose your target"), contSearch = 0, found = true;
	while (contSearch < characters.length) {
		if (searchCharacter == characters[contSearch].name){
			return contSearch;
        }
        contSearch++
	}
    return -1;
};

saveCharacters = function(){
	var serialization = JSON.stringify(characters);
	var dataurl = "data:application/octet-stream;ucs2,"+ serialization;
	window.open(dataurl);
};

loadCharacters = function(){
	var filereader = new FileReader();
	
	filereader.onloadend = function (){
		characters = [];
		characters = JSON.parse(filereader.result);
		contAllies = 0;
		contEnemies = 0;
		for (var i = 0; i < characters.length; i++){
			if (characters[i].faction == "ally")
				contAllies++;
			else
				contEnemies++;
		}
		
	}
	var file = document.getElementById("fileUpload").files[0];
	filereader.readAsText(file,'utf8');
};
newCharacterPrompt = function(){
	document.getElementById('newCharacterPrompt').classList.toggle('Displayed');
	document.getElementById('newCharacterAlly').focus();
};
newCharacter = function () {
	document.getElementById('newCharacterPrompt').classList.toggle('Displayed');
	console.log("New Character");
	var characterFaction;
	if (document.getElementById('newCharacterAlly').checked){
		characterFaction = document.getElementById('newCharacterAlly').value;
	} else {
		characterFaction = document.getElementById('newCharacterEnemy').value;
	}
	var valid = false;
	
	if (contAllies < MAX_ALLIES && characterFaction == "ally") {
		contAllies++;
		valid = true;
	} else if (contEnemies < MAX_ENEMIES && characterFaction == "enemy") {
		contEnemies++;
		valid = true;
	} else {
		alert("Too many character of this faction!");
	}
	if (valid){
		characters[contAllies+contEnemies-1] = {
				name: document.getElementById('newCharacterName').value,
				strength: parseInt(document.getElementById('newCharacterStrength').value),
				agility: parseInt(document.getElementById('newCharacterAgility').value),
				inteligence: parseInt(document.getElementById('newCharacterInteligence').value),
				hp: 0,
				wait: 0,
				initiative: 0,
				offense: 0,
				defense: 0,
				actions: [],
				faction: characterFaction
		}
		newCharacterActions();
		calcSubAttributes();
		newCharacterPromptReset();
	}
};
newCharacterActions = function (){
	var contActions = 0;
	if (document.getElementById("newCharacterActionAttack").checked) {
		characters[contAllies+contEnemies-1].actions[contActions] = document.getElementById("newCharacterActionAttack").value;
		contActions++;
	}
	if (document.getElementById("newCharacterActionDefense").checked) {
		characters[contAllies+contEnemies-1].actions[contActions] = document.getElementById("newCharacterActionDefense").value;
		contActions++;
	}
	if (document.getElementById("newCharacterActionAreaAttack").checked) {
		characters[contAllies+contEnemies-1].actions[contActions] = document.getElementById("newCharacterActionAreaAttack").value;
		contActions++;
	}
	
};
newCharacterPromptReset = function (){
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
fightersGenerator = function (){
	for (var fighterAlly = 1; contAllies < MAX_ALLIES; contAllies++, fighterAlly++){
		var name = "Ally" + fighterAlly;
	//	names[contAllies] = name;
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
//		names[MAX_ALLIES + contEnemies] = name;
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

modifyAttributes = function () {
	var searchFighter = prompt("Which character do you want to change?"), contSearch = 0, found = true;
	while (searchFighter != characters[contSearch].name && found) {
		if (contSearch > MAX_ALLIES + MAX_ENEMIES) { //Control de ERRORES en el caso de que no encuentre nada
			found = false;
		}		
		contSearch++
	}
	
	if (found) {
		modAttr = prompt("What Attribute do you want to modify? strength, agility or inteligence");
		characters[contSearch][modAttr] = parseInt(prompt("Insert the New Value"));
		console.log(modAttr + " for " + characters[contSearch].name + " is now " + characters[contSearch][modAttr]);
	} else {
		console.log("Fighter Not Found!")
	}
	calcSubAttributes();
};

calcSubAttributes = function (){ // Función a la que llamaremos para refrescar los subatributos
	var contCalcSub = 0;
	while (contCalcSub < characters.length) {
		characters[contCalcSub].hp = characters[contCalcSub].strength * 3;
		characters[contCalcSub].initiative = characters[contCalcSub].agility * 3;
		characters[contCalcSub].offense = characters[contCalcSub].strength * 5;
		characters[contCalcSub].defense = (characters[contCalcSub].strength + characters[contCalcSub].agility) * 3;
		contCalcSub++;
	}
	showInfoFighters();
};

showInfoFighters = function(){
	items = document.getElementById("infoFightersContent");
	while (items.hasChildNodes()) {
		items.removeChild(items.firstChild);
	}
	for (var i = 0; i < characters.length; i++) {		
		
		var item = document.createElement("li");
		item.innerHTML = characters[i].name;
		
		var str = document.createElement("ul");
		str.innerHTML = "Strength: " + characters[i].strength;
		item.appendChild(str);
		
		items.appendChild(item);

	}
};
test = function(){
	document.getElementById('newCharacterPrompt').classList.toggle('Displayed');
}