names = [];
var MAX_ALLIES = 4, MAX_ENEMIES = 6;
var contAllies = 0, contEnemies = 0;
ally = {};
enemy = {};

newAlly = function () {
    
    if (contAllies == MAX_ALLIES){
        alert("Too many allies in the battle!");
    }
    
    else{            
        var name = prompt("Name of your Ally");
        
        names[contAllies] = name;
        ally[name] = {
			strength: parseInt(prompt("Initial Strength")), //Fuerza del personaje aliado
			agility: parseInt(prompt("Initial Agility")), //Agilidad del personaje aliado
			inteligence: parseInt(prompt("Initial Inteligence")), //Inteligencia del personaje aliado
			hp: 0,
			wait: 0,
			initiative: 0,
			attack: 0,
			defense: 0
        };
        ++contAllies;
    }
    calcSubAttributes();
};
newEnemy = function () {
	if (contEnemies == MAX_ENEMIES){
        alert("Too many enemies in the battle!");
    }
    
    else{
        var name = prompt("Name of your Enemy");
        
        names[MAX_ALLIES + contEnemies] = name;
        enemy[name] = {
    		strength: parseInt(prompt("Initial Strength")), //Fuerza inicial del enemigo
			agility: parseInt(prompt("Initial Agility")), //Agilidad inicial del enemigo
			inteligence: parseInt(prompt("Initial Inteligence")), //Inteligencia inicial del enemigo
			hp: 0,
			wait: 0,
			initiative: 0,
			attack: 0,
			defense: 0
        };
        ++contEnemies;
    }
	calcSubAttributes();
};
fightersGenerator = function (){
	for (var fighterAlly = 1; contAllies < MAX_ALLIES; contAllies++, fighterAlly++){
		var name = "Ally" + fighterAlly;
		names[contAllies] = name;
		ally[name] = {
				strength: 1,
				agility: 1,
				inteligence: 1,
				hp: 0,
				wait: 0,
				initiative: 0,
				attack: 0,
				defense: 0
		};
		calcSubAttributes();
	}
	for (var fighterEnemy = 1; contEnemies < MAX_ENEMIES; contEnemies++, fighterEnemy++){
		var name = "Enemy" + fighterEnemy;
		names[MAX_ALLIES + contEnemies] = name;
        enemy[name] = {
    		strength: 1,
			agility: 1,
			inteligence: 1,
			hp: 0,
			wait: 0,
			initiative: 0,
			attack: 0,
			defense: 0
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
		if (contSearch < MAX_ALLIES) {
			modAttr = prompt("What Attribute do you want to modify? strength, agility or inteligence");
			ally[names[contSearch]][modAttr] = parseInt(prompt("Insert the new Value"));
			console.log(modAttr + " for " + names[contSearch] + " is now " + ally[names[contSearch]][modAttr]);
		} else {
			modAttr = prompt("What Attribute do you want to modify? strength, agility or inteligence");
			enemy[names[contSearch]][modAttr] = parseInt(prompt("Insert the new Value"));
			console.log(modAttr + " for " + names[contSearch] + " is now " + enemy[names[contSearch]][modAttr]);
		}
	} else {
		console.log("Fighter Not Found!")
	}
	calcSubAttributes();
};
calcSubAttributes = function (){ // Función a la que llamaremos para refrescar los subatributos
	var contCalcSub = 0;
	var items = document.getElementById("infoFightersContent");
	while (contCalcSub < MAX_ALLIES + MAX_ENEMIES && contCalcSub <= contAllies && contCalcSub <= contEnemies) {
		if (contCalcSub < MAX_ALLIES) {
			ally[names[contCalcSub]].hp = ally[names[contCalcSub]].strength * 3;
			ally[names[contCalcSub]].initiative = ally[names[contCalcSub]].inteligence * 4;
			ally[names[contCalcSub]].attack = ally[names[contCalcSub]].strength * 5;
			ally[names[contCalcSub]].defense = ally[names[contCalcSub]].strength * 2 + ally[names[contCalcSub]].agility * 3;
		} else {
			enemy[names[contCalcSub]].hp = enemy[names[contCalcSub]].strength * 3;
			enemy[names[contCalcSub]].initiative = enemy[names[contCalcSub]].inteligence * 4;
			enemy[names[contCalcSub]].attack = enemy[names[contCalcSub]].strength * 5;
			enemy[names[contCalcSub]].defense = enemy[names[contCalcSub]].strength * 2 + enemy[names[contCalcSub]].agility * 3;
		}
		contCalcSub++;
	}
	/*
	contCalcSub = 0;
	while (contCalcSub < MAX_ALLIES + MAX_ENEMIES && contCalcSub <= contAllies && contCalcSub <= contEnemies) {
		if (contCalcSub < MAX_ALLIES){
			items.innerHTML = ally[names[contCalcSub].strength];
		} else {
			items.innerHTML = enemy[names[contCalcSub]].strength;
		}
		contCalcSub++;
	}/*
	var i = 0;
	while (i < 1) {
		var item = document.createElement("li");
		item.innerHTML = names[i];
		items.appendChild(item);
		i++
	}*/
};