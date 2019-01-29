/*****************************************************

                    Main.js

*****************************************************/

var stage = new PIXI.Container();

function init() {
  renderer.backgroundColor = 0x22a7f0;
  renderer.render(stage);
  loop();
}

function loop() {
  requestAnimationFrame(loop);
  renderer.render(stage);
}
