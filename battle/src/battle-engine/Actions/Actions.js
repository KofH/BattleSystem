
define(function(require) {
  "use strict";

  var Backbone = require('libs/backbone');
  var Action = Backbone.Model.extend({
    
    get: function(attr, model) {                  ////////////// Backbone getter fix
      var value = Backbone.Model.prototype.get.call(this, attr);
      return _.isFunction(value) ?
             value.call(this, model) : value;
    },
    
    initialize : function(model){
      this.set({id:this.get("name")});
    }
  });
   
  var ActionList = Backbone.Collection.extend({
    model: Action
  });
  
  function Actions(){
    this.actionList = new ActionList();
    ////////////////    ATTACK
    
    this.actionList.add(new Action({
      name: "attack",
      
      target: "character",
      
      effect: function(model){
    	  var target = model.selectedTarget;
          if(Math.floor(Math.random() * 100) <= model.characters.characterList.get(target).get("agility")){
            console.log(target + " dodged the attack!");
          }
          else{
            var damage = model.active.get("offense") * 2;
            if (damage > model.characters.characterList.get(target).get("defense")) {
              var realhp = model.characters.characterList.get(target).get("hp") - 
                (damage - model.characters.characterList.get(target).get("defense"));
              if (realhp < 0){
                realhp = 0;
              }
              model.characters.characterList.get(target).set({hp: realhp});
              console.log("Damage " + (damage - model.characters.characterList.get(target).get("defense")));
              console.log("Character HP: " + model.characters.characterList.get(target).get("hp"));
            } else {
              console.log("Damage absorbed!");
            }
          }
          if (model.active.get("wait") != Infinity)
            model.active.set({wait: 50});
        }
      
  }));
    
    
    /////////////////// DEFENSIVE POSITION
    
    this.actionList.add(new Action({
      name: "defPosition",
      
      target: "self",
      
      effect: function(model){
        var defense = model.active.defense + 5;
        model.active.defense = defense;
        alert("Defense: " + defense);
        model.active.wait = 20;     
      
      }
    }));
    
    
    /////////////////// AREA ATTACK
    
    this.actionList.add(new Action({
      name: "areaAttack",
      
      target: "faction",
      
      effect:function(model){
        var factionObj;
        if (model.selectedTarget == "ally") {
          factionObj = model.contAllies;
        } else if (model.selectedTarget == "enemy"){
          factionObj = model.contEnemies;
        } else {
          alert("ERROR!");
        }
        var damage = model.active.get("inteligence") / factionObj;
        for (var contSearch = 0; contSearch < model.characters.characterList.length; contSearch++) {
          if (model.characters.characterList.at(contSearch).get("faction") == factionObjetiveSelected) {
            model.characters.characterList.at(contSearch).set({hp: characters.characterList.at(contSearch).get("hp") - 
              (damage - model.characters.characterList.at(contSearch).get("defense"))});
          }
        }      
      }
    }));
    
    this.actionList.add(new Action({
      name: "changeFormation",
      
      target: "self",
      
      effect:function(model){
        if(model.active.get("formation") == "vanguard")
          model.active.set({formation: "rearguard"});
        else model.active.set({formation: "vanguard"});
        model.active.set({wait: 40});
      }
    }));
  };
  
  return Actions;
});