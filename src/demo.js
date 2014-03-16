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
        var image = "Green Square"; //pendiente modificacion, debe ir dentro de paladin
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
        ally[names[contAllies]].defense = ally[names[contAllies]].strength * 4 + ally[names[contAllies]].agility; //sumarle X valor de la agilidad
        ++contAllies;
    }   
};
newEnemy = function () {
	if (contEnemies == MAX_ENEMIES){
        alert("Too many enemies in the battle!");
    }
    
    else{
    	var image = "Red Square"; //pendiente modificacion, debe ir dentro de paladin
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
modifyTurns = function () {
	alert("COMING SOON!");
};
checkTurns = function (){
	alert("COMING SOON");
};