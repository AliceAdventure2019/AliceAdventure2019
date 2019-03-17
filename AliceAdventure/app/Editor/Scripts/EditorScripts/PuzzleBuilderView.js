const { Event } = require('./Utilities/Utilities');
const GameProperties = require('./GameProperties');
const View = require('./View');
const Puzzle = require('./Puzzle.js');

class PuzzleBuilderView extends View {
  constructor(_bindElementID, _height = -1, _width = -1) {
    super('PuzzleBuilderView', _height, _width, _bindElementID);

    this.vModel = null;
  }

  static NewView(_elementID) {
    const view = new PuzzleBuilderView(_elementID);
    view.InitView();
    return view;
  }

  InitView() {
    super.InitView();
    this.vModel = new Vue({
      el: `#${this.bindElementID}`,
      data: {
        currPuzzle: null,
        goalOptions: null
      },
      methods: {
        updateGoal: goal => {
          this.vModel.currPuzzle.UpdateGoal(goal);
        }
      }
    });
    Event.AddListener('reload-project', () => {
      this.ReloadView();
    });
  }

  ReloadView() {
    super.ReloadView(); // call super method

    if (GameProperties.ProjectLoaded()) {
      this.vModel.currPuzzle = new Puzzle();
      this.vModel.goalOptions = [
        {
          id: 0,
          goalName: 'Go to a new location',
          description: 'Go to Scene '
        },
        {
          id: 1,
          goalName: 'Get an Object',
          description: 'Get  '
        },
        {
          id: 2,
          goalName: 'Remove an Object or Character',
          description: 'Remove '
        },
        {
          id: 3,
          goalName: 'Change Image of an Object',
          description: 'Change the image of  '
        }
      ];
    } else {
      this.vModel.currPuzzle = null;
      this.vModel.goalOptions = null;
    }
  }
}

module.exports = PuzzleBuilderView;
