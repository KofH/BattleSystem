define(function(require){
  "use strict";
  
  var Backbone = require('libs/backbone');
  
  var AppView = Backbone.View.extend({
      el: $('#container'),
      // template 
      initialize: function(){
        this.listenTo(this.model, "change", this.render);
      },
      render: function(){
            // Compile the template using underscore
      //      var template = _.template( $("#infoFighterTemplate").html(), {} );
            // Load the compiled HTML into the Backbone "el"
      //      this.$el.html( template );
        console.log(this.model.get("power"));
        }
    });
  return AppView;
});