
//===============create Game==================
myGame.init(640,480,5);

//===============add Sound==================

//===============create Scene================
myGame.sceneManager.createScenes(1);

//===============create States================
myGame.initStateManager({});
var reaction = myGame.reactionSystem;

//===============create Objects==================

var _blender_4= Alice.Object.fromImage('./Resources/Assets/blender.png');
_blender_4.name = '_blender_4';
_blender_4.anchor.set(0.5, 0.5);
_blender_4.x = 426.66666666666663;
_blender_4.y = 320;
_blender_4.scale.set(0.6666666666666666, 0.6666666666666666);
reaction.makeClickable( _blender_4 );
reaction.makeDraggable( _blender_4 );
_blender_4.visible = true;
myGame.scene(0).addChild(_blender_4);

var _cat_2= Alice.Object.fromImage('./Resources/Assets/cat.png');
_cat_2.name = '_cat_2';
_cat_2.anchor.set(0.5, 0.5);
_cat_2.x = 116.35416666666666;
_cat_2.y = 276;
_cat_2.scale.set(0.6666666666666666, 0.6666666666666666);
reaction.makeClickable( _cat_2 );
reaction.makeDraggable( _cat_2 );
_cat_2.visible = true;
myGame.scene(0).addChild(_cat_2);

var _cup_3= Alice.Object.fromImage('./Resources/Assets/cup.png');
_cup_3.name = '_cup_3';
_cup_3.anchor.set(0.5, 0.5);
_cup_3.x = 300.35416666666663;
_cup_3.y = 121.33333333333333;
_cup_3.scale.set(0.6666666666666666, 0.6666666666666666);
reaction.makeClickable( _cup_3 );
reaction.makeUnDraggable( _cup_3 );
_cup_3.visible = true;
myGame.scene(0).addChild(_cup_3);


//================interaction=====================

//-------------COMBINE--------------
myGame.eventSystem.addCombineEvent(_blender_4, _cat_2, function(){
	reaction.makeObjInvisible(_cat_2);
}); //interaction end

myGame.start(0);