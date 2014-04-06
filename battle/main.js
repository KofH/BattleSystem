requirejs.config({
    baseUrl: '../battle/src',
    paths: {
    	jquery:'../src/libs/jquery',
    	underscore: '../src/libs/underscore'
    }
  });

var engine;

define(function (require) {
  "use strict";
	var Start = require('Start'),
     	startPoint = new Start();	
	
	startPoint.initialize();
	
	engine = startPoint._engine;
});


