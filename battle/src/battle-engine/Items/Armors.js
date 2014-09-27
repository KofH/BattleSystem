
define(function(require) {
  "use strict";
  
  var Backbone = require('libs/backbone');
  
  var Armor = Backbone.Model.extend({
    defaults: {
      power: 0
    }
  });
  
  var ArmorList = Backbone.Collection.extend({
    model: Armor
  });
  
  function Armors() {
    this.armorList = new ArmorList();
    
    this.armorList.add(new Armor({
      name: Leather,
      power: 6
    }));
        
    this.armorList.add(new Armor({
      name: Mail,
      power: 8
    })); 

    this.armorList.add(new Armor({
      name: Plate,
      power: 10
    }));
  }
  
  
});
    