class PuzzleBuilder {

    constructor() {
        this.goal = null;
        this.newLocation = null;
        this.how = null;
        this.objectClickedToNewLocation = null;
        this.challenge = null;
        this.objectThatUnlocksSwitch = null;
    }

    UpdatePuzzleGoal(goal) {
        console.log(AliceEditor.GameProperties.instance.sceneList.map(x => x.narrative))
        this.goal = goal;
    }

    UpdatePuzzleNewLocation(SceneName) {
        this.newLocation = SceneName;
    }

    UpdatePuzzleHow(how) {
        this.how = how;
    }

    UpdatePuzzleObjectClickedToNewLocation(object) {
        this.objectClickedToNewLocation = object;
    }

    UpdatePuzzleChallenge(challenge) {
        this.challenge = challenge;
    }

    UpdatePuzzleChallengeObject(object) {
        this.objectThatUnlocksSwitch = object;
    }

    ToJsonObject() {
        let obj = {};
        obj.goal = this.goal;
        obj.newLocation = this.newLocation;
        obj.how = this.how;
        obj.objectClickedToNewLocation = this.objectClickedToNewLocation;
        obj.challenge = this.challenge;
        obj.objectThatUnlocksSwitch = this.objectThatUnlocksSwitch;
        return obj;
    }

    ResetPuzzle() {
        this.goal = null;
        this.newLocation = null;
        this.how = null;
        this.objectClickedToNewLocation = null;
        this.challenge = null;
        this.objectThatUnlocksSwitch = null;
    }

}

let puzzleBuilder = new PuzzleBuilder();



// -----------------------STEP 1: CHOOSE GOAL goal functions---------------------------------------------------------------


function GoToALocation() {
    console.log("go to a location");
    puzzleBuilder.UpdatePuzzleGoal(0);
    ChooseNewLocation();
}

function GetAnObject() {
    console.log("get an object");
    alert("not supported right now");
}

function RemoveAnObjectOrCharacter() {
    console.log("Remove an Object or Character");
    alert("not supported right now");
}

function ChangeImageOfAnObject() {
    console.log("Change Image of an Object");
    alert("not supported right now");
}


// -----------------------STEP 2: CHOOSE LOCATION location---------------------------------------------------------------

function ChooseNewLocation() {
    console.log("the new location is");

    //update goal
    const goal = document.getElementById("choose-goal");
    goal.innerHTML = "goal: choose new location"
    const locationOptions = CreateDropDownMenu("Location", GetSceneList());
    document.getElementById("choose-location").appendChild(locationOptions);
}

function UpdateLocation(id, SceneName) {
    console.log("location is " + SceneName);
    const location = document.getElementById("choose-location");
    location.innerHTML += " : " + SceneName;
    puzzleBuilder.UpdatePuzzleNewLocation(parseInt(id));
    ChooseHow();
}


// -----------------------STEP 3: CHOOSE HOW how functions---------------------------------------------------------------


function ChooseHow() {
    const how = CreateDropDownMenu("How", GoToALocationByOptionsList());
    document.getElementById("choose-how").append(how);
}

function UpdateHow(id, method) {
    const how = document.getElementById("choose-how");
    how.innerHTML += " : " + method;

    if (method === "By Clicking an Object") {
        puzzleBuilder.UpdatePuzzleHow(parseInt(id));
        ChooseObject();
    }
}


function ChooseObject() {
    console.log("choose object");
    const objectList = CreateDropDownMenu("Object", GetObjectList());
    document.getElementById("choose-object").appendChild(objectList);
}



function UpdateObject(id, object) {
    const obj = document.getElementById("choose-object");
    obj.innerHTML += " : " + object;

    puzzleBuilder.UpdatePuzzleObjectClickedToNewLocation(parseInt(id));
    AddChallenge();
}


// -----------------------STEP 4: MAKE IT MORE CHALLENGING BY XXX functions------------------------------------
function AddChallenge() {
    const challengeList = CreateDropDownMenu("Challenge", GetChallengeList());
    document.getElementById("choose-challenge").appendChild(challengeList);
}

function AddALock() {
    puzzleBuilder.UpdatePuzzleChallenge(0);
    console.log("add a lock");
}

function AddAGuard() {
    puzzleBuilder.UpdatePuzzleChallenge(1);
    console.log("add a guard");
}

function AddASwich() {
    console.log("add a switch");
    puzzleBuilder.UpdatePuzzleChallenge(2);
    ChooseSwitchObject();
}

function AddLooksGood() {
    console.log("looks good");
    puzzleBuilder.UpdatePuzzleChallenge(3);
    ShowFinishPuzzleBlock();
}

function UpdateChallenge(id, challenge) {
    const c = document.getElementById("choose-challenge");
    c.innerHTML += " : " + challenge;

    if (id === 0) {
        AddLooksGood();
    } else if (id === 1) {
        AddAGuard();
    } else if (id === 2) {
        AddASwich();
    } else {
        AddALock();

    }
}


// -----------------------STEP 5: CHOOSE THE CHALLENGE OBJECTS functions---------------------------------------------------------------


function ChooseSwitchObject() {
    const chooseChallengeObject = document.getElementById("choose-challenge-object-or-character");
    chooseChallengeObject.innerHTML = "Unlock object using a switch"
    const dropdownMenu = CreateDropDownMenu("ChallengeObject", GetObjectList());
    chooseChallengeObject.appendChild(dropdownMenu);
}

function UpdateChallengeObject(id, object) {
    const obj = document.getElementById("choose-challenge-object-or-character");
    obj.innerHTML += " : " + object;
    puzzleBuilder.UpdatePuzzleChallengeObject(parseInt(id));

    ShowFinishPuzzleBlock();

}


// -----------------------STEP 6: Finish and Reset ---------------------------------------------------------------

function ShowFinishPuzzleBlock() {
    const button = document.createElement("button");
    button.innerHTML = "Finish";
    button.onclick = function () {
        ClearPuzzleBuilder();
    }

    const finishButton = document.getElementById("choose-finish");
    finishButton.appendChild(button)

    const finishedPuzzle = puzzleBuilder.ToJsonObject();
    const puzzleId = PuzzleToPuzzleId(finishedPuzzle);

    AliceEditor.GameProperties.AddPuzzle(puzzleId);


    console.log(puzzleId);


}

function ClearPuzzleBuilder() {
    const choices = document.getElementsByClassName("puzzle-builder-block");
    for (let i = 0; i < choices.length; i++) {
        choices.item(i).innerHTML = "";
    }

    const goal = document.getElementById("choose-goal");
    goal.innerHTML = "Goal";

    puzzleBuilder.ResetPuzzle();
}
// -----------------------STEP 7: Insert puzzle into middle  ---------------------------------------------------------------
function AddPuzzleToEditor(Puzzle) {
    const sentence = "Player can go to Scene " + Puzzle.newLocation + " by clicking " + Puzzle.objectClickedToNewLocation + " ." + Puzzle.newLocation;

}


// -----------------------helper functions---------------------------------------------------------------


// return a div of dropdown menu
function CreateDropDownMenu(name, listOfOptions) {
    const wrap = document.createElement("div")
    wrap.className = "dropdown";
    wrap.setAttribute("class", "dropdown")

    const menu = document.createElement("div");
    menu.className = "dropbtn";
    menu.onmouseover = function (event) {
        dropdownShow(event);
    };
    menu.innerHTML = name;

    const dropdownContent = document.createElement("DIV")
    dropdownContent.className = "dropdown-content"

    l = listOfOptions
    l.forEach(function (arrayItem) {
        const itemId = arrayItem["id"];
        const itemName = arrayItem["name"];

        let option = document.createElement("a");
        option.innerHTML = itemName.toString();
        option.className = "dropdown-item";

        if (name === "Goal") {
            option.onclick = function () {
                UpdateGoal(itemId, itemName.toString());
            }
        }
        else if (name === "Location") {
            option.onclick = function () {
                UpdateLocation(itemId, itemName.toString());
            }
        } else if (name === "How") {
            option.onclick = function () {
                UpdateHow(itemId, itemName.toString());
            }
        } else if (name === "Object") {
            option.onclick = function () {
                UpdateObject(itemId, itemName.toString());
            }
        } else if (name === "Challenge") {
            option.onclick = function () {
                UpdateChallenge(itemId, itemName.toString());
            }
        } else if (name == "ChallengeObject") {
            option.onclick = function () {
                UpdateChallengeObject(itemId, itemName.toString());
            }
        }

        dropdownContent.appendChild(option);
    });

    wrap.appendChild(menu);
    wrap.appendChild(dropdownContent);

    console.log(wrap)
    return wrap;
}

//goal 0, 1, 2, 3
//how 0 -> 0
//    1 -> 0, 1, 2, 3
//challenge: 0, 1, 2, 3

//0x001
//0x101

function GetObjectList() {
    let sceneObjectsWithNameAndID = [];
    sceneObjects = AliceEditor.GameProperties.instance.objectList;
    sceneObjects.forEach(function (sceneObject) {
        let obj = {}
        obj["id"] = sceneObject.id;
        obj["name"] = sceneObject.name;
        sceneObjectsWithNameAndID.push(obj);
    });

    return sceneObjectsWithNameAndID;

}

function GetSceneList() {
    let sceneListsWithNameAndID = [];
    sceneLists = AliceEditor.GameProperties.instance.sceneList;
    sceneLists.forEach(function (sceneList) {
        let obj = {}
        obj["id"] = sceneList.id;
        obj["name"] = sceneList.name;
        sceneListsWithNameAndID.push(obj);
    });

    return sceneListsWithNameAndID;

}

function GetChallengeList() {
    let list = []
    const challenges = ['Looks Good', 'Add a Lock', 'Add a Guard', 'Add a Switch'];
    for (let i = 0; i < challenges.length; i++) {
        let obj = {}
        obj["id"] = i;
        obj["name"] = challenges[i];
        list.push(obj);
    }

    return list;
}

function GoToALocationByOptionsList() {
    let list = []
    const options = ['By Clicking an Object'];
    for (let i = 0; i < options.length; i++) {
        let obj = {}
        obj["id"] = i;
        obj["name"] = options[i];
        list.push(obj);
    }

    return list;
}


function PuzzleToPuzzleId(jsonObj) {
    let map = {};
    const type = jsonObj.goal * 100 + jsonObj.how * 10 + jsonObj.challenge;
    const args = [jsonObj.objectClickedToNewLocation, jsonObj.objectThatUnlocksSwitch, jsonObj.newLocation];
    const id = AliceEditor.GameProperties.instance.puzzleList.length + 1;
    map["id"] = id;
    map["type"] = type;
    map["args"] = args;
    return map;
}


// goal: ["Go to a Location","Get an Object","Remove an Object or Character","Change Image of an Object"]
//                0                1                     2                                 3
// how: ['By Clicking an Object']
//                0
// challenge: [ 'Looks Good', 'Add a Lock', 'Add a Guard', 'Add a Switch']
//                    0             1             2               3


// puzzle: 003 args [objectClickedToNewLocation,objectThatUnlocksSwitch,newLocation]