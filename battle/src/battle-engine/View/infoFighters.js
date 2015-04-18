define(function(require){
  'use strict';
  
  var Backbone = require('libs/backbone');
  var Templates = require('../View/templates/templates');
  var temp = new Templates();
  
  var infoFighter = Backbone.View.extend({
      template: _.template(temp.infoFighters),
      initialize: function(){
				if(this.model.get('faction') === 'ally'){
					this.setElement('#infoFightersAllies');					
				}
				else{
					this.setElement('#infoFightersEnemies');
				}
				var subContainer = document.createElement('li');
				subContainer.setAttribute('id', 'Info' + this.model.get('name'));
				subContainer.setAttribute('class', 'defaultCharacter sample shadow-z-1');
				this.$el.append(subContainer);
				this.setElement(subContainer);
        this.listenTo(this.model, 'change', this.render);
				this.render();
      },
      render: function(){
        this.$el.html(this.template({
          name: this.model.get('name'),
					strength: this.model.get('strength'),
					agility: this.model.get('agility'),
					intelligence:  this.model.get('intelligence'),
					hp: this.model.get('hp'),
					ap:  this.model.get('ap'),
					wait:  this.model.get('wait'),
					progress: 100 - this.model.get('wait')
				}));					
      }
		
    });
    return infoFighter;
});