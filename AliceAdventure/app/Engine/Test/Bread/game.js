var myGame = new GameManager();
myGame.init(1280,720,5);
myGame.sceneManager.createScenes(2);

///------------------------------------------------------------///

var back = Alice.Object.fromImage(baseURL.nomalAssets + 'room_basic.png');
back.anchor.set(0.5);
back.x = myGame.screenWidth / 2;
back.y = myGame.screenHeight / 2;
back.name = "back";
myGame.scene(0).addChild(back);


var door = Alice.Object.fromImage(baseURL.nomalAssets + 'door.png');
door.anchor.set(0.5);
door.x = myGame.screenWidth / 2;
door.y = myGame.screenHeight / 2 + 5;
door.scale.set(1);
door.name = "door";
myGame.scene(0).addChild(door);


var door2 = Alice.Object.fromImage(baseURL.nomalAssets + 'door_open.png');
door2.anchor.set(0.5);
door2.x = myGame.screenWidth / 2;
door2.y = myGame.screenHeight / 2 + 5;
door2.scale.set(1);
door2.visible = false;
door2.name = "door2";
myGame.scene(0).addChild(door2);


var key = Alice.Object.fromImage(baseURL.nomalAssets + 'key.png');
key.anchor.set(0.5);
key.x = 900;
key.y = 600;
key.scale.set(0.7);
key.visible = false;
key.name = "key";
key.interactive = true;
key.buttonMode = true;
key.on('pointerdown',function() {
    myGame.inventory.add(key);
})

//key.interactionSystem = new InteractionSystem(key);
//
////interctions editor
//var tempInteraction = new Interaction();
//tempInteraction.reaction = function() {
//    myGame.inventory.add(key);
//}
//key.interactionSystem.clickCollection.add(tempInteraction)
//
//tempInteraction = new Interaction();
//tempInteraction.reaction = function() {
//    myGame.messageBox.startConversation(["It is a key"]);
//}

//key.interactionSystem.InventoryObserve.add(tempInteraction)


myGame.scene(0).addChild(key);


var cat = Alice.Object.fromImage(baseURL.nomalAssets + 'cat.png');
cat.anchor.set(0.5);
cat.x = 250;
cat.y = 500;
cat.scale.set(0.8);
cat.name = "cat";
cat.interactive = true;
cat.buttonMode = true;
cat.on('pointerdown',function() {
    myGame.inventory.add(cat);
})

myGame.scene(0).addChild(cat);


var slime = Alice.Object.fromImage(baseURL.nomalAssets + 'slime.png');
slime.anchor.set(0.5);
slime.x = 500;
slime.y = 600;
slime.scale.set(1.2);
slime.name = "slime";
slime.interactive = true;
slime.buttonMode = true;
slime.on('pointerdown',function() {
    myGame.inventory.add(slime);
})

myGame.scene(0).addChild(slime);


//register events

myGame.inventory.interactionSystem.addUsedEvent(key,door,function(){
    door.visible = false;
    door2.visible = true;
    myGame.inventory.remove(key);
});


myGame.inventory.interactionSystem.addObserveEvent(key,function(){
    myGame.messageBox.startConversation(["It is a key"]);
});


myGame.inventory.interactionSystem.addCombineEvent(cat,slime,function(){
    myGame.inventory.remove(cat);
    myGame.inventory.remove(slime);
    key.visible = true;
    myGame.inventory.add(key);
});



//--//
myGame.start();