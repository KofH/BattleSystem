names = [];
var MAX_ALLIES = 4, MAX_ENEMIES = 6;
var contAllies = 0, contEnemies = 0;

newAlly = function () {
    
    if (contAllies == MAX_ALLIES){
        alert("Too many allies in the battle!");
    }
    
    else{            
        ally = {};//Nuevo objecto ally. También se puede construir como ally = new Object();
        var image = "Green Square"; //pendiente modificacion, debe ir dentro de paladin
        var name = prompt("Name of your Ally");
        
        names[contAllies] = name;
        ally[name] = {
            strength: prompt("Initial Strength"), //Fuerza del personaje aliado
            agility: prompt("Initial Agility"), //Agilidad del personaje aliado
            inteligence: prompt("Initial Inteligence"), //Inteligencia del personaje aliado
        	hp: 0, // Puntos de vida. Según valor de la fuerza
            wait: 0, // Wait inicial es 0 siempre.
            initiative: 0, // Iniciativa. Según valor de la agilidad
            attack: 0, // Ataque. Según valor de fuerza (y arma después)
            defense: 0, // Defensa. Según valor de agilidad (y armadura después)
            image: image // Imagen del personaje
        };
        ally[names[contAllies]].hp = ally[names[contAllies]].strength * 3;
        ally[names[contAllies]].initiative = ally[names[contAllies]].inteligence * 3;
        ally[names[contAllies]].attack = ally[names[contAllies]].strength * 2;
        ally[names[contAllies]].defense = ally[names[contAllies]].strength * 4; //sumarle X valor de la agilidad.
        contAllies += 1;
    }   
};
newEnemy = function () {
	if (contEnemies == MAX_ENEMIES){
        alert("Too many enemies in the battle!");
    }
    
    else{            
        enemy = {};//Nuevo objecto ally. También se puede construir como ally = new Object();
        var image = "Red Square"; //pendiente modificacion, debe ir dentro de paladin
        var name = prompt("Name of your Enemy");
        
        names[MAX_ALLIES + contEnemies] = name;
        
	    enemy[name] = {
    		strength: prompt("Initial Strength"), //Fuerza del personaje aliado
            agility: prompt("Initial Agility"), //Agilidad del personaje aliado
            inteligence: prompt("Initial Inteligence"), //Inteligencia del personaje aliado
        	hp: prompt("Hit Points"), // puntos de vida de paladin.
            wait: prompt("Initial Wait"), // Wait inicial. Remodelar segun exigencias
            initiative: prompt("Initiative Level"), //Nivel de Iniciativa
            attack: prompt("Attack Level"), //Nivel de Ataque
            defense: prompt("Defense Level"), // Nivel de Defensa
            image: image //Imagen del personaje
        };
        contEnemies += 1;
    }
};
modifyTurns = function () {
    ally.paladin.wait = prompt("New Ally Wait"); //Modifica manualmente el Wait de ally.paladin
    enemy.troll.wait = prompt("New Enemy Wait"); //Modifica manualmente el Wait de enemy.troll
};
checkTurns = function (){
    console.log("Paladin wait = " + ally.paladin.wait); //Muestra en consola el WAIT actual del Paladín
    console.log("Troll wait = " + enemy.troll.wait); //Muestra en consola el WAIT actual del troll
};
/*
Esta linea copiarla cuando ally.paladin.hp && enemy.troll.hp > 0
document.getElementById('buttonModifyTurns').classList.toggle('Displayed');
Esto hay que ponerlo en bucle para chequearlo constantemente. El CSS está actualmente alterado.
*/