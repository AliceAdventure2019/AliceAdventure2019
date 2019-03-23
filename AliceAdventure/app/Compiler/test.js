const Compiler = require('./Compiler.js');

function alert(e) {
  console.log(e);
}

// const compiler = new Compiler('C:/Users/yifengs/Desktop/mvp.aap', alert);
const compiler = new Compiler('C:/Users/yifengs/Desktop/test.aap', alert);

console.log(compiler.build(alert));
