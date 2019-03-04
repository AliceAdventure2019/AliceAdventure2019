var myGame = new GameManager();
myGame.init(1280,720,5);

// ----------------------------scene1------------------------------- //
var scene = new Alice.Scene();
myGame.sceneManager.addScene(scene);

var scene2 = new Alice.Scene();
myGame.sceneManager.addScene(scene2);

// ----------------------------------------------------------------- //

var back = Alice.Object.fromImage(baseURL.nomalAssets + 'room_basic.png');
back.anchor.set(0.5);
back.x = myGame.screenWidth / 2;
back.y = myGame.screenHeight / 2;

scene.addChild(back);
    

var door = Alice.Object.fromImage(baseURL.nomalAssets + 'door.png');
door.anchor.set(0.5);
door.x = myGame.screenWidth / 2;
door.y = myGame.screenHeight / 2 + 5;
door.scale.set(1);
door.name = "door";
door.nextTexture = Alice.Texture.fromImage(baseURL.nomalAssets + 'door_open.png');

door.interact = function() {
    this.setTexture(this.nextTexture);
    this.interactive = true;
    this.buttonMode = true;
    
    this.on('pointerdown', this.onClick);
}

door.onClick = function() {
    myGame.messageBox.stopConversation();
    
    myGame.sceneManager.nextScene();
}


scene.addChild(door);


var key = Alice.Object.fromImage(baseURL.nomalAssets + 'key.png');
key.anchor.set(0.5);
key.x = 900;
key.y = 600;
key.scale.set(0.7);
key.interactive = true;
key.buttonMode = true;
key.name = "key";
key.target = door; // init sequence matters
key.dropMessage = "keyDropOnDoor"

key.on("keyDropOnDoor",function(){
    this.target.interact();
    myGame.inventory.remove(this);
    myGame.messageBox.startConversation(["Nice job! Thank you!"]);
});

//user overload methods
key.use = function() {
    
}

//key.use = function() {
//    this.target.interact();
//    myGame.inventory.remove(this);
//    myGame.messageBox.startConversation(["Nice job! Thank you!"]);
//    //console.log("done");
//}

key.onClick = function() {
    myGame.inventory.add(this);
}
key.on('pointerdown', key.onClick);


scene.addChild(key);


//----------------scene 2 ---------------------//


var back2 = Alice.Object.fromImage(baseURL.nomalAssets + 'room_basic.png');
back2.anchor.set(0.5);
back2.x = myGame.screenWidth / 2;
back2.y = myGame.screenHeight / 2;

scene2.addChild(back2);


var door2 = Alice.Object.fromImage(baseURL.nomalAssets + 'door.png');
door2.anchor.set(0.5);
door2.x = myGame.screenWidth / 2;
door2.y = myGame.screenHeight / 2 + 5;
door2.scale.set(1);
door2.name = "door";
door2.nextTexture = Alice.Texture.fromImage(baseURL.nomalAssets + 'door_open.png');

door2.interact = function() {
    this.setTexture(this.nextTexture);
    this.interactive = true;
    this.buttonMode = true;
    
    this.on('pointerdown', this.onClick);
}

door2.onClick = function() {
    myGame.messageBox.stopConversation();
    //myGame.sceneManager.previousScene();
    myGame.end();
    //myGame.sceneManager.nextScene();
}

scene2.addChild(door2);


var key2 = Alice.Object.fromImage(baseURL.nomalAssets + 'key.png');
key2.anchor.set(0.5);
key2.x = 400;
key2.y = 560;
key2.scale.set(0.7);
key2.interactive = true;
key2.buttonMode = true;
key2.name = "key";
key2.target = door2; // init sequence matters

//user overload methods
key2.use = function() {
    
}

key2.use = function() {
    this.target.interact();
    myGame.inventory.remove(this);
    //myGame.messageBox.startConversation(["Nice job! Thank you!"]);
    //console.log("done");
}

key2.onClick = function() {
    myGame.inventory.add(this);
}
key2.on('pointerdown', key2.onClick);
key2.visible = false;

scene2.addChild(key2);

var cat = Alice.Object.fromImage(baseURL.nomalAssets + 'cat.png');
cat.anchor.set(0.5);
cat.x = 250;
cat.y = 500;
cat.scale.set(0.8);

cat.interactive = true;
cat.buttonMode = true;
cat.name = "key2";


cat.stateMachine = new StateMachine([
    function() {
        myGame.messageBox.startConversation(["Want to open the door?", "Feed me!"]);
    },
    function() {
        myGame.messageBox.startConversation(["Just give me some food"]);
    },
    function() {
        myGame.messageBox.startConversation(["Ha! What a yummy slime!","Here. Take this key!"]);
    }
]);

cat.clickCount = 0;

cat.onClick = function() {
    //myGame.inventory.add(this);
    cat.clickCount++;
    if(cat.clickCount == 3)
       cat.stateMachine.nextState();
    
    (cat.stateMachine.getCurrentState())();
}

cat.key = key2;

cat.interact = function() {
    cat.key.visible = true;
    cat.stateMachine.setState(2);
    (cat.stateMachine.getCurrentState())();
}

cat.on('pointerdown', cat.onClick);

scene2.addChild(cat);


var slime = Alice.Object.fromImage(baseURL.nomalAssets + 'slime.png');
slime.anchor.set(0.5);
slime.x = 900;
slime.y = 600;
slime.scale.set(1.2);
slime.interactive = true;
slime.buttonMode = true;

slime.target = cat; // init sequence matters

slime.use = function() {
    this.target.interact();
    myGame.inventory.remove(this);
    //myGame.messageBox.startConversation(["Nice job! Thank you!"]);
    //console.log("done");
}

slime.onClick = function() {
    //fake:
    slime.update = function() {};
    myGame.inventory.add(this);
}

slime.on('pointerdown', slime.onClick);

slime.big = true;
slime.count = 0;
slime.update = function() {

    slime.count ++;
    if(slime.count > 30)
    {
        if(slime.big)
            slime.scale.set(1.3);
        else
            slime.scale.set(1);
        slime.big = !slime.big;
        slime.count = 0;
    }

}
//update
myGame.app.ticker.add(function(delta) {
    slime.update();
});

scene2.addChild(slime);


myGame.awake = function() {
    console.log("awake");
    myGame.messageBox.startConversation(["Help me!","I need to get out of the room!"]);
}


myGame.start();



