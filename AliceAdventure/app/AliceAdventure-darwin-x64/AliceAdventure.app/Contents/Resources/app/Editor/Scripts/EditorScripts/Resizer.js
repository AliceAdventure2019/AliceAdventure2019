'use strict';

var Resizer;

(function(){

const {PIXI} = require('./Utilities/Utilities');

Resizer = function() {
    this.helperContainer = null;
    this.graphics = null;
    this.curScene = null;
    this.curObj = null;
    
    this.init = function() {
        this.helperContainer = new PIXI.Container();
        this.graphics = new PIXI.Graphics();
        this.helperContainer.addChild(this.graphics);
        this.initSquares();
        this.helperContainer.visible = false;
    }
    
    this.initSquares = function() {
        for(var i = 0; i < 4; i++) {
            var sqr = this.createSquare(0,0);
                switch(i) {
                case 0:
                    sqr.tint = 0x00ff00;
                    break;
                case 1:
                    sqr.tint = 0x00ff00;
                    break;
                case 2:
                    sqr.tint = 0x00ff00;
                    break;
                case 3:
                    sqr.tint = 0x00ff00;
                    break;
                }
            sqr.idx = i;
            this.helperContainer.addChild(sqr);
        }
    }
    
    this.drawLines = function(rect) {
        this.graphics.clear();
        this.graphics.lineStyle(2, 0xffffff, 1);
        this.graphics.drawShape(rect);
    }
    
    this.setSquares = function(bound) {

        var center = {x: bound.x+bound.width/2, y:bound.y+bound.height/2}
        var cornerPos = [0,0,0,0]
        
        cornerPos[0] = [(this.curObj.scale.x > 0)? center.x - bound.width/2 : center.x + bound.width/2,
                        this.curObj.scale.y > 0? center.y - bound.height/2 : center.y + bound.height/2];
        
        cornerPos[1] = [(this.curObj.scale.x > 0)? center.x + bound.width/2 : center.x - bound.width/2,
                        this.curObj.scale.y > 0? center.y - bound.height/2 : center.y + bound.height/2];
        
        cornerPos[2] = [(this.curObj.scale.x > 0)? center.x - bound.width/2 : center.x + bound.width/2,
                        this.curObj.scale.y > 0? center.y + bound.height/2 : center.y - bound.height/2];
        
        cornerPos[3] = [(this.curObj.scale.x > 0)? center.x + bound.width/2 : center.x - bound.width/2,
                        this.curObj.scale.y > 0? center.y + bound.height/2 : center.y - bound.height/2];
        
        
        
        for(var i = 0; i < 4; i++) {
            this.helperContainer.getChildAt(i+1).position.set(cornerPos[i][0],cornerPos[i][1]);
        }
 
    }
    
    
    this.createSquare = function(x, y) {
        var square = new PIXI.Sprite(PIXI.Texture.WHITE);
        square.factor = 1;
        square.anchor.set(0.5);
        square.position.set(x, y);
        square.interactive = true;
        
        square.buttonMode = true;
        square.cursor = 'crosshair'
        square
                .on('pointerdown', helperDragStart)
                .on('pointerup', helperDragEnd)
                .on('pointerupoutside', helperDragEnd)
                .on('pointermove', helperDragMove);

        return square;
    }
    
    this.showHelper = function(_obj, _scene) {
        this.curScene = _obj.parent;
        this.curObj = _obj;
        
        this.setSquares(this.curObj.getBounds());
        this.drawLines(this.curObj.getBounds());
        this.helperContainer.visible = true;
        this.curScene.addChild(this.helperContainer)
    }
    
    this.hideHelper = function() {
        if(this.curScene && this.curObj)
        {
            this.graphics.clear();
            this.curScene.removeChild(this.helperContainer);
            this.curScene = null;
            this.curObj = null;
            this.helperContainer.visible = false;
        }
    }
    
    this.updateSquares = function(dragSqr) {
        var x_up = ((dragSqr.idx == 0)||(dragSqr.idx == 2)) ? (this.curObj.x - dragSqr.x) : (dragSqr.x - this.curObj.x)
        var y_up = ((dragSqr.idx == 0)||(dragSqr.idx == 1)) ? (this.curObj.y - dragSqr.y) : (dragSqr.y - this.curObj.y)
        
        var x_scale = x_up/(this.curObj.texture.orig.width/2)
        var y_scale = y_up/(this.curObj.texture.orig.height/2)
        
        this.curObj.scale.set(x_scale,y_scale);
        this.updateBox();
    }

    this.updateBox = function(){        
        this.drawLines(this.curObj.getBounds());
        this.setSquares(this.curObj.getBounds());
    }
    
    this.init();
};

function helperDragStart(event) {
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
   
}

function helperDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
}

function helperDragMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
        helper.updateSquares(this);
    }
}


var helper = new Resizer();

module.exports = helper;

})();