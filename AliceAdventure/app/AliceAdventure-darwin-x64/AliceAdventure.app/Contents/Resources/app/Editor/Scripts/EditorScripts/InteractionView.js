'use strict';

const {Event} = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');
const Interaction = require('./Interaction');
const View = require('./View');

// class
var InteractionView;

// variables
InteractionView = function(_bindElementID, _height = -1, _width = -1){
	View.call(this, "InteractionView", _height, _width, _bindElementID);

	this.vModel = null;
};
InteractionView.prototype = new View();

// static
InteractionView.NewView = function(_elementID){
	var view = new InteractionView(_elementID);
	view.InitView();
	return view;
};

// functions
InteractionView.prototype.InitView = function(){
	View.prototype.InitView.apply(this); // call super method
	// Init data binding
	this.vModel = new Vue({
		el: '#' + this.bindElementID,
		data: {
			viewEnabled: false, 
			interactions: null,
            objects: null,
            states: null,
            scenes: null,
            sounds: null,
            isDraggingReact: false,
		}, 
		methods: {
            initBox:(ntra, el) => {
                                    console.log(el);
                                   //InteractionView.prototype.initBox(ntra, el)
                                  },
            
            resizeClick: (ev, ntra) => {InteractionView.prototype.minimizeWindow(ev,ntra)},
            editTitle: (ev, ntra) => {InteractionView.prototype.editInPlace(ev,ntra)},
			eventDragover: (ev)=>{View.HandleDragover(ev, View.DragInfo.IEvent);},
			eventDrop: (ev, ntra)=>{View.HandleDrop(ev, View.DragInfo.IEvent, (data)=>{ntra.SetIEvent(data);});}, 
			stateDragover: (ev)=>{View.HandleDragover(ev, View.DragInfo.State);},
			stateDrop: (ev, ntra)=>{View.HandleDrop(ev, View.DragInfo.State, (data)=>{ntra.AddCondition(data);});}, 
			reactionDragover: (ev)=>{View.HandleDragover(ev, View.DragInfo.IReaction);},
			reactionDrop: (ev, ntra)=>{View.HandleDrop(ev, View.DragInfo.IReaction, (data)=>{ntra.AddIReaction(data);});}, 
			addInteraction: ()=>{this.AddNewInteraction();}, 
			deleteInteraction: (ntra)=>{ntra.DeleteThis();}, 
			removeCondition: (state, ntra)=>{ntra.RemoveCondition(state);}, 
			deleteReaction: (react, ntra)=>{ntra.DeleteIReaction(react);},
            
            //order:
            reactDragStart: (ev, d)=>{View.HandleDragstart(ev, View.DragInfo.ListedIReaction, d); ev.stopPropagation();},
            reactDragover: (ev)=>{View.HandleDragover(ev, View.DragInfo.ListedIReaction, ()=>{
                //console.log(ev.target);
            });},
            reactDrop: (ev, aboveReactIndex, toNtra)=>{View.HandleDrop(ev, View.DragInfo.ListedIReaction, (data)=>{
                
                //console.log(data)
                //console.log(typeof(data.index))
                if(toNtra.id == data.fromNtra.id) {
                    //console.log("the same list");
                    toNtra.moveElemAfterElemInList(data.reactIndex, aboveReactIndex, toNtra.reactionList)
                }
                else {
                    //console.log("the diff list");
                    var endOfthelist = toNtra.AddExistIReaction(data.react);
                    toNtra.moveElemAfterElemInList(endOfthelist, aboveReactIndex, toNtra.reactionList)
                    //console.log(endOfthelist + ":" + aboveReactIndex)
                    data.fromNtra.DeleteIReaction(data.react);
                }
                
            });}, 
		}
	});

    
	// events
	Event.AddListener("reload-project", ()=>{this.ReloadView();});
};



InteractionView.prototype.ReloadView = function(){
	View.prototype.ReloadView.apply(this); // call super method

	if (GameProperties.ProjectLoaded()){
		this.vModel.viewEnabled = true;
		this.vModel.interactions = GameProperties.instance.interactionList;
        this.vModel.objects = GameProperties.instance.objectList;
        this.vModel.states = GameProperties.instance.stateList;
        this.vModel.scenes = GameProperties.instance.sceneList;
        this.vModel.sounds = GameProperties.instance.soundList;
	} else {
		this.vModel.viewEnabled = false;
		this.vModel.interactions = null;
        this.vModel.objects = null;
        this.vModel.states = null;
        this.vModel.scenes = null;
        this.vModel.sounds = null;
	}
};

InteractionView.prototype.AddNewInteraction = function(){
	if (this.vModel.viewEnabled) {
		Interaction.NewInteraction();
	}
};

InteractionView.prototype.initBox = function(elem, ntra) {
    console.log(elem)
//        var eventTarget = event.target.parentNode;
//  		var targetImg = event.target.closest('#interaction-box-minimize');
//  		var target = eventTarget.closest('.interaction-box');
//    	var targetChildren = target.childNodes;
//   		var minimizeSrc = document.getElementById("interaction-box-minimize").getAttribute("min-src");
//   		var maxmizeSrc = document.getElementById("interaction-box-minimize").getAttribute("max-src");
//    
//        if(ntra.max == true){
//            targetImg.src = minimizeSrc;
//    	    target.style.width = null;
//            for(var k=0;k<targetChildren.length;k++){
//                if(targetChildren[k].tagName === 'UL' || targetChildren[k].tagName === 'H6'){
//                    targetChildren[k].style.display = 'block';
//                }
//            }
//            
//        }else {
//            targetImg.src = maxmizeSrc;
//            for(var i=0;i<targetChildren.length;i++){
//                if(targetChildren[i].tagName === 'UL' || targetChildren[i].tagName === 'H6'){
//                    targetChildren[i].style.display = 'none';
//                }
//            }
//    	   target.style.width = '250px'; 
//        }
    
        console.log("here")
}

InteractionView.prototype.minimizeWindow = function(event, ntra){
  		var eventTarget = event.target.parentNode;
  		var targetImg = event.target.closest('#interaction-box-minimize');
  		var target = eventTarget.closest('.interaction-box');
    	var targetChildren = target.childNodes;
   		var minimizeSrc = document.getElementById("interaction-box-minimize").getAttribute("min-src");
   		var maxmizeSrc = document.getElementById("interaction-box-minimize").getAttribute("max-src");
    
    if(ntra.max == true){
    	//target.setAttribute("max",'false');
    	ntra.max = false;
        targetImg.src = maxmizeSrc;
    	//console.log("let's minimize");
    	//console.log(target.max);
    	for(var i=0;i<targetChildren.length;i++){
    		if(targetChildren[i].tagName === 'UL' || targetChildren[i].tagName === 'H6'){
    			targetChildren[i].style.display = 'none';
    		}
    	}
    	target.style.width = '250px';

    } else{
    	//target.setAttribute("max",'true');
        ntra.max = true;
    	targetImg.src = minimizeSrc;
    	target.style.width = null;

    	//console.log("let's maxmize");
    	for(var k=0;k<targetChildren.length;k++){
    		if(targetChildren[k].tagName === 'UL' || targetChildren[k].tagName === 'H6'){
    			targetChildren[k].style.display = 'block';
    		}
    	}
    }
  }

InteractionView.prototype.editInPlace = function(event, ntra){
			
                    //console.log(event);
                
					var targetTitle = event.target || event.srcElement;
					targetTitle.setAttribute('oldText', targetTitle.innerHTML); // not actually required. I use target just in case you want to cancel and set the original text back.
					var origianalText = targetTitle.innerHTML;

					var textBox = document.createElement('INPUT');
						textBox.setAttribute('type', 'text');
						textBox.style['width'] ='100px';
						textBox.value = targetTitle.innerHTML;

						
						textBox.onblur = function() {
							
							var newValue = textBox.value; //targetTitle.value
							//console.log("on blur");
							//console.log(newValue);

							if(newValue === ''){
								console.log("null detected");
								//targetTitle.parentNode.innerHTML = origianalText;
								targetTitle.innerHTML = origianalText;

							} else {
								if(newValue.length >25){
									alert("Name should be less than 25 characters");
									targetTitle.innerHTML = origianalText;
									//targetTitle.parentNode.innerHTML = origianalText;
								} else {
									//if (obj == null){
										targetTitle.innerHTML = newValue;
                                        ntra.title = newValue;
									//} else {
										//obj.name = newValue;
									 //targetTitle.parentNode.innerHTML = newValue;
									//}
								 }
							}
						 // alert("Your new value: \n\n" + newValue);
						}

					targetTitle.innerHTML = '';

					targetTitle.appendChild(textBox);
			
		}

module.exports = InteractionView;