define(
/**
 * @returns EnviromenManager
 */
function(require) {

	var BattleEngine = require('battle-engine/Engine');

	/** 
	 * @type Start
	 * @constructor 
	 */
	function Start() {
		this._engine = new BattleEngine();
	}

	/********************
	 * PUBLIC FUNCTIONS *
	 ********************/

	Start.prototype.initialize = function() {
		console.log("Enviroment -> RUN!");

	//	this._addEventListeners();
	//	this._engine.initialize();
	//	this._engine.start();

	//	this._windowResize();
	};

	/*********************
	 * PRIVATE FUNCTIONS *
	 *********************/
/*
	Start.prototype._windowResize = function() {
		this._canvas.height = window.innerHeight;
		this._canvas.width = window.innerWidth;
	};

	Start.prototype._addEventListeners = function() {

		window.onresize = this._windowResize.bind(this);
	};
*/
	/**
	 * End class
	 */
	return Start;
});
