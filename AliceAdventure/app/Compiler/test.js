
const Compiler = require('./Compiler.js');

function alert(e){
	console.log(e);
}

var compiler = new Compiler("C:/Users/ruilit/Documents/2018-SP/Alice/idontknow.aap",alert);

console.log(compiler.build(alert));
