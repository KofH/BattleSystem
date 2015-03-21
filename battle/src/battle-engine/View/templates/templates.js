define(function(require){
  "use strict";
  
  function Templates(){};
  
  Templates.prototype.infoFighters = '\
    <h2>Name: <%= name %></h2> \
    <p>HP: <%= hp %></p>';
  
  return Templates;  
});