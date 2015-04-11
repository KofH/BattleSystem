
define(function(require) {
  "use strcict";
  
  var Backbone = require('libs/backbone');
  var Weapons = require('battle-engine/Items/Weapons');
  var Armors = require('battle-engine/Items/Armors');
  var Actions = require('battle-engine/Actions/Actions');
  
  var Character = Backbone.Model.extend({
    
    get: function(attr) {                  ////////////// Backbone getter fix
      var value = Backbone.Model.prototype.get.call(this, attr);
        return _.isFunction(value) ? value.call(this) : value;
      },
   
    defaults: {
      wait: 100,
      weapon: "",
      armor: "",
      actions: []
    },
    
    initialize: function(model){
      //////////////////    Subattributes
      
      var self = this;

      this.set({
        
        maxHp: function (){
          return this.get("strength") * 3;
        },
        
        initiative: function (){
         return  this.get("agility") * 3;
        },
        
        offense: function (){
         return this.get("strength") * 5;
        },
        
        defense: function (){
          return this.get("strength") + this.get("agility") * 3;
        }
      });
      
      if(this.get("hp") == undefined){
        this.set({
          hp: this.get("maxHp")
        })
      };
      
      //////////////////       Turn
      
      /*this.on("change:wait", function(character){
        if (character.get("wait")<= 0)
          alert(character.get("name") + " is ready for action!");
      })*/
      
      //////////////////      Death
      this.on("change:hp", function(character){
        if(character.get("hp") <= 0){
          console.log(character.get("name") + " has fainted!");
					$.snackbar({content: character.get("name") + " has fainted!"});
          character.set({wait: Infinity});
        }
      });
     
    }
    
  });
  
  var CharacterList = Backbone.Collection.extend({
    model: Character,  
    
    clone: function(deep) {            ///////// Backbone deep cloning fix
      if(deep) {
        return new this.constructor(_.map(this.models, function(m) { return m.clone(); }));
      }else{
        return Backbone.Collection.prototype.clone();
      }
    },
    initialize: function(model){   

    }
  });
  
  function Characters(){
    this.defaultCharacterList = new CharacterList();
    this.characterList = new CharacterList();
    
    this.contAllies = function (){
      return this.characterList.where({faction:"ally"}).length;
    }
    this.contEnemies = function (){
      return this.characterList.where({faction:"enemy"}).length;
    }
  };
    
  Characters.prototype.load = function(file){
    var filereader = new FileReader();
    var self = this;

    filereader.onloadend = function (){
      self.defaultCharacterList = new CharacterList(JSON.parse(filereader.result));
      self.characterList = self.defaultCharacterList.clone(true);
    }
    filereader.readAsText(file,'utf8');
  };
  
  Characters.prototype.newCharacter = function(data){
    var character = new Character(data);
    character.set({id:character.get("name")});
    this.defaultCharacterList.add(character);
    this.characterList.add(character.clone());
    return this.characterList.get(character.get("name"));
  };
  
  Characters.prototype.reset = function(){
    this.characterList = this.defaultCharacterList.clone(true);
  };
  
  Characters.prototype.deadFaction = function(){
    if (this.characterList.where({faction:"ally", hp: 0}).length == this.contAllies() || 
        this.characterList.where({faction:"enemy", hp: 0}).length == this.contEnemies())
      return true;
    return false;
  }
  
  Characters.prototype.turn = function(){
    for (var i = 0; i < this.characterList.length; i++){
      var newWait = this.characterList.at(i).get("wait") - this.characterList.at(i).get("initiative");
      if (newWait < 0) newWait = 0;
      this.characterList.at(i).set({wait:newWait});
    }
  };
  
  Characters.prototype.stringify = function(){
    return JSON.stringify(this.characterList);
  };
  
  Characters.prototype.change = function(attr, exp){
    var finalExp = this.parse(attr, exp);
    if (finalExp == undefined) return;
    
    for (var i = 0; i < this.characterList.length; i++){
      this.characterList.at(i).set(attr, eval(finalExp));
    }
  };
  
  
  Characters.prototype.parse = function(attr,expression){
    attr = attr.toString();
    expression = expression.toString();
    
    if (attr.match(/^\w+strength$|^\w+agility$|^\w+intelligence$/i) && 
        expression.match(/^\d*$/)){
      return expression;
    }

    var exp = "";
    if(/(strength|agility|intelligence)/i.exec(expression))
      exp = expression.replace(
          /(strength|agility|intelligence|hp|maxHp|initiative|offense|defense)/ig, 
          'this.get(\"'+ "$&" + '\")');
    
   return "(function(){return " + exp + "})";
    
  };
  
  return Characters;
});