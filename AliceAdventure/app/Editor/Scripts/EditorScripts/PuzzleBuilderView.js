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
        goalOptions: null,
        scenes: null,
        objects: null
      },
      computed: {
        howOptions: () => {
          switch (this.vModel.currPuzzle.goal.id) {
            case 0:
              return [
                {
                  id: parseInt(0, 10),
                  howName: 'By Clicking an Object',
                  description: 'By clicking '
                }
              ];
            default:
              // TODO: Add all hows
              return [];
          }
        },
        challengeOptions: () => [
          {
            id: 1,
            challengeName: 'Add a lock',
            description: ' is locked. It needs to be unlocked by '
          },
          {
            id: 2,
            challengeName: 'Add a guard',
            description: ' is guarded by '
          },
          {
            id: 3,
            challengeName: 'Add a switch',
            description: ' is controlled by the switch '
          }
        ]
      },
      methods: {
        updateGoal: goal => {
          this.vModel.currPuzzle.UpdateGoal(goal);
        },
        updateHow: how => {
          this.vModel.currPuzzle.UpdateHow(how);
        },
        updateChallenge: challenge => {
          this.vModel.currPuzzle.UpdateChallenge(challenge);
        },
        addPuzzle: () => {
          GameProperties.AddPuzzle(
            JSON.parse(JSON.stringify(this.vModel.currPuzzle))
          );
          this.vModel.currPuzzle.ResetPuzzle();
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
      this.vModel.scenes = GameProperties.instance.sceneList;
      this.vModel.objects = GameProperties.instance.objectList;
    } else {
      this.vModel.currPuzzle = null;
      this.vModel.goalOptions = null;
      this.vModel.scenes = null;
      this.vModel.objects = null;
    }
  }
}

module.exports = PuzzleBuilderView;
