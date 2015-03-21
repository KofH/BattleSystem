define(function(require){
  "use strict";
  
  var Backbone = require('libs/backbone');
  var Templates = require('../View/templates/templates');
  var temp = new Templates();
  
  var infoFighter = Backbone.View.extend({
      el: $('#container' + this.model.get("name")),
      template: _.template(temp.infoFighters),
      initialize: function(){
        this.render();
        this.listenTo(this.model, "change", this.render);
      },
      render: function(){
        this.$el.html(this.template({
          name: this.model.get("name"),
          hp: this.model.get("hp")}));
      }
    });
    return infoFighter;
});