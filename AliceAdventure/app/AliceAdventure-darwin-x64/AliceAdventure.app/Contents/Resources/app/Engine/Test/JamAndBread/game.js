

myGame.init(1280,720,5);

var reaction = myGame.reactionSystem;
//myGame.init(600,400,5);
//myGame.init(1280*2/4,720*2/4,5);
myGame.sceneManager.createScenes(3);
//myGame.states = {cat_is_feeded:false}
myGame.initStateManager({cat_is_feeded:false});

///------------------------------------------------------------///
//myGame.sound.add('meow_unhappy', baseURL.nomalAssets + 'meow_unhappy.wav');
//myGame.sound.add('meow_happy', baseURL.nomalAssets + 'meow_happy.wav');
//myGame.sound.add('door', baseURL.nomalAssets + 'door.wav');
//myGame.sound.add('win', baseURL.nomalAssets + 'win.wav');

myGame.soundManager.load('meow_unhappy', baseURL.nomalAssets + 'meow_unhappy.wav');
myGame.soundManager.load('bgm', baseURL.nomalAssets + 'bgm.wav');
myGame.soundManager.load('meow_happy', baseURL.nomalAssets + 'meow_happy.wav');
myGame.soundManager.load('door', baseURL.nomalAssets + 'door.wav');
myGame.soundManager.load('win', baseURL.nomalAssets + 'win.wav');

///-----------------------------------------------------------///

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
reaction.makeClickable(door);

//door.interactive = true;
//door.buttonMode = true;
//door.on('pointerdown',function() {
//    //myGame.sound.play('door');
//    reaction.playAudio('door');
//    //myGame.sceneManager.jumpToScene(1);
//    reaction.transitToScene(1);
//});

myGame.scene(0).addChild(door);

var cat = Alice.Object.fromImage(baseURL.nomalAssets + 'cat_sad.png');
cat.anchor.set(0.5);
cat.x = 250;
cat.y = 500;
cat.scale.set(0.8);
cat.name = "cat";
reaction.makeClickable(cat);
reaction.makeDraggable(cat);
//cat.interactive = true;
//cat.buttonMode = true;
myGame.scene(0).addChild(cat);


var cat_sad = Alice.Object.fromImage(baseURL.nomalAssets + 'cat.png');
cat_sad.anchor.set(0.5);
cat_sad.x = 250;
cat_sad.y = 500;
cat_sad.scale.set(0.8);
cat_sad.name = "cat_sad";
cat_sad.visible = false;
myGame.scene(0).addChild(cat_sad);


//-------------------------------------------//
var back2 = Alice.Object.fromImage(baseURL.nomalAssets + 'kitchen.png');
back2.anchor.set(0.5);
back2.x = myGame.screenWidth / 2;
back2.y = myGame.screenHeight / 2;
back2.name = "back2";
myGame.scene(1).addChild(back2);


var door2 = Alice.Object.fromImage(baseURL.nomalAssets + 'door.png');
door2.anchor.set(0.5);
door2.x = 330;
door2.y = 390;
door2.scale.set(0.9);
door2.name = "door2";
reaction.makeClickable(door2);

//door2.interactive = true;
//door2.buttonMode = true;
//door2.on('pointerdown',function() {
//    //myGame.sound.play('door');
//    reaction.playAudio('door');
//    //myGame.sceneManager.jumpToScene(0);
//    reaction.transitToScene(0);
//});

myGame.scene(1).addChild(door2);


var knife = Alice.Object.fromImage(baseURL.nomalAssets + 'knife.png');
knife.anchor.set(0.5);
knife.x = 680;
knife.y = 300;
knife.scale.set(0.3);
knife.name = "knife";
//knife.interactive = true;
//knife.buttonMode = true;
reaction.makeClickable(knife);
//knife.on('pointerdown',function() {
//    //myGame.inventory.add(knife);
//    reaction.addToInventory(knife);
//});

myGame.scene(1).addChild(knife);

var jam = Alice.Object.fromImage(baseURL.nomalAssets + 'jam.png');
jam.anchor.set(0.5);
jam.x = 1030;
jam.y = 300;
jam.scale.set(0.3);
jam.name = "jam";
//jam.interactive = true;
//jam.buttonMode = true;
reaction.makeClickable(jam);
//jam.on('pointerdown',function() {
//    //myGame.inventory.add(jam);
//    reaction.addToInventory(jam);
//});

myGame.scene(1).addChild(jam);


var bread = Alice.Object.fromImage(baseURL.nomalAssets + 'bread.png');
bread.anchor.set(0.5);
bread.x = 550;
bread.y = 400;
bread.scale.set(0.4);
bread.name = "bread";
//bread.interactive = true;
//bread.buttonMode = true;
reaction.makeClickable(bread);


myGame.scene(1).addChild(bread);


var breadwithjam = Alice.Object.fromImage(baseURL.nomalAssets + 'breadwithjam.png');
breadwithjam.anchor.set(0.5);
breadwithjam.x = 550;
breadwithjam.y = 400;
breadwithjam.scale.set(0.4);
breadwithjam.name = "breadwithjam";
breadwithjam.visible = false;
myGame.scene(1).addChild(breadwithjam);

var knifewithjam = Alice.Object.fromImage(baseURL.nomalAssets + 'knifewithjam.png');
knifewithjam.anchor.set(0.5);
knifewithjam.x = 550;
knifewithjam.y = 400;
knifewithjam.scale.set(0.4);
knifewithjam.name = "knifewithjam";
knifewithjam.visible = false;
myGame.scene(1).addChild(knifewithjam);



var winScene = Alice.Object.fromImage(baseURL.nomalAssets + 'win.png');
winScene.anchor.set(0.5);
winScene.x = myGame.screenWidth / 2;
winScene.y = myGame.screenHeight / 2;
winScene.name = "winScene";
myGame.scene(2).addChild(winScene);


//register events


var cat2 = Alice.Object.fromImage(baseURL.nomalAssets + 'cat_sad.png');
cat2.anchor.set(0.5);
cat2.x = 250;
cat2.y = 500;
cat2.scale.set(0.8);
cat2.name = "cat2";
reaction.makeClickable(cat2);
reaction.makeDraggable(cat2);
//cat.interactive = true;
//cat.buttonMode = true;
myGame.scene(0).addChild(cat2);
cat2.DIY_CLICK = function() {
    //console.log("in DIY function");
    reaction.addToInventory(cat2);
}

var cat3 = Alice.Object.fromImage(baseURL.nomalAssets + 'cat_sad.png');
cat3.anchor.set(0.5);
cat3.x = 250;
cat3.y = 500;
cat3.scale.set(0.8);
cat3.name = "cat3";
reaction.makeClickable(cat3);
reaction.makeDraggable(cat3);
myGame.scene(0).addChild(cat3);
cat3.DIY_CLICK = function() {
    //console.log("in DIY function");
    reaction.addToInventory(cat3);
}

var cat4 = Alice.Object.fromImage(baseURL.nomalAssets + 'cat_sad.png');
cat4.anchor.set(0.5);
cat4.x = 250;
cat4.y = 500;
cat4.scale.set(0.8);
cat4.name = "cat4";
reaction.makeClickable(cat4);
reaction.makeDraggable(cat4);
myGame.scene(0).addChild(cat4);
cat4.DIY_CLICK = function() {
    //console.log("in DIY function");
    reaction.addToInventory(cat4);
}


var cat5 = Alice.Object.fromImage(baseURL.nomalAssets + 'cat_sad.png');
cat5.anchor.set(0.5);
cat5.x = 250;
cat5.y = 500;
cat5.scale.set(0.8);
cat5.name = "cat5";
reaction.makeClickable(cat5);
reaction.makeDraggable(cat5);
myGame.scene(0).addChild(cat5);
cat5.DIY_CLICK = function() {
    //console.log("in DIY function");
    reaction.addToInventory(cat5);
}




cat.DIY_CLICK = function() {
    //console.log("in DIY function");
    reaction.playAudio("meow_unhappy");
    myGame.messageBox.startConversation(["Hungry........................ ............."], function() {
            myGame.messageBox.startConversation(["Want a bread with jam.."], function() {
            });
        });
}

//cat.DIY_DROP = function() {
//    console.log("in DIYDROP function");
//}

door.DIY_CLICK = function(){
    reaction.playAudio('door');
    reaction.stopAudio('meow_unhappy');
    reaction.transitToScene(1);
};

door2.DIY_CLICK = function(){
    reaction.playAudio('door');
    reaction.transitToScene(0);
};

jam.DIY_CLICK = function() {
    //myGame.inventory.add(jam);
    reaction.addToInventory(jam);
    reaction.playAudio('add');
}

knife.DIY_CLICK = function() {
    //myGame.inventory.add(knife);
    reaction.addToInventory(knife);
    reaction.playAudio('add');
}


bread.DIY_CLICK = function() {
    //myGame.inventory.add(bread);
    reaction.addToInventory(bread);
    reaction.playAudio('add');
}



myGame.eventSystem.addCombineEvent(knife,jam,function(){
    reaction.playAudio('good');
    //myGame.inventory.remove(knife);
    //reaction.removeFromInventory(knife);
    reaction.makeObjInvisible(knife);
    //myGame.inventory.remove(jam);
    //reaction.removeFromInventory(jam);
    reaction.makeObjInvisible(jam);
    //knifewithjam.visible = true;
    reaction.makeObjVisible(knifewithjam);
    //myGame.inventory.add(knifewithjam);
    reaction.addToInventory(knifewithjam);

});

myGame.eventSystem.addCombineEvent(knifewithjam,bread,function(){
    reaction.playAudio('good');
    //myGame.inventory.remove(knifewithjam);
    //reaction.removeFromInventory(knifewithjam);
    reaction.makeObjInvisible(knifewithjam);
    //myGame.inventory.remove(bread);
    //reaction.removeFromInventory(bread);
    //reaction.makeObjInvisible(bread);
    reaction.removeObject(bread);
    //breadwithjam.visible = true;
    reaction.makeObjVisible(breadwithjam);
    //myGame.inventory.add(breadwithjam);
    reaction.addToInventory(breadwithjam);
});



myGame.eventSystem.addUsedEvent(breadwithjam,cat,function(){
    
    //cat.visible = false;
    reaction.makeObjInvisible(cat);
    //cat_sad.visible = true;
    reaction.makeObjVisible(cat_sad);
    //myGame.inventory.remove(breadwithjam);
    //reaction.removeFromInventory(breadwithjam);
    //reaction.makeObjInvisible(breadwithjam);
    //myGame.sound.play("meow_happy");
    reaction.playAudio("meow_happy");
    
    myGame.messageBox.startConversation(["Yummy","I love you ~"], function(){
        //myGame.stateManager.setState('cat_is_feeded', true)
        //myGame.stateManager.setState('cat_is_feeded', true)
        reaction.setState('cat_is_feeded',true);
    });
    
});


myGame.eventSystem.addStateEvent('cat_is_feeded', true, function(){
    //myGame.sound.play('win');
    reaction.playAudio("win");
    //myGame.sceneManager.jumpToScene(2);
    reaction.transitToScene(2);
    //myGame.hideInventory();
    reaction.hideInventory();
})

myGame.eventSystem.addSceneTransitEvent(1, function(){
    myGame.messageBox.startConversation(["There are some ingredient...", "On the table..."]);
})

myGame.eventSystem.addSceneTransitEvent(0, function(){
    myGame.messageBox.startConversation(["A cat?"]);
})



//cat.on('pointerdown',function() {
//    reaction.moveObjectToScene(cat,1);
//});


//--//
myGame.start(0);