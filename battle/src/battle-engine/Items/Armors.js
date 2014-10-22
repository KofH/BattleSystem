
define(function(require) {
  "use strict";
  
  var Backbone = require('libs/backbone');
  
  var Armor = Backbone.Model.extend({
    defaults: {
      power: 0
    },
	initialize: function(Armors){
		this.set({id:this.get("name")});
	}
  });
  
  var ArmorList = Backbone.Collection.extend({
    model: Armor
  });
  
  function Armors() {
    this.armorList = new ArmorList();
    
    this.armorList.add(new Armor({
    	name: "Leather",
    	power: 6
    }));
        
    this.armorList.add(new Armor({
    	name: "Mail",
    	power: 8
    })); 

    this.armorList.add(new Armor({
    	name: "Plate",
    	power: 10
    }));
    
    this.armorList.add(new Armor({
    	name: "Tunic",
    	power: 4
    }));
  }
  return Armors;
});
    