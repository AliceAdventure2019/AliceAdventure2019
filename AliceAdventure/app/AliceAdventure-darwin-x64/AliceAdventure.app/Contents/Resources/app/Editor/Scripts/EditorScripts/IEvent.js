'use strict';

const {Debug, ID} = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');

// class
var IEvent;

// variables
IEvent = function(_type, _args = []){
    this.type = _type;
    this.args = _args;
};

// static
IEvent.Library = [
	{
		type: 0,
		name: "Click on A",
		inputObjNum: 1, 
        template: '<select v-model="ntra.event.args[0]"><option v-for="obj in objects" v-html="obj.name" v-bind:value="obj.id"></option></select> is clicked'
	}, 
	{
		type: 1,
		name: "Use A on B",
		inputObjNum: 2, 
		template: '<select v-model="ntra.event.args[0]"><option v-for="obj in objects" v-html="obj.name" v-bind:value="obj.id"></option></select> is used on <select v-model="ntra.event.args[1]"><option v-for="obj in objects" v-html="obj.name" v-bind:value="obj.id"></option></select>'
	}, 
	/*{
		type: 2,
		name: "Observe A",
		inputObjNum: 1, 
		template: '<select v-model="ntra.event.args[0]"><option v-for="obj in objects" v-html="obj.name" v-bind:value="obj.id"></option></select> is observed'
	},*/
	{
		type: 3,
		name: "Combine A with B",
		inputObjNum: 2, 
		template: ''
	}, 
    {
        type: 4,
        name: "Change State",
        inputObjNum: 2, 
        template: ''
    }, 
    {
        type: 5,
        name: "Enter Scene",
        inputObjNum: 1, 
        template: ''
    }, 
];

IEvent.GetModel = function(type){
    IEvent.Library.foreach()
};

// functions
IEvent.prototype.toJsonObject = function() {
    var obj = {};
    obj.type = this.type;
    
    //switch
    let args = [];
    switch(obj.type) {
        case 0://click
            args[0] = (this.args[0])? this.args[0].id: null;
            break;
        case 1://use a on b
            args[0] = (this.args[0])? this.args[0].id: null;
            args[1] = (this.args[1])? this.args[1].id: null;
            break;
        case 2://observe a
            args[0] = (this.args[0])? this.args[0].id: null;
            break;
        case 3://combine a and b
            args[0] = (this.args[0])? this.args[0].id: null;
            args[1] = (this.args[1])? this.args[1].id: null;
            break;
        case 4://state A change to V
            args[0] = (this.args[0])? this.args[0].id: null;
            args[1] = (this.args[1] != null)?this.args[1]:false;
            break;
        case 5://enter scene A
            args[0] = (this.args[0])? this.args[0].id: null;
            break;
        default:
            break;
    }
    
    obj.args = args;
    return obj;
}


IEvent.prototype.fromJsonObject = function(_event) {    
    let args = [];

    switch(_event.type) {
        case 0://click
            args[0] = GameProperties.GetObjectById(_event.args[0]);
            break;
        case 1://use a on b
            args[0] = GameProperties.GetObjectById(_event.args[0]);
            args[1] = GameProperties.GetObjectById(_event.args[1]);
            break;
        case 2://observe a
            args[0] = GameProperties.GetObjectById(_event.args[0]);
            break;
        case 3://combine a and b
            args[0] = GameProperties.GetObjectById(_event.args[0]);
            args[1] = GameProperties.GetObjectById(_event.args[1]);
            break;
        case 4://state A change to V
            args[0] = GameProperties.GetStateById(_event.args[0]);
            args[1] = _event.args[1]
            break;
        case 5://enter scene A
            args[0] = GameProperties.GetSceneById(_event.args[0]);
            break;
        default:
            break;
    }

    return new IEvent(_event.type, args);
    
}
module.exports = IEvent;