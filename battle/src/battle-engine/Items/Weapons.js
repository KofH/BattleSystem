
define(function(require) {
	"use strict";
	
	var Backbone = require('libs/backbone');
	
	var Weapon = Backbone.Model.extend({
	  defaults: {
	    power: 0
	  }
	});
	
	var WeaponList = Backbone.Collection.extend({
	  model: Weapon
	});
	
	function Weapons() {
	  this.weaponList = new WeaponList();
	  
	  this.weaponList.add(new Weapon({
      name: Shortsword,
      power: 6
    }));
	  	  
	  this.weaponList.add(new Weapon({
	    name: Longsword,
	    power: 8
	  })); 

	  this.weaponList.add(new Weapon({
      name: Broadsword,
      power: 10
    }));
	  
	  
	}
	return Weapons;
});