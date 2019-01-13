
//===============create Game==================
var myGame = new GameManager();
 myGame.init(640,360,5);

//===============add Sound==================
myGame.sound.add('door_23', './Resources/Assets/door.wav');
myGame.sound.add('meow_happy_24', './Resources/Assets/meow_happy.wav');
myGame.sound.add('meow_unhappy_25', './Resources/Assets/meow_unhappy.wav');
myGame.sound.add('win_26', './Resources/Assets/win.wav');

//===============create Scene================
myGame.sceneManager.createScenes(3);

//===============create States================
myGame.initStateManager({});

//===============create Objects==================

var Living_room_2= Alice.Object.fromImage('./Resources/Assets/room_basic.png');
Living_room_2.name = 'Living_room_2';
Living_room_2.anchor.set(0.5, 0.5);
Living_room_2.x = 320;
Living_room_2.y = 180;
Living_room_2.scale.set(0.5, 0.5);
Living_room_2.interactive = false;
Living_room_2.buttonMode = false;
Living_room_2.visible = true;
myGame.scene(0).addChild(Living_room_2);

var Door1_3= Alice.Object.fromImage('./Resources/Assets/door.png');
Door1_3.name = 'Door1_3';
Door1_3.anchor.set(0.5, 0.5);
Door1_3.x = 398;
Door1_3.y = 184;
Door1_3.scale.set(0.5, 0.5);
Door1_3.interactive = true;
Door1_3.buttonMode = true;
Door1_3.visible = true;
myGame.scene(0).addChild(Door1_3);

var Cat_4= Alice.Object.fromImage('./Resources/Assets/cat.png');
Cat_4.name = 'Cat_4';
Cat_4.anchor.set(0.5, 0.5);
Cat_4.x = 183;
Cat_4.y = 239;
Cat_4.scale.set(0.4, 0.4);
Cat_4.interactive = true;
Cat_4.buttonMode = true;
Cat_4.visible = true;
myGame.scene(0).addChild(Cat_4);

var Kitchen_5= Alice.Object.fromImage('./Resources/Assets/kitchen.png');
Kitchen_5.name = 'Kitchen_5';
Kitchen_5.anchor.set(0.5, 0.5);
Kitchen_5.x = 320;
Kitchen_5.y = 180;
Kitchen_5.scale.set(0.5, 0.5);
Kitchen_5.interactive = false;
Kitchen_5.buttonMode = false;
Kitchen_5.visible = true;
myGame.scene(1).addChild(Kitchen_5);

var Door2_6= Alice.Object.fromImage('./Resources/Assets/door.png');
Door2_6.name = 'Door2_6';
Door2_6.anchor.set(0.5, 0.5);
Door2_6.x = 164;
Door2_6.y = 192;
Door2_6.scale.set(0.45, 0.45);
Door2_6.interactive = true;
Door2_6.buttonMode = true;
Door2_6.visible = true;
myGame.scene(1).addChild(Door2_6);

var Knife_7= Alice.Object.fromImage('./Resources/Assets/knife.png');
Knife_7.name = 'Knife_7';
Knife_7.anchor.set(0.5, 0.5);
Knife_7.x = 345;
Knife_7.y = 139;
Knife_7.scale.set(0.3, 0.3);
Knife_7.interactive = true;
Knife_7.buttonMode = true;
Knife_7.visible = true;
myGame.scene(1).addChild(Knife_7);

var Bread_8= Alice.Object.fromImage('./Resources/Assets/bread.png');
Bread_8.name = 'Bread_8';
Bread_8.anchor.set(0.5, 0.5);
Bread_8.x = 268;
Bread_8.y = 185;
Bread_8.scale.set(0.3, 0.3);
Bread_8.interactive = true;
Bread_8.buttonMode = true;
Bread_8.visible = true;
myGame.scene(1).addChild(Bread_8);

var Jam_9= Alice.Object.fromImage('./Resources/Assets/jam.png');
Jam_9.name = 'Jam_9';
Jam_9.anchor.set(0.5, 0.5);
Jam_9.x = 504;
Jam_9.y = 135;
Jam_9.scale.set(0.3, 0.3);
Jam_9.interactive = true;
Jam_9.buttonMode = true;
Jam_9.visible = true;
myGame.scene(1).addChild(Jam_9);

var Knife_with_jam_16= Alice.Object.fromImage('./Resources/Assets/knifewithjam.png');
Knife_with_jam_16.name = 'Knife_with_jam_16';
Knife_with_jam_16.anchor.set(0.5, 0.5);
Knife_with_jam_16.x = 72;
Knife_with_jam_16.y = 69;
Knife_with_jam_16.scale.set(0.5, 0.5);
Knife_with_jam_16.interactive = false;
Knife_with_jam_16.buttonMode = false;
Knife_with_jam_16.visible = false;
myGame.scene(1).addChild(Knife_with_jam_16);

var Bread_with_jam_17= Alice.Object.fromImage('./Resources/Assets/breadwithjam.png');
Bread_with_jam_17.name = 'Bread_with_jam_17';
Bread_with_jam_17.anchor.set(0.5, 0.5);
Bread_with_jam_17.x = 82;
Bread_with_jam_17.y = 81;
Bread_with_jam_17.scale.set(0.5, 0.5);
Bread_with_jam_17.interactive = false;
Bread_with_jam_17.buttonMode = false;
Bread_with_jam_17.visible = false;
myGame.scene(1).addChild(Bread_with_jam_17);

var Win_22= Alice.Object.fromImage('./Resources/Assets/win.png');
Win_22.name = 'Win_22';
Win_22.anchor.set(0.5, 0.5);
Win_22.x = 320;
Win_22.y = 180;
Win_22.scale.set(0.5, 0.5);
Win_22.interactive = false;
Win_22.buttonMode = false;
Win_22.visible = true;
myGame.scene(2).addChild(Win_22);


//================interaction=====================

//--------------Click--------------
Door1_3.on('pointerdown', function(){
	myGame.sceneManager.jumpToScene(1);
	myGame.sound.play('door_23');

}); //interaction end

//--------------Click--------------
Door2_6.on('pointerdown', function(){
	myGame.sceneManager.jumpToScene(0);
	myGame.sound.play('door_23');

}); //interaction end

//--------------Click--------------
Knife_7.on('pointerdown', function(){
	myGame.inventory.add(Knife_7);

}); //interaction end

//--------------Click--------------
Bread_8.on('pointerdown', function(){
	myGame.inventory.add(Bread_8);

}); //interaction end

//--------------Click--------------
Jam_9.on('pointerdown', function(){
	myGame.inventory.add(Jam_9);

}); //interaction end

//-------------COMBINE--------------
myGame.inventory.interactionSystem.addCombineEvent(Knife_7, Jam_9, function(){
	myGame.inventory.remove(Knife_7);
	myGame.inventory.remove(Jam_9);
	Knife_with_jam_16.visible = true;
	myGame.inventory.add(Knife_with_jam_16);

}); //interaction end

//-------------COMBINE--------------
myGame.inventory.interactionSystem.addCombineEvent(Knife_with_jam_16, Bread_8, function(){
	myGame.inventory.remove(Knife_with_jam_16);
	myGame.inventory.remove(Bread_8);
	Bread_with_jam_17.visible = true;
	myGame.inventory.add(Bread_with_jam_17);

}); //interaction end

//-------------USE--------------
myGame.inventory.interactionSystem.addUsedEvent(Bread_with_jam_17, Cat_4, function(){
	myGame.inventory.remove(Bread_with_jam_17);
	myGame.sound.play('meow_happy_24');
	myGame.messageBox.startConversation(['Yummy!'], function(){
		myGame.messageBox.startConversation(['I love you!'], function(){
			myGame.sceneManager.jumpToScene(2);
			myGame.sound.play('win_26');
			});//messageBox end
		});//messageBox end

}); //interaction end

//--------------Click--------------
Cat_4.on('pointerdown', function(){
	myGame.sound.play('meow_unhappy_25');
	myGame.messageBox.startConversation(['Meow....'], function(){
		myGame.messageBox.startConversation(['Want a bread with jam...'], function(){
			});//messageBox end
		});//messageBox end

}); //interaction end

myGame.start(0);