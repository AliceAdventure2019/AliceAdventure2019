var myGame = new GameManager();
myGame.init(1280,720,5);


// ----------------------------scene1------------------------------- //
var scene = new Alice.Scene();
myGame.sceneManager.addScene(scene);

var scene2 = new Alice.Scene();
myGame.sceneManager.addScene(scene2);

// ----------------------------------------------------------------- //

var back = Alice.Object.fromImage('assets/alice/room_basic.png');
back.anchor.set(0.5);
back.x = myGame.screenWidth / 2;
back.y = myGame.screenHeight / 2;

scene.addChild(back);
    


var door = Alice.Object.fromImage('assets/alice/door.png');
door.anchor.set(0.5);
door.x = myGame.screenWidth / 2;
door.y = myGame.screenHeight / 2 + 5;
door.scale.set(1);
door.name = "door";
door.nextTexture = Alice.Texture.fromImage('assets/alice/door_open.png');

door.interact = function() {
    this.setTexture(this.nextTexture);
    this.interactive = true;
    this.buttonMode = true;
    
    this.on('pointerdown', this.onClick);
}

door.onClick = function() {
    myGame.sceneManager.nextScene();
}


scene.addChild(door);


var key = Alice.Object.fromImage('assets/alice/key.png');
key.anchor.set(0.5);
key.x = 900;
key.y = 500;
key.scale.set(0.7);
key.interactive = true;
key.buttonMode = true;
key.name = "key";
key.target = door; // init sequence matters

//user overload methods
key.use = function() {
    
}

key.use = function() {
    this.target.interact();
    myGame.inventory.remove(this);
    console.log("done");
}

key.onClick = function() {
    myGame.inventory.add(this);
}
key.on('pointerdown', key.onClick);


scene.addChild(key);


var cat = Alice.Object.fromImage('assets/alice/cat.png');
cat.anchor.set(0.5);
cat.x = 250;
cat.y = 500;
cat.scale.set(0.8);

cat.interactive = true;
cat.buttonMode = true;
cat.name = "key2";

cat.onClick = function() {
    myGame.inventory.add(this);
}

cat.on('pointerdown', cat.onClick);

scene.addChild(cat);


var boss = Alice.AnimatedObject.fromImages(['assets/alice/boss/boss3_idle1.png','assets/alice/boss/boss3_idle2.png','assets/alice/boss/boss3_idle3.png','assets/alice/boss/boss3_idle4.png']);
boss.anchor.set(0.5);
boss.x = 1000;

boss.y = 200;
boss.scale.set(0.8);
boss.animationSpeed = 0.3;
boss.play();
boss.update = function(delta) {
    this.rotation += 0.01 * delta;
} 

boss.interactive = true;
boss.buttonMode = true;

boss.onClick = function() {
    myGame.messageBox.startConversation(['Haha','You are here','Get me out of this stupid room!']);
    console.log("clicked");
}

boss.on('pointerdown', boss.onClick);


scene.addChild(boss);

//update
myGame.app.ticker.add(function(delta) {
    boss.rotation += 0.01;
});


// ----------------------------scene2--------------------------------//


var back2 = Alice.Object.fromImage('assets/alice/backdrop.png');
back2.anchor.set(0.5);
back2.x = myGame.screenWidth / 2;
back2.y = myGame.screenHeight / 2;

scene2.addChild(back2);

var robot = Alice.Object.fromImage('assets/alice/robot.png');
robot.anchor.set(0.5);
robot.scale.set(1.4);
robot.x = myGame.screenWidth / 2;
robot.y = myGame.screenHeight / 2;

scene2.addChild(robot);



var paint = Alice.Object.fromImage('assets/alice/whitepaint.png');
paint.anchor.set(0.5);
paint.x = 300;
paint.y = 500;
paint.name = "paint";

scene2.addChild(paint);


var cone = Alice.Object.fromImage('assets/alice/redcone.png');
cone.anchor.set(0.5);
cone.x = 900;
cone.y = 500;
cone.scale.set(1.2);
cone.interactive = true;
cone.buttonMode = true;
cone.name = "key";
cone.target = paint; // init sequence matters

cone.nextTexture = Alice.Texture.fromImage('assets/alice/whitecone.png');

cone.use = function() {
    this.setTexture(this.nextTexture);
    myGame.inventory.add(this);
};

cone.onClick = function() {
    myGame.inventory.add(this);
};

cone.on('pointerdown', cone.onClick);

scene2.addChild(cone);

//////////////////////////////////////////////////////////////


myGame.start();


