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
        ally[names[contAllies]].hp = ally[names[contAllies]].strength * 3;
        ally[names[contAllies]].initiative = ally[names[contAllies]].inteligence * 3;
        ally[names[contAllies]].attack = ally[names[contAllies]].strength * 2;
        ally[names[contAllies]].defense = ally[names[contAllies]].strength * 4 + ally[names[contAllies]].agility;
        ++contAllies;
    }   
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
        enemy[names[MAX_ALLIES + contEnemies]].hp = enemy[names[MAX_ALLIES + contEnemies]].strength * 3;
        enemy[names[MAX_ALLIES + contEnemies]].initiative = enemy[names[MAX_ALLIES + contEnemies]].inteligence * 3;
        enemy[names[MAX_ALLIES + contEnemies]].attack = enemy[names[MAX_ALLIES + contEnemies]].strength * 2;
        enemy[names[MAX_ALLIES + contEnemies]].defense = enemy[names[MAX_ALLIES + contEnemies]].strength * 4 + enemy[names[MAX_ALLIES + contEnemies]].agility;
        ++contEnemies;
    }
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
		ally[names[contAllies]].hp = ally[names[contAllies]].strength * 3;
		ally[names[contAllies]].initiative = ally[names[contAllies]].inteligence * 3;
        ally[names[contAllies]].attack = ally[names[contAllies]].strength * 2;
        ally[names[contAllies]].defense = ally[names[contAllies]].strength * 4 + ally[names[contAllies]].agility;	
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
        enemy[names[MAX_ALLIES + contEnemies]].hp = enemy[names[MAX_ALLIES + contEnemies]].strength * 3;
        enemy[names[MAX_ALLIES + contEnemies]].initiative = enemy[names[MAX_ALLIES + contEnemies]].inteligence * 3;
        enemy[names[MAX_ALLIES + contEnemies]].attack = enemy[names[MAX_ALLIES + contEnemies]].strength * 2;
        enemy[names[MAX_ALLIES + contEnemies]].defense = enemy[names[MAX_ALLIES + contEnemies]].strength * 4 + enemy[names[MAX_ALLIES + contEnemies]].agility;
	}
};
modifyAttributes = function () {
	searchFighter = prompt("How do you want to change?"), contSearch = 0;
	while (searchFighter != names[contSearch] && searchFighter != "Not Found") {
		if (contSearch > MAX_ALLIES + MAX_ENEMIES) { //Control de ERRORES en el caso de que no encuentre nada
			searchFighter = "Not Found";
		}		
		contSearch++
	}
	
	if (searchFighter != "Not Found") {
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
}; /* NOTA IMPORTANTE :: Generar una function que recalcule el resto de atributos apartir de STR, AGI & INT. Así solo tener que
llamarla cada vez que se modifiquen estos valores iniciales */
checkTurns = function (){
	alert("COMING SOON");
};