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

  static LoadPuzzle() {
    // TODO : Load puzzle from aap(json)
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
    let map = {
      id: this.id,
      type: [this.goal.id, this.how.id, this.challenge.id],
      args: [this.goalObject.id, this.howObject[0].id, this.howObject[1].id, this.challengeObject.id]
    };
    return map;
  }
}

module.exports = Puzzle;
