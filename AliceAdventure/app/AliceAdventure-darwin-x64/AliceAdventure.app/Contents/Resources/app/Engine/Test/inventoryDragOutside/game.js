
//===============create Game==================
myGame.init(1280,960,5);

//===============add Sound==================
myGame.soundManager.load('correct_2', './Resources/Assets/correct.mp3');
myGame.soundManager.load('wrong_3', './Resources/Assets/wrong.wav');
myGame.soundManager.load('lock_4', './Resources/Assets/lock.wav');
myGame.soundManager.load('unlock_5', './Resources/Assets/unlock.wav');
myGame.soundManager.load('put_6', './Resources/Assets/put.wav');
myGame.soundManager.load('win_7', './Resources/Assets/win.wav');
myGame.soundManager.load('door_8', './Resources/Assets/door.wav');
myGame.soundManager.load('meow_1_9', './Resources/Assets/meow_happy.wav');
myGame.soundManager.load('meow_2_10', './Resources/Assets/meow_unhappy.wav');

//===============create Scene================
myGame.sceneManager.createScenes(2);

//===============create States================
myGame.initStateManager({hungry_14 : false});
var reaction = myGame.reactionSystem;

//===============create Objects==================

var _Backdrop_17= Alice.Object.fromImage('./Resources/Assets/backdrop.png');
_Backdrop_17.name = '_Backdrop_17';
_Backdrop_17.anchor.set(0.5, 0.5);
_Backdrop_17.x = 640;
_Backdrop_17.y = 480;
_Backdrop_17.scale.set(1.3333333333333333, 1.3333333333333333);
//reaction.makeClickable( _Backdrop_17 );
reaction.makeUnDraggable( _Backdrop_17 );
_Backdrop_17.visible = true;
myGame.scene(0).addChild(_Backdrop_17);

var _monster_11= Alice.Object.fromImage('./Resources/Assets/monster1.png');
_monster_11.name = '_monster_11';
_monster_11.anchor.set(0.5, 0.5);
_monster_11.x = 853.0834147135416;
_monster_11.y = 416.00002034505206;
_monster_11.scale.set(0.9260201313598355, 0.9423559662094689);
reaction.makeClickable( _monster_11 );
reaction.makeUnDraggable( _monster_11 );
_monster_11.visible = true;
myGame.scene(0).addChild(_monster_11);

var _Carblue_15= Alice.Object.fromImage('./Resources/Assets/car_blue.png');
_Carblue_15.name = '_Carblue_15';
_Carblue_15.anchor.set(0.5, 0.5);
_Carblue_15.x = 18.666666666666664;
_Carblue_15.y = 573.3333333333333;
_Carblue_15.scale.set(1.3333333333333333, 1.3333333333333333);
reaction.makeClickable( _Carblue_15 );
reaction.makeUnDraggable( _Carblue_15 );
_Carblue_15.visible = true;
myGame.scene(0).addChild(_Carblue_15);

var _toast_12= Alice.Object.fromImage('./Resources/Assets/breadwithjam.png');
_toast_12.name = '_toast_12';
_toast_12.anchor.set(0.5, 0.5);
_toast_12.x = 334.94449869791663;
_toast_12.y = 655.1111246744791;
_toast_12.scale.set(1.2182711226851852, 1.2958025896990741);
reaction.makeClickable( _toast_12 );
reaction.makeDraggable( _toast_12 );
_toast_12.visible = false;
myGame.scene(0).addChild(_toast_12);

var _Room_19= Alice.Object.fromImage('./Resources/Assets/room_basic.png');
_Room_19.name = '_Room_19';
_Room_19.anchor.set(0.5, 0.5);
_Room_19.x = 640;
_Room_19.y = 480;
_Room_19.scale.set(1.3333333333333333, 1.3333333333333333);
reaction.makeClickable( _Room_19 );
reaction.makeUnDraggable( _Room_19 );
_Room_19.visible = true;
myGame.scene(1).addChild(_Room_19);


//================interaction=====================

//-------------USE--------------
myGame.eventSystem.addUsedEvent(_toast_12, _monster_11, function(){
	if ((myGame.stateManager.states.hungry_14==true)){
		myGame.messageBox.startConversation(['This is delicious!'], function(){
			});//messageBox end
		return;
	}//if statement end
}); //interaction end

//--------------Click--------------
_Carblue_15.DIY_CLICK = function(){
	reaction.makeObjInvisible(_Carblue_15);
	reaction.makeObjVisible(_toast_12);
	reaction.setState('hungry_14', true);
}//interaction end

//--------------Click--------------
_toast_12.DIY_CLICK = function(){
	//reaction.addToInventory(_toast_12);
}//interaction end

myGame.start(0);