const { Event } = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');
const View = require('./View');
const Puzzle = require('./Puzzle.js');

class PuzzleEditorView extends View {
  constructor(_bindElementID, _height = -1, _width = -1) {
    super('PuzzleEditorView', _height, _width, _bindElementID);

    this.vModel = null;
  }

  static NewView(_elementID) {
    const view = new PuzzleEditorView(_elementID);
    view.InitView();
    return view;
  }

  InitView() {
    super.InitView(); // call super method
    // Init data binding
    this.vModel = new Vue({
      el: `#${this.bindElementID}`,
      data: {
        viewEnabled: false,
        puzzles: null
      },
      methods: {
        clog: product => {
          console.log(product);
          return product;
        },
        getGoalDescription: puzzle =>
          `${puzzle.goal.description}<span class="my_badge badge-event">${
            puzzle.goalObject.name
          }</span>`,
        getSolutionDescription: puzzle =>
          `${puzzle.how.description}<span class="my_badge badge-state">${
            puzzle.howObject.name
          }</span>`,
        getChallengeDescription: puzzle =>
          `<span class="my_badge badge-state">${puzzle.howObject.name}</span>${
            puzzle.challenge.description
          }<span class="my_badge badge-reaction">${
            puzzle.challengeObject.name
          }</span>`,
        initBox: (ntra, el) => {
          console.log(el);
          // InteractionView.prototype.initBox(ntra, el)
        },

        // resizeClick: (ev, ntra) => {
        //   PuzzleEditorView.prototype.minimizeWindow(ev, ntra);
        // },
        deletePuzzle: puzzle => {
          puzzle.DeleteThis();
        }
      }
    });

    // events
    Event.AddListener('reload-project', () => {
      this.ReloadView();
    });
  }

  ReloadView() {
    super.ReloadView(); // call super method

    if (GameProperties.ProjectLoaded()) {
      console.log('Update Interaction View');
      this.vModel.viewEnabled = true;
      this.vModel.puzzles = GameProperties.instance.puzzleList;
    } else {
      this.vModel.viewEnabled = false;
      this.vModel.puzzles = null;
    }
  }
}

module.exports = PuzzleEditorView;
