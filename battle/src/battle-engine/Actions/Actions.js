
define(function(require) {
  "use strict";

  var Backbone = require('libs/backbone');
  var Action = Backbone.Model.extend({
    
    get: function(attr) {                  ////////////// Backbone getter fix
      var value = Backbone.Model.prototype.get.call(this, attr);
      return _.isFunction(value) ? value.call(this) : value;
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
      
      effect: function () { 
        return function(model){
          //if (!model) { return effect; } // this is a ñapa
          var target = model.searchCharacter();
          if(Math.floor(Math.random() * 100) <= model.characters.get(target).get("agility")){
            alert(target + " dodged the attack!");
          }
          else{
            var damage = model.active.get("offense") * 2;
            if (damage > model.characters.get(target).get("defense")) {
              //alert("Damage " + damage);
              var realhp = model.characters.get(target).get("hp") - (damage - model.characters.get(target).get("defense"));
              if (realhp < 0){
                realhp = 0;
              }
              model.characters.get(target).set({hp: realhp});
              alert("Damage " + (damage - model.characters.get(target).get("defense")));
              alert("Character HP: " + model.characters.get(target).get("hp"));
            } else {
              alert("Damage absorbed!");
            }
          }
          model.active.set({wait: 50});
        };
      }
  }));
    
    
    /////////////////// DEFENSIVE POSITION
    
    this.actionList.add(new Action({
      name: "defPosition",
      
      effect: function() { 
        return function(model){
        var defense = model.active.defense + 5;
        model.active.defense = defense;
        alert("Defense: " + defense);
        model.active.wait = 20;     
      };
    }
    }));
    
    
    /////////////////// AREA ATTACK
    
    this.actionList.add(new Action({
      name: "areaAttack",
      
      effect: function() { 
        return function(model){
        var factionObjetiveSelected = prompt("ally or enemy");
        var factionObj;
        if (factionObjetiveSelected == "ally") {
          factionObj = model.contAllies;
        } else if (factionObjetiveSelected == "enemy"){
          factionObj = model.contEnemies;
        } else {
          alert("ERROR!");
        }
        var damage = model.active.get("inteligence") / factionObj;
        for (var contSearch = 0; contSearch < model.characters.length; contSearch++) {
          if (model.characters.at(contSearch).get("faction") == factionObjetiveSelected) {
            model.characters.at(contSearch).set({hp: characters.at(contSearch).get("hp")-(damage - model.characters.at(contSearch).get("defense"))});
          }
        }
        alert("Area Attack!");
      };
      }
    }));
  };
  
  return Actions;
});