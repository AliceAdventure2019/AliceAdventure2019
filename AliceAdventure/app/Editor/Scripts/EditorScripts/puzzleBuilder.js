class Puzzle {
  constructor(
    id = null,
    goal = { id: -1 },
    goalObject = { id: -1 },
    how = { id: -1 },
    howObject = { id: -1 },
    challenge = { id: -1 },
    challengeObject = { id: -1 }
  ) {
    if (id == null) {
      this.id = 1;
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
    AliceEditor.GameProperties.AddPuzzle(puzzle);
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
    AliceEditor.GameProperties.DeletePuzzle(this);
  }

  ResetPuzzle() {
    this.id = null;
    this.goal = { id: -1 };
    this.goalObject = { id: -1 };
    this.how = { id: -1 };
    this.howObject = { id: -1 };
    this.challenge = { id: -1 };
    this.challengeObject = { id: -1 };
  }

  ToJsonObject() {
    return {
      id: this.id,
      type: this.goal.id * 100 + this.how.id * 10 + this.challenge.id,
      args: [this.goalObject.id, this.howObject.id, this.challengeObject.id]
    };
  }
}

const puzzleBuilder = new Puzzle();

// -----------------------STEP 1: CHOOSE GOAL goal functions---------------------------------------------------------------

function GoToALocation() {
  console.log('go to a location');
  puzzleBuilder.UpdateGoal({ id: 0, description: 'Go to Scene ' });
  ChooseNewLocation();
}

function GetAnObject() {
  console.log('get an object');
  puzzleBuilder.UpdateGoal({ id: 1, description: 'Get object ' });
}

function RemoveAnObjectOrCharacter() {
  console.log('Remove an Object or Character');
  puzzleBuilder.UpdateGoal({ id: 2, description: 'Remove an Object or Character which is ' });
}

function ChangeImageOfAnObject() {
  console.log('Change Image of an Object');
  puzzleBuilder.UpdateGoal({ id: 3, description: 'Change Image of ' });
}

// -----------------------STEP 2: CHOOSE LOCATION location---------------------------------------------------------------

function ChooseNewLocation() {
  console.log('the new location is');

  // update goal
  const goal = document.getElementById('choose-goal');
  goal.innerHTML = 'goal: choose new location';
  const locationOptions = CreateDropDownMenu('Location', GetSceneList());
  document.getElementById('choose-location').appendChild(locationOptions);
}

function UpdateLocation(id, SceneName) {
  console.log(`location is ${SceneName}`);
  const location = document.getElementById('choose-location');
  location.innerHTML += ` : ${SceneName}`;
  puzzleBuilder.UpdateGoalObject({
    id: parseInt(id, 10),
    name: SceneName
  });
  ChooseHow();
}

// -----------------------STEP 3: CHOOSE HOW how functions---------------------------------------------------------------

function ChooseHow() {
  const how = CreateDropDownMenu('How', GoToALocationByOptionsList());
  document.getElementById('choose-how').append(how);
}

function UpdateHow(id, method) {
  window.console.log(`Update How: ${id} ${method}`);
  const how = document.getElementById('choose-how');
  how.innerHTML += ` : ${method}`;

  if (method === 'By Clicking an Object') {
    puzzleBuilder.UpdateHow({
      id: parseInt(id, 10),
      description: 'By clicking '
    });
    ChooseObject();
  }
}

function ChooseObject() {
  console.log('choose object');
  const objectList = CreateDropDownMenu('Object', GetObjectList());
  document.getElementById('choose-object').appendChild(objectList);
}

function UpdateObject(id, object) {
  const obj = document.getElementById('choose-object');
  obj.innerHTML += ` : ${object}`;

  puzzleBuilder.UpdateHowObject({
    id: parseInt(id, 10),
    name: object
  });
  AddChallenge();
}

// -----------------------STEP 4: MAKE IT MORE CHALLENGING BY XXX functions------------------------------------
function AddChallenge() {
  const challengeList = CreateDropDownMenu('Challenge', GetChallengeList());
  document.getElementById('choose-challenge').appendChild(challengeList);
}

function AddALock() {
  puzzleBuilder.UpdateChallenge({
    id: 1,
    description: ' is locked. It needs to be unlocked by '
  });
  console.log('add a lock');
}

function AddAGuard() {
  puzzleBuilder.UpdateChallenge({
    id: 2,
    description: ' is guarded by '
  });
  console.log('add a guard');
}

function AddASwich() {
  console.log('add a switch');
  puzzleBuilder.UpdateChallenge({
    id: 3,
    description: ' is controlled by the switch '
  });
  ChooseSwitchObject();
}

function AddLooksGood() {
  console.log('looks good');
  puzzleBuilder.UpdateChallenge({ id: 0, description: '' });
  console.log(puzzleBuilder);
  ShowFinishPuzzleBlock();
}

function UpdateChallenge(id, challenge) {
  const c = document.getElementById('choose-challenge');
  c.innerHTML += ` : ${challenge}`;

  if (id === 0) {
    AddLooksGood();
  } else if (id === 1) {
    AddAGuard();
  } else if (id === 2) {
    AddALock();
  } else {
    AddASwich();
  }
}

// -----------------------STEP 5: CHOOSE THE CHALLENGE OBJECTS functions---------------------------------------------------------------

function ChooseSwitchObject() {
  const chooseChallengeObject = document.getElementById(
    'choose-challenge-object-or-character'
  );
  chooseChallengeObject.innerHTML = 'Unlock object using a switch';
  const dropdownMenu = CreateDropDownMenu('ChallengeObject', GetObjectList());
  chooseChallengeObject.appendChild(dropdownMenu);
}

function UpdateChallengeObject(id, object) {
  const obj = document.getElementById('choose-challenge-object-or-character');
  obj.innerHTML += ` : ${object}`;
  puzzleBuilder.UpdateChallengeObject({
    id: parseInt(id, 10),
    name: object
  });

  ShowFinishPuzzleBlock();
}

// -----------------------STEP 6: Finish and Reset ---------------------------------------------------------------

function ShowFinishPuzzleBlock() {
  const button = document.createElement('button');
  const puzzle = new Puzzle(
    puzzleBuilder.id,
    puzzleBuilder.goal,
    puzzleBuilder.goalObject,
    puzzleBuilder.how,
    puzzleBuilder.howObject,
    puzzleBuilder.challenge,
    puzzleBuilder.challengeObject
  );

  button.innerHTML = 'Finish';
  button.onclick = () => {
    console.log(puzzle);

    const puzzleId = puzzle.ToJsonObject();

    AliceEditor.GameProperties.AddPuzzle(puzzle);

    ClearPuzzleBuilder();
  };

  const finishButton = document.getElementById('choose-finish');
  finishButton.appendChild(button);
}

function ClearPuzzleBuilder() {
  const choices = document.getElementsByClassName('puzzle-builder-block');
  for (let i = 0; i < choices.length; i += 1) {
    choices.item(i).innerHTML = '';
  }

  const goal = document.getElementById('choose-goal');
  goal.innerHTML = 'Goal';

  puzzleBuilder.ResetPuzzle();
}
// -----------------------STEP 7: Insert puzzle into middle  ---------------------------------------------------------------
function AddPuzzleToEditor(Puzzle) {
  const sentence = `Player can go to Scene ${Puzzle.newLocation} by clicking ${
    Puzzle.objectClickedToNewLocation
    } .${Puzzle.newLocation}`;
}

// -----------------------helper functions---------------------------------------------------------------

// return a div of dropdown menu
function CreateDropDownMenu(name, listOfOptions) {
  const wrap = document.createElement('div');
  wrap.className = 'dropdown';
  wrap.setAttribute('class', 'dropdown');

  const menu = document.createElement('div');
  menu.className = 'dropbtn';
  menu.onmouseover = function (event) {
    dropdownShow(event);
  };
  menu.innerHTML = name;

  const dropdownContent = document.createElement('DIV');
  dropdownContent.className = 'dropdown-content';

  l = listOfOptions;
  l.forEach(arrayItem => {
    const itemId = arrayItem.id;
    const itemName = arrayItem.name;

    const option = document.createElement('a');
    option.innerHTML = itemName.toString();
    option.className = 'dropdown-item';

    if (name === 'Goal') {
      option.onclick = function () {
        UpdateGoal(itemId, itemName.toString());
      };
    } else if (name === 'Location') {
      option.onclick = function () {
        UpdateLocation(itemId, itemName.toString());
      };
    } else if (name === 'How') {
      option.onclick = function () {
        UpdateHow(itemId, itemName.toString());
      };
    } else if (name === 'Object') {
      option.onclick = function () {
        UpdateObject(itemId, itemName.toString());
      };
    } else if (name === 'Challenge') {
      option.onclick = function () {
        UpdateChallenge(itemId, itemName.toString());
      };
    } else if (name === 'ChallengeObject') {
      option.onclick = function () {
        UpdateChallengeObject(itemId, itemName.toString());
      };
    }

    dropdownContent.appendChild(option);
  });

  wrap.appendChild(menu);
  wrap.appendChild(dropdownContent);

  console.log(wrap);
  return wrap;
}

// goal 0, 1, 2, 3
// how 0 -> 0
//    1 -> 0, 1, 2, 3
// challenge: 0, 1, 2, 3

// 0x001
// 0x101

function GetObjectList() {
  const sceneObjectsWithNameAndID = [];
  const sceneObjects = AliceEditor.GameProperties.instance.objectList;
  sceneObjects.forEach(sceneObject => {
    const obj = {};
    obj.id = sceneObject.id;
    obj.name = sceneObject.name;
    sceneObjectsWithNameAndID.push(obj);
  });

  return sceneObjectsWithNameAndID;
}

function GetSceneList() {
  const sceneListsWithNameAndID = [];
  const sceneLists = AliceEditor.GameProperties.instance.sceneList;
  sceneLists.forEach(sceneList => {
    const obj = {};
    obj.id = sceneList.id;
    obj.name = sceneList.name;
    sceneListsWithNameAndID.push(obj);
  });

  return sceneListsWithNameAndID;
}

function GetChallengeList() {
  const list = [];
  const challenges = [
    'Looks Good',
    'Add a Lock',
    'Add a Guard',
    'Add a Switch'
  ];
  for (let i = 0; i < challenges.length; i += 1) {
    const obj = {};
    obj.id = i;
    obj.name = challenges[i];
    list.push(obj);
  }

  return list;
}

function GoToALocationByOptionsList() {
  const list = [];
  const options = ['By Clicking an Object'];
  for (let i = 0; i < options.length; i += 1) {
    const obj = {};
    obj.id = i;
    obj.name = options[i];
    list.push(obj);
  }

  return list;
}

// goal: ["Go to a Location","Get an Object","Remove an Object or Character","Change Image of an Object"]
//                0                1                     2                                 3
// how: ['By Clicking an Object']
//                0
// challenge: [ 'Looks Good', 'Add a Lock', 'Add a Guard', 'Add a Switch']
//                    0             1             2               3

// puzzle: 003 args [objectClickedToNewLocation,objectThatUnlocksSwitch,newLocation]
