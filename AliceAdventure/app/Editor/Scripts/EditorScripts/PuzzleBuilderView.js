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
        objects: null,
        sounds: null,
        isEdit: false,
        visible: false,
        tempValue: [null, null, null, null, null, null]
      },
      created: () => {
        Event.AddListener('editCurrentPuzzle', puzzle => {
          // window.console.log(puzzle);
          this.vModel.isEdit = true;
          this.vModel.currPuzzle = puzzle;
          this.vModel.visible = true;
        });
        Event.AddListener('deleteCurrentPuzzle', () => {
          this.vModel.isEdit = false;
          this.vModel.visible = false;
        });
      },
      computed: {
        objectDict: () => {
          let ret = [];
          const dict = {};
          for (let i = 0; i < this.vModel.objects.length; i += 1) {
            if (this.vModel.objects[i].bindScene.id <= 0) continue;
            if (this.vModel.objects[i].isBackdrop) continue;
            const sceneId = this.vModel.objects[i].bindScene.id;
            dict[sceneId] = dict[sceneId] || [];
            dict[sceneId].push(this.vModel.objects[i]);
            for (let j = 0; j < this.vModel.objects[i].content.length; j += 1) {
              dict[sceneId].push(
                GameProperties.GetObjectById(this.vModel.objects[i].content[j])
              );
            }
          }
          for (let i = 0; i < Object.keys(dict).length; i += 1) {
            ret.push({
              sceneId: Object.keys(dict)[i],
              name: GameProperties.GetSceneById(Object.keys(dict)[i]).name
            });
            ret = ret.concat(dict[Object.keys(dict)[i]]);
          }
          return ret;
        },
        howOptions: () => {
          switch (this.vModel.currPuzzle.goal.id) {
            case 0:
              return [
                {
                  id: 0,
                  howName: 'By entering through an entrance ',
                  description: 'By entering through '
                }
              ];
            case 1:
              return [
                {
                  id: 1,
                  howName: 'By picking it up',
                  description: 'By picking it up'
                },
                {
                  id: 2,
                  howName: 'By collecting it from a container',
                  description: 'from container '
                },
                {
                  id: 3,
                  howName: 'By trading with a character ',
                  description: 'By trading with a character '
                }
                // {
                //   id: 4,
                //   howName: 'By Combining Item and Item ',
                //   description: 'By combining: '
                // }
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
            id: 4,
            challengeName: 'Yes',
            description: ' is locked.'
          },
          {
            id: 5,
            challengeName: 'No',
            description: ' is unlocked.'
          }
          // {
          //   id: 1,
          //   challengeName: 'Lock',
          //   description: ' is locked. It needs to be unlocked by '
          // },
          // {
          //   id: 2,
          //   challengeName: 'Guard',
          //   description: ' is guarded by '
          // },
          // {
          //   id: 3,
          //   challengeName: 'Switch',
          //   description: ' needs to be triggered by '
          // }
        ],

        challengeTypeOptions: () => {
          console.log(
            'challengeTypeOptions in puzzleBuilderView.js get called'
          );
          switch (this.vModel.currPuzzle.challenge.id) {
            case 4:
              return [
                {
                  id: 0,
                  challengeTypeName: 'By using a key',
                  description: ' is locked. It needs to be unlocked by '
                },
                {
                  id: 1,
                  challengeTypeName: 'By inputting a Password',
                  description: ' Unlock it with a Password '
                },
                {
                  id: 3,
                  challengeTypeName: 'By bribing the guard ',
                  description: 'Bribe character with item '
                },
                {
                  id: 4,
                  challengeTypeName: 'By operating a trigger ',
                  description: ' By operating a trigger '
                }
                // {
                //   id: 0,
                //   challengeTypeName: `Unlock ${this.vModel.currPuzzle.howObject[0].name.toString()} with a Key`,
                //   description: ' is locked. It needs to be unlocked by '
                // },
                // {
                //   id: 1,
                //   challengeTypeName: `Unlock ${this.vModel.currPuzzle.howObject[0].name.toString()} with a Password`,
                //   description: ' Unlock it with a Password '
                // },
                // {
                //   id: 3,
                //   challengeTypeName: 'Bribe Character with Item ',
                //   description: 'Bribe Character with Item '
                // },
                // {
                //   id: 4,
                //   challengeTypeName: `Trigger ${this.vModel.currPuzzle.howObject[0].name.toString()} by clicking an object`,
                //   description:
                //     ' Object needs to be Triggered by clicking another Object '
                // }
              ];
            case 1:
              return [
                {
                  id: 0,
                  challengeTypeName: `Unlock ${this.vModel.currPuzzle.howObject[0].name.toString()} with a Key`,
                  description: ' is locked. It needs to be unlocked by '
                },
                {
                  id: 1,
                  challengeTypeName: `Unlock ${this.vModel.currPuzzle.howObject[0].name.toString()} with a Password`,
                  description: ' Unlock it with a Password '
                }
              ];
            case 2:
              return [
                {
                  id: 2,
                  challengeTypeName:
                    'Talk with Character to Distract Character (Not Supported) ',
                  description:
                    'Talk with a Character to Distract another Character  '
                },
                {
                  id: 3,
                  challengeTypeName: 'Bribe Character with Item ',
                  description: 'Bribe Character with Item '
                }
              ];
            case 3:
              return [
                {
                  id: 4,
                  challengeTypeName: `Trigger ${this.vModel.currPuzzle.howObject[0].name.toString()} by clicking an object`,
                  description:
                    ' Object needs to be Triggered by clicking another Object '
                }
              ];

            default:
              return [];
          }
        }
      },
      methods: {
        showPuzzleBuilder: () => {
          this.vModel.visible = true;
        },
        // hidePuzzleBuilder: () => {
        //   this.vModel.visible = false;
        // },
        updateGoal: () => {
          console.log('Updated goal');
          this.vModel.currPuzzle.UpdateGoal();
          this.vModel.tempValue = [null, null, null, null, null, null];
          // this.vModel.currPuzzle.UpdateGoal(goal);
        },
        // updateHow: how => {
        //   this.vModel.currPuzzle.UpdateHow(how);
        // },
        updateHow: () => {
          console.log('Updated how');
          this.vModel.currPuzzle.UpdateHow();
          for (let i = 1; i < 6; i += 1) {
            this.vModel.tempValue[i] = null;
          }
        },
        updateChallenge: challenge => {
          this.vModel.currPuzzle.UpdateChallenge(challenge);
          // for (let i = 3; i < 6; i += 1) {
          //   this.vModel.tempValue[i] = null;
          // }
        },
        removeChallenge: () => {
          this.vModel.currPuzzle.RemoveChallenge();
        },
        addPuzzle: () => {
          console.log(this.vModel.currPuzzle);
          if (!this.vModel.isEdit) {
            GameProperties.AddPuzzle(this.vModel.currPuzzle);
          } else {
            this.vModel.isEdit = false;
          }
          this.vModel.currPuzzle = new Puzzle();
          this.vModel.visible = false;
        },
        resetPuzzle: () => {
          this.vModel.currPuzzle.ResetPuzzle();
        },
        deleteCurrPuzzle: () => {
          this.vModel.visible = false;
          this.vModel.currPuzzle.ResetPuzzle();
        },
        showFinishButton: () =>
          // console.log(this.vModel.currPuzzle.CheckFinish());
          this.vModel.currPuzzle.CheckFinish(),
        CouldAddChallenge: () => this.vModel.currPuzzle.CheckCouldAddChallenge()
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
          goalName: 'Go to a Scene',
          description: 'Go to Scene '
        },
        {
          id: 1,
          goalName: 'Get an item',
          description: 'Get '
        }
        // {
        //   id: 2,
        //   goalName: 'Win the battle with an Object or Character',
        //   description: 'Win the battle with '
        // },
        // {
        //   id: 3,
        //   goalName: 'Satisfy Somebody',
        //   description: 'Satisfy '
        // }
      ];
      this.vModel.scenes = GameProperties.instance.sceneList;
      this.vModel.objects = GameProperties.instance.objectList;
      this.vModel.sounds = GameProperties.instance.soundList;
      console.log(this.vModel.sounds)
      this.vModel.isEdit = false;
      this.vModel.visible = false;
    } else {
      this.vModel.currPuzzle = null;
      this.vModel.goalOptions = null;
      this.vModel.scenes = null;
      this.vModel.objects = null;
      this.vModel.sounds = null;
      this.vModel.isEdit = false;
      this.vModel.visible = false;
    }
  }
}

module.exports = PuzzleBuilderView;
