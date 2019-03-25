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
                  id: 0,
                  howName: 'By Clicking an Object',
                  description: 'By clicking '
                }
              ];
            case 1:
              return [
                {
                  id: 1,
                  howName: 'By Clicking to Add to Inventory',
                  description: 'By clicking mouse'
                },
                {
                  id: 2,
                  howName: 'By Collecting from a Container',
                  description: 'from container: '
                },
                {
                  id: 3,
                  howName: 'From a Character ',
                  description: 'from character: '
                },
                {
                  id: 4,
                  howName: 'By Combining Item and Item ',
                  description: 'By combining: '
                }
              ];
            case 2:
              return [
                {
                  id: 5,
                  howName: 'Use Another Object on it',
                  description: 'By using another object on it, which is '
                }
              ];
            case 3:
              return [
                {
                  id: 6,
                  howName: 'Give Item to Character ',
                  description: 'By giving this character a '
                }
              ];

            default:
              return [];
          }
        },
        challengeOptions: () => [
          {
            id: 1,
            challengeName: 'Lock',
            description: ' is locked. It needs to be unlocked by '
          },
          {
            id: 2,
            challengeName: 'Guard',
            description: ' is guarded by '
          },
          {
            id: 3,
            challengeName: 'Switch',
            description: ' needs to be triggered by '
          }
        ],

        challengeTypeOptions: () => {
          console.log("challengeTypeOptions in puzzleBuilderView.js get called");
          switch (this.vModel.currPuzzle.challenge.id) {
            case 1:
              return [
                {
                  id: 0,
                  challengeTypeName: 'Unlock it with a Key',
                  description: ' is locked. It needs to be unlocked by '
                },
                {
                  id: 1,
                  challengeTypeName: 'Unlock it with a Password',
                  description: ' Unlock it with a Password '
                },
              ];
            case 2:
              return [
                {
                  id: 2,
                  challengeTypeName: 'Talk with [Character] to Distract [Character] ',
                  description: 'Talk with a Character to Distract another Character  '
                },
                {
                  id: 3,
                  challengeTypeName: 'Bribe [Character] to with [Item] Let the Player In ',
                  description: 'Bribe Character with Item '
                }
              ];
            case 3:
              return [
                {
                  id: 4,
                  challengeTypeName: ' [Object] needs to be Triggered by clicking another [Object] ',
                  description: ' Object needs to be Triggered by clicking another Object '
                }
              ];

            default:
              return [];
          }
        }
      },
      methods: {
        updateGoal: () => {
          console.log("Updated goal");
          this.vModel.currPuzzle.UpdateGoal();

          // this.vModel.currPuzzle.UpdateGoal(goal);
        },
        // updateHow: how => {
        //   this.vModel.currPuzzle.UpdateHow(how);
        // },
        updateHow: () => {
          console.log("Updated how");
          this.vModel.currPuzzle.UpdateHow();
        },
        updateChallenge: challenge => {
          this.vModel.currPuzzle.UpdateChallenge(challenge);
        },
        addPuzzle: () => {
          GameProperties.AddPuzzle(this.Clone());
          console.log(JSON.parse(JSON.stringify(this.vModel.currPuzzle)));
          this.vModel.currPuzzle.ResetPuzzle();
        },
        resetPuzzle: () => {
          this.vModel.currPuzzle.ResetPuzzle();
        },
        showFinishButton: () => {
          // console.log(this.vModel.currPuzzle.CheckFinish());
          return this.vModel.currPuzzle.CheckFinish();
        },
        CouldAddChallenge: () => {
          return this.vModel.currPuzzle.CheckCouldAddChallenge();
        }
      }
    });
    Event.AddListener('reload-project', () => {
      this.ReloadView();
    });
  }

  Clone() {
    const puzzle = new Puzzle();
    puzzle.goal = this.vModel.currPuzzle.goal;
    puzzle.how = this.vModel.currPuzzle.how;
    puzzle.challenge = this.vModel.currPuzzle.challenge;
    puzzle.challengeType = this.vModel.currPuzzle.challengeType;
    puzzle.goalObject = this.vModel.currPuzzle.goalObject;
    puzzle.howObject = this.vModel.currPuzzle.howObject;
    puzzle.challengeObject = this.vModel.currPuzzle.challengeObject;
    console.log(puzzle);
    return puzzle;
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
          description: 'Get '
        },
        {
          id: 2,
          goalName: 'Remove an Object or Character',
          description: 'Remove '
        },
        {
          id: 3,
          goalName: 'Let Character Say Something',
          description: 'Talk to '
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
