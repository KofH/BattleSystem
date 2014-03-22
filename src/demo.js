names = [];
var MAX_ALLIES = 4, MAX_ENEMIES = 6;
var contAllies = 0, contEnemies = 0;
characters = {};

newCharacter = function () {
	var characterFaction = prompt("ally or enemy");
	
	if (characterFaction == "ally" || characterFaction == "enemy") {
		var valid = false;
		if (contAllies < MAX_ALLIES && characterFaction == "ally") {
			contAllies++;
			valid = true;
		}
		else if (contEnemies < MAX_ENEMIES && characterFaction == "enemy"){
			contEnemies++;
			valid = true;
		} else {
			alert("Too many characters of this faction!")
		}
		if (valid) {
			var name = prompt("Name of this Character");
			
			names[contAllies+contEnemies-1] = name;
			characters[name] = {
					strength: parseInt(prompt("Initial Strength")),
					agility: parseInt(prompt("Initial Agility")),
					inteligence: parseInt(prompt("Initial Inteligence")),
					hp: 0,
					wait: 0,
					initiative: 0,
					attack: 0,
					defense: 0,
					faction: characterFaction
			}
			calcSubAttributes();
		}
	} else {
		alert("ally or enemy please");
	}
};
fightersGenerator = function (){
	for (var fighterAlly = 1; contAllies < MAX_ALLIES; contAllies++, fighterAlly++){
		var name = "Ally" + fighterAlly;
		names[contAllies] = name;
		characters[name] = {
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
		names[MAX_ALLIES + contEnemies] = name;
        characters[name] = {
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
	var searchFighter = prompt("How do you want to change?"), contSearch = 0, found = true;
	while (searchFighter != names[contSearch] && found) {
		if (contSearch > MAX_ALLIES + MAX_ENEMIES) { //Control de ERRORES en el caso de que no encuentre nada
			found = false;
		}		
		contSearch++
	}
	
	if (found) {
		modAttr = prompt("What Attribute do you want to modify? strength, agility or inteligence");
		characters[names[contSearch]][modAttr] = parseInt(prompt("Insert the New Value"));
		console.log(modAttr + " for " + names[contSearch] + " is now " + characters[names[contSearch]][modAttr]);
	} else {
		console.log("Fighter Not Found!")
	}
	calcSubAttributes();
};
calcSubAttributes = function (){ // Función a la que llamaremos para refrescar los subatributos
	var contCalcSub = 0;
	while (contCalcSub < names.length) {
		characters[names[contCalcSub]].hp = characters[names[contCalcSub]].strength * 3;
		contCalcSub++;
	}
	showInfoFighters();
};
showInfoFighters = function(){
	items = document.getElementById("infoFightersContent");
	while (items.hasChildNodes()) {
		items.removeChild(items.firstChild);
	}
	for (var i = 0; i < names.length; i++) {		
		
		var item = document.createElement("li");
		item.innerHTML = names[i];
		
		var str = document.createElement("ul");
		str.innerHTML = "Strength: " + characters[names[i]].strength;
		item.appendChild(str);
		
		items.appendChild(item);

	}
};