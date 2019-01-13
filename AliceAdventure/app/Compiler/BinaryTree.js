//asychronous fs+JSON.parser version

'use strict';

function INode(eventString, eventType, args, condWithReact){
	this.event = eventString;
	this.type = eventType;
	this.args = args;
	this.condWithReact = condWithReact;

	this.left = null;
	this.rigt = null;
}

function ITree(){
	this.root = null;
	this.treeSize = 0;
	this.total = 0;
}

ITree.prototype.putNode = function(eventString, eventType, args, condWithReact){

	this.total += 1;
	this.root = _putNode.call(this, this.root, eventString, eventType, args, condWithReact, 0);
}

ITree.prototype.getEverything = function () {
	//console.log("total: " + this.total + ", size: " + this.treeSize + ", depth: " + _getMaxDepth.call(this));
	
	var result = "";
    var node = this.root;
    var traverse = function(node) {

    	var end;
		if (node.type == 0) end = "}//interaction end\n";
		else end = "}); //interaction end\n";

		result +=  _getString(node) + end;
        
        node.left && traverse(node.left);
        node.right && traverse(node.right);
    };
    traverse(node);
    return result;
}


function _putNode(n, eventString, eventType, args, condWithReact, x){
	//add new ones
	if (n == null){
		var toReturn = new INode(eventString, eventType, args, condWithReact);
		this.treeSize += 1;
		return toReturn;
	}
	// if equals to the current node, append condWithReact to the node
	else if (sameTypeSameArg(n, eventType, args)){
		n.condWithReact += "\n" + condWithReact;
		return n;
	}

	else{

		if (args.length <= 1) n.right = _putNode.call(this, n.right, eventString, eventType, args, condWithReact, x +1);
	
		else n.left = _putNode.call(this, n.left, eventString, eventType, args, condWithReact , x+1);

		return n;
	}
}



function _getMaxDepth(){
	 var node = this.root;
    var maxDepth = 0;
    var traverse = function(node, depth) {
        if (!node) return null;
        if (node) {
            maxDepth = depth > maxDepth ? depth : maxDepth;
            traverse(node.left, depth + 1);
            traverse(node.right, depth + 1);
        }
    };
    traverse(node, 0);
    return maxDepth;
}

function _getString(n){
	return n.event + n.condWithReact;
}

function sameTypeSameArg(n, eventType, args){
	return _sameTypeSameArg(n.type, n.args, eventType, args);
}

// return true if types AND args are all the same
function _sameTypeSameArg(e0, a0, e1, a1){
//	if (e0 == 0 && e1 ==0) 
	if (e0 == 0 && a0[0] == 95 && e1 == 0 &&a1[0] == 95) console.log("!");
	return (e0 == e1) && sameArg(a0, a1);
}
// return true if the order and the elements in a0 and a1 are the same
function sameArg(a0, a1){
	if (a0.length != a1.length) {return false;} 
	else if (a0.length == 0) return true; // need attention, since no event will have zero args now

	else {
		//order MATTERS
		return (a0.toString() === a1.toString());
	}
}


module.exports = ITree;