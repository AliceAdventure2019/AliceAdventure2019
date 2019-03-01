const FileSys = require('./FileSys.js');
const Parser = require('./SimpleParser.js');

let Compiler;

// path to the json file
// callback function to report error
Compiler = function(path, callback) {
  this.buildDest = FileSys.ensureAndCreate(path, callback);

  // need a callback function to report error
  this.build = function(call) {
    if (!this.buildDest) return false;

    const parser = new Parser(path, this.buildDest);
    const string = parser.translate(call);

    if (string === false) {
      console.log('Something wrong happened\n');
      return false;
    }
    console.log(FileSys.merge(this.buildDest, 'game.js'));
    FileSys.writeFile(FileSys.merge(this.buildDest, 'game.js'), string);
    parser.writeHTML();

    // var commandLine = "start " + this.buildDest.replace(/\\/g, "\\\\");
    // require('child_process').exec(commandLine);
    return true;
  };
};

module.exports = Compiler;
