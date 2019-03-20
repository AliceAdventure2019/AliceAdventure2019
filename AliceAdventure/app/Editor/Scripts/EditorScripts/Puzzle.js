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
    challengeObject = { id: -1 }
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
    this.challengeObject = challengeObject;
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
    [puzzle.goal.id, puzzle.how.id, puzzle.challenge.id] = data.type;
    // TODO: Get goal, how, challenge name by ID
    const goalOptions = [
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
    const howOptions = [
      {
        id: 0,
        howName: 'By Clicking an Object',
        description: 'By clicking '
      },
      {
        id: 1,
        howName: 'Click to Collect ',
        description: 'By clicking mouse'
      },
      {
        id: 2,
        howName: 'Collect from a Container',
        description: 'from container: '
      },
      {
        id: 3,
        howName: 'Get [Item] from a Character ',
        description: 'from character: '
      },
      {
        id: 4,
        howName: 'Get [Item] by Combining Item and Item ',
        description: 'By combining: '
      },
      {
        id: 5,
        howName: 'Use Item on Object',
        description: 'By using another object on it, which is '
      },
      {
        id: 6,
        howName: 'Give Item to Character ',
        description: 'By giving this character a '
      }
    ];
    const challengeOptions = [
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
    console.log(puzzle);

    [
      puzzle.goalObject.id,
      puzzle.howObject[0].id,
      puzzle.howObject[1].id,
      puzzle.challengeObject.id
    ] = data.args;
    // TODO: Get object name by ID
    const findObjectNameByID = id => {
      const obj = GameProperties.instance.objectList.find(
        elem => elem.id === id
      );
      if (obj) {
        return obj.name;
      }
      return null;
    };
    puzzle.goalObject.name = findObjectNameByID(puzzle.goalObject.id);
    puzzle.howObject[0].name = findObjectNameByID(puzzle.howObject[0].id);
    puzzle.howObject[1].name = findObjectNameByID(puzzle.howObject[1].id);
    puzzle.challengeObject.name = findObjectNameByID(puzzle.challengeObject.id);
    GameProperties.AddPuzzle(puzzle);
  }

  UpdateGoal(goal) {
    this.goal = goal;
  }

  UpdateGoalObject(goalObject) {
    this.goalObject = goalObject;
  }

  UpdateHow(how) {
    this.how = how;
  }

  UpdateHowObject(howObject) {
    this.howObject = howObject;
  }

  UpdateChallenge(challenge) {
    this.challenge = challenge;
  }

  UpdateChallengeObject(challengeObject) {
    this.challengeObject = challengeObject;
  }

  DeleteThis() {
    GameProperties.DeletePuzzle(this);
  }

  ResetPuzzle() {
    // TODO: Is this still needed?
    this.id = null;
    this.goal = { id: -1 };
    this.goalObject = { id: -1 };
    this.how = { id: -1 };
    this.howObject = [{ id: -1 }, { id: -1 }];
    this.challenge = { id: -1 };
    this.challengeObject = { id: -1 };
  }

  CheckFinish() {
    if (this.how.id == 1) {
      return true;
    }

    if (this.goal.id == 1 && this.goalObject.id >= 0 && this.how.id == 4 && this.howObject[0].id >= 0 && this.howObject[1].id >= 0) {
      return true;
    }

    if (this.goal.id >= 0 && this.goalObject.id >= 0 && this.how.id >= 0 && this.howObject[0].id >= 0) {
      if (this.challenge.id < 0 && this.challengeObject.id < 0) {
        return true;
      } else if (this.challenge.id >= 0 && this.challengeObject.id >= 0) {
        return true;
      }
    }

    if (this.challenge.id < 0 && this.challengeObject.id < 0 && this.howObject.id >= 0) {
      return true;
    }

    if (this.challenge.id >= 0 && this.challengeObject.id >= 0) {
      return true;
    }

    return false;
  }

  toJsonObject() {
    const map = {
      id: this.id,
      type: [this.goal.id, this.how.id, this.challenge.id],
      args: [
        this.goalObject.id,
        this.howObject[0].id,
        this.howObject[1].id,
        this.challengeObject.id
      ]
    };
    return map;
  }
}

module.exports = Puzzle;
