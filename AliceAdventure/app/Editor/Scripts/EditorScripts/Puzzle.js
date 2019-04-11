const GameProperties = require('./GameProperties');
const { ID } = require('./Utilities/Utilities');

class Puzzle {
  constructor(
    id = null,
    goal = { id: -1 },
    goalObject = { id: -1 },
    how = { id: -1 },
    howObject = [{ id: -1 }, { id: -1 }],
    challenge = { id: -1 },
    challengeType = { id: -1 },
    challengeObject = [{ id: -1 }, { id: -1 }],
    soundObject = { id: -1 },
    isWinCondition = false
  ) {
    if (id == null) {
      this.id = ID.newID;
    } else {
      this.id = id;
    }
    this.goal = goal;
    this.goalObject = goalObject;
    this.how = how;
    this.howObject = howObject;
    this.challenge = challenge;
    this.challengeType = challengeType;
    this.challengeObject = challengeObject;
    this.soundObject = soundObject;
    this.isWinCondition = isWinCondition;
  }

  static NewPuzzle() {
    const puzzle = new Puzzle(null);
    GameProperties.AddPuzzle(puzzle);
    return puzzle;
  }

  static LoadPuzzle(data) {
    // TODO : Load puzzle from aap(json)
    const puzzle = new Puzzle();
    puzzle.id = data.id;
    [
      puzzle.goal.id,
      puzzle.how.id,
      puzzle.challenge.id,
      puzzle.challengeType.id
    ] = data.type;
    // TODO: Get goal, how, challenge name by ID
    const goalOptions = [
      {
        id: 0,
        goalName: 'Go to a scene',
        description: 'Go to '
      },
      {
        id: 1,
        goalName: 'Get an item',
        description: 'Get '
      }
      // {
      //   id: 2,
      //   goalName: 'Remove an Object or Character',
      //   description: 'Remove '
      // },
      // {
      //   id: 3,
      //   goalName: 'Let Character Say Something',
      //   description: 'Talk to '
      // }
    ];
    const howOptions = [
      {
        id: 0,
        howName: 'By entering through an entrance ',
        description: 'By entering through '
      },
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
      },
      {
        id: 4,
        howName: 'By Combining Item and Item ',
        description: 'By combining: '
      },
      {
        id: 5,
        howName: 'Use Another Object on it',
        description: 'By using another object on it, which is '
      },
      {
        id: 6,
        howName: 'Give Item to Character ',
        description: 'By giving this character a '
      }
    ];
    const challengeOptions = [
      {},
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
      },
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
    ];
    const challengeTypeOptions = [
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
      {},
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
    ];
    if (puzzle.goal.id >= 0) {
      puzzle.goal = goalOptions[puzzle.goal.id];
    }
    if (puzzle.how.id >= 0) {
      puzzle.how = howOptions[puzzle.how.id];
    }
    if (puzzle.challenge.id > 1) {
      puzzle.challenge = challengeOptions[puzzle.challenge.id];
    }
    if (puzzle.challengeType.id >= 0) {
      console.log('challengeType in puzzle.js get called');
      puzzle.challengeType = challengeTypeOptions[puzzle.challengeType.id];
    }


    // TODO: Get object name by ID
    const findObjectNameByID = id => {
      const obj = GameProperties.instance.objectList.find(
        elem => elem.id === id
      );
      if (obj) {
        return obj.name;
      }
      return id;
    };
    const findSceneNameByID = id => {
      const obj = GameProperties.instance.sceneList.find(
        elem => elem.id === id
      );
      if (obj) {
        return obj.name;
      }
      return id;
    };

    [
      puzzle.goalObject.id,
      puzzle.howObject[0].id,
      puzzle.howObject[1].id,
      puzzle.challengeObject[0].id,
      puzzle.challengeObject[1].id,
      puzzle.soundObject.id
    ] = data.args;
    if (typeof puzzle.challengeObject[0].id === 'string') {
      puzzle.challengeObject[0] = puzzle.challengeObject[0].id;
    } else {
      puzzle.challengeObject[0] = GameProperties.GetObjectById(
        puzzle.challengeObject[0].id
      ) || {
          id: -1
        };
    }
    if (typeof puzzle.challengeObject[1].id === 'string') {
      puzzle.challengeObject[1] = puzzle.challengeObject[1].id;
    } else {
      puzzle.challengeObject[1] = GameProperties.GetObjectById(
        puzzle.challengeObject[1].id
      ) || {
          id: -1
        };
    }

    puzzle.goalObject =
      puzzle.goal.id === 0
        ? GameProperties.GetSceneById(puzzle.goalObject.id) || { id: -1 }
        : GameProperties.GetObjectById(puzzle.goalObject.id) || { id: -1 };
    puzzle.howObject[0] = GameProperties.GetObjectById(
      puzzle.howObject[0].id
    ) || { id: -1 };
    puzzle.howObject[1] = GameProperties.GetObjectById(
      puzzle.howObject[1].id
    ) || { id: -1 };
    // puzzle.challengeObject[0].name = typeof (puzzle.challengeObject[0]) === 'string' ? puzzle.challengeObject[0] : findObjectNameByID(puzzle.challengeObject[0].id);
    // puzzle.challengeObject[1].name = typeof (puzzle.challengeObject[1]) === 'string' ? puzzle.challengeObject[1] : findObjectNameByID(puzzle.challengeObject[1].id);
    GameProperties.AddPuzzle(puzzle);
    console.log(puzzle);
  }

  UpdateGoal() {
    console.log('updated!');

    this.goalObject = { id: -1 };
    this.how = { id: -1 };
    this.howObject = [{ id: -1 }, { id: -1 }];
    this.challenge = { id: -1 };
    this.challengeType = { id: -1 };
    this.challengeObject = [{ id: -1 }, { id: -1 }];
    this.soundObject = { id: -1 }
    console.log('updated!');
  }

  UpdateGoalObject(goalObject) {
    this.goalObject = goalObject;
  }

  UpdateHow() {
    // this.how = how;
    if (this.goal.id !== 3 && this.how.id !== 6) {
      this.howObject = [{ id: -1 }, { id: -1 }];
      this.challenge = { id: -1 };
      this.challengeType = { id: -1 };
      this.challengeObject = [{ id: -1 }, { id: -1 }];
      this.soundObject = { id: -1 };
    } else {
      this.howObject = [{ id: -1 }, { id: -1 }];
      this.challenge = { id: -1 };
      this.challengeType = { id: -1 };
      this.soundObject = { id: -1 };
    }
  }

  UpdateHowObject(howObject) {
    this.howObject = howObject;
  }

  RemoveChallenge() {
    this.challenge = { id: -1 };
    this.challengeType = { id: -1 };
    this.challengeObject = [{ id: -1 }, { id: -1 }];
  }

  UpdateChallenge(challenge) {
    console.log('UpdateChallenge get called');
    this.challenge = challenge;
  }

  UpdateChallengeObject(challengeObject) {
    this.challengeObject = challengeObject;
  }

  UpdateSoundObject(soundObject) {
    this.soundObject = soundObject;
  }

  UpdateChallengeType(challengeType) {
    this.challengeType = challengeType;
  }

  DeleteThis() {
    GameProperties.DeletePuzzle(this);
    this.ResetPuzzle();
  }

  ResetPuzzle() {
    // TODO: Is this still needed?
    this.id = null;
    this.goal = { id: -1 };
    this.goalObject = { id: -1 };
    this.how = { id: -1 };
    this.howObject = [{ id: -1 }, { id: -1 }];
    this.challenge = { id: -1 };
    this.challengeType = { id: -1 };
    this.challengeObject = [{ id: -1 }, { id: -1 }];
    this.soundObject = { id: -1 };
    this.isWinCondition = false;
  }

  CheckFinish() {
    // Click to Collect
    if (this.challenge.id < 0) {
      if (this.goal.id === 0) {
        if (this.goalObject.id >= 0) {
          if (this.how.id === 0) {
            if (this.howObject[0].id >= 0 && this.challenge.id === 5) {
              return true;
            }
          }
        }
      } else if (this.goal.id === 1) {
        if (this.goalObject.id >= 0) {
          if (this.how.id === 1) {
            return true;
          }
          if (this.how.id === 2) {
            if (this.howObject[0].id >= 0 && this.challenge.id === 5) {
              return true;
            }
          } else if (this.how.id === 3) {
            if (this.howObject[0].id >= 0 && this.howObject[1].id >= 0) {
              return true;
            }
          } else if (this.how.id === 4) {
            if (this.howObject[0].id >= 0 && this.howObject[1].id >= 0) {
              return true;
            }
          }
        }
      } else if (this.goal.id === 2) {
        if (this.goalObject.id >= 0) {
          if (this.how.id === 5) {
            if (this.howObject[0].id >= 0) {
              return true;
            }
          }
        }
      } else if (this.goal.id === 3) {
        if (this.goalObject.id >= 0) {
          if (this.how.id === 6) {
            if (
              typeof this.challengeObject[0] === 'string' ||
              this.challengeObject[0].id !== -1
            ) {
              if (this.howObject[0].id >= 0) {
                console.log('should be true.');
                return true;
              }
            }
          }
        }
      }
    } else if (this.challenge.id === 4) {
      if (this.challengeType.id === 0) {
        if (this.challengeObject[0].id >= 0) {
          return true;
        }
      } else if (this.challengeType.id === 1) {
        if (typeof this.challengeObject[0] === 'string') {
          return true;
        }
      } else if (this.challengeType.id === 2) {
        if (
          this.challengeObject[0].id >= 0 &&
          this.challengeObject[1].id >= 0
        ) {
          return true;
        }
      } else if (this.challengeType.id === 3) {
        if (
          this.challengeObject[0].id >= 0 &&
          this.challengeObject[1].id >= 0
        ) {
          return true;
        }
      } else if (this.challengeType.id === 4) {
        if (this.challengeObject[0].id >= 0) {
          return true;
        }
      }
    } else if (this.challenge.id === 5) {
      return true;
    }

    // if (this.how.id == 1) {
    //   return true;
    // }
    // if (this.goal.id === 3 && this.how.id === 6) {
    //   return true;
    // }
    // if (this.challengeType.id === 1 && (typeof (this.challengeObject[0]) === "string" || typeof (this.challengeObject[0]) === "number")) {
    //   return true;
    // }

    // if (this.challengeType.id === 3 && this.challengeObject[0].id >= 0 && this.challengeObject[1].id >= 0) {
    //   return true;
    // }

    // if (this.challenge.id === 2 && this.challengeObject[0].id >= 0 && this.challengeObject[1].id >= 0) {
    //   return true;
    // }

    // if (this.goal.id == 1 && this.goalObject.id >= 0 && this.how.id == 4 && this.howObject[0].id >= 0 && this.howObject[1].id >= 0) {
    //   return true;
    // }

    // if (this.goal.id >= 0 && this.goalObject.id >= 0 && this.how.id >= 0 && this.howObject[0].id >= 0) {
    //   if (this.challenge.id < 0 && this.challengeObject[0].id < 0 && this.challengeObject[1].id < 0) {
    //     return true;
    //   } else if (this.challenge.id >= 0 && this.challengeObject[0].id >= 0) {
    //     return true;
    //   }
    // }

    // if (this.challenge.id < 0 && this.challengeObject[0].id < 0 && this.howObject.id >= 0) {
    //   return true;
    // }

    // if (this.challenge.id >= 0 && this.challengeObject[0].id >= 0) {
    //   return true;
    // }

    return false;
  }

  CheckCouldAddChallenge() {
    // const howIdWithHowObjects = [0, 2, 3, 4, 5];
    if (this.how.id === 0 || this.how.id === 2 || this.challenge.id === 5) {
      return true;
    }

    return false;
  }

  toJsonObject() {
    const map = {
      id: this.id,
      type: [
        this.goal.id,
        this.how.id,
        this.challenge.id,
        this.challengeType.id
      ],
      args: [
        this.goalObject.id,
        this.howObject[0].id,
        this.howObject[1].id,
        typeof this.challengeObject[0] === 'string'
          ? this.challengeObject[0]
          : this.challengeObject[0].id,
        typeof this.challengeObject[1] === 'string'
          ? this.challengeObject[1]
          : this.challengeObject[1].id,
        this.soundObject.id
      ],
      win: this.isWinCondition
    };
    return map;
  }
}

module.exports = Puzzle;
