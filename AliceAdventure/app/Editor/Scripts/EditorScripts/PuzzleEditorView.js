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
        puzzles: null,
        sceneList: null,
        objectList: null

      },
      methods: {
        clog: product => {
          console.log(product);
          return product;
        },

        getGoal0Description: puzzle =>
          `${puzzle.goal.description}<span class="my_badge badge-event">${
          puzzle.goalObject.name
          }</span>`,

        getGoal1Description: puzzle =>
          `${puzzle.goal.description}<span class="my_badge badge-event">${
          puzzle.goalObject.name
          }</span>`,

        getGoal2Description: puzzle =>
          `${puzzle.goal.description}<span class="my_badge badge-event">${
          puzzle.goalObject.name
          }</span>`,

        getGoal3Description: puzzle =>
          `Let <span class="my_badge badge-event">${
          puzzle.goalObject.name
          }</span> Talk `,
        // -----------------------getSolutionDescription-------------------------------------

        getSolution0Description: puzzle =>
          `${puzzle.how.description}`
        ,
        getSolution1Description: puzzle =>
          `By clicking the mouse <span class="my_badge badge-state">${
          puzzle.howObject[0].name
          }</span>`,
        getSolution2Description: puzzle =>
          `${puzzle.how.description}<span class="my_badge badge-state">${
          puzzle.howObject[0].name
          }</span>`,
        getSolution3Description: puzzle =>
          `${puzzle.how.description}<span class="my_badge badge-state">${
          puzzle.howObject[0].name
          }</span>`,
        getSolution4Description: puzzle =>
          `${puzzle.how.description}<span class="my_badge badge-state">${
          puzzle.howObject[0].name
          }</span> and <span class="my_badge badge-state">${
          puzzle.howObject[1].name
          }</span>`,
        getSolution5Description: puzzle =>
          `By using <span class="my_badge badge-state">${
          puzzle.howObject[0].name
          }</span> on it.`,
        getSolution6Description: puzzle =>
          `${puzzle.how.description}<span class="my_badge badge-state">${
          puzzle.howObject[0].name
          }</span>`,
        // -----------------------getChallengeDescription-------------------------------------
        //TODO: customize each challenge language
        getChallenge1Description: puzzle =>
          `<span class="my_badge badge-state">${puzzle.howObject[0].name}</span>${
          puzzle.challenge.description
          }<span class="my_badge badge-reaction">${
          puzzle.challengeObject.name
          }</span>`,

        getChallenge2Description: puzzle =>
          `<span class="my_badge badge-state">${puzzle.howObject[0].name}</span>${
          puzzle.challenge.description
          }<span class="my_badge badge-reaction">${
          puzzle.challengeObject.name
          }</span>`,

        getChallenge3Description: puzzle =>
          `<span class="my_badge badge-state">${puzzle.howObject[0].name}</span>${
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
      this.vModel.sceneList = GameProperties.instance.sceneList;
      this.vModel.objectList = GameProperties.instance.objectList;
    } else {
      this.vModel.viewEnabled = false;
      this.vModel.puzzles = null;
      this.vModel.sceneList = null;
      this.vModel.objectList = null;

    }
  }
}

module.exports = PuzzleEditorView;
