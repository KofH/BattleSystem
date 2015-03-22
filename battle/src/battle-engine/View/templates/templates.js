define(function(require){
  "use strict";
  
  function Templates(){};
  
  Templates.prototype.infoFighters = '\
		<%= name %>	\
		<ul>Strength: <%= strength %></ul>	\
		<ul>Agility: <%= agility %></ul>	\
		<ul>Intelligence: <%= intelligence %></ul>	\
		<ul style="color: #088A08;">HP: <%= hp %></ul>	\
		<ul style="color: #2E2EFE;">AP: <%= ap %></ul>	\
		<ul style="color: #8A0886">Wait: <%= wait %></ul>	\
		<div class="progress">	\
			<div class="progress-bar progress-bar-material-purple" style="width: <%= progress %>%;"></div>	\
		</div>';
	
  return Templates;  
});