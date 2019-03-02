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
    // PuzzleBuilder = new PuzzleBuilder("GoToALocation");
    puzzleBuilder.UpdatePuzzleGoal(0);
    ChooseNewLocation();
}

function GetAnObject() {
    console.log("get an object");
    alert("not supported right now");
    // PuzzleBuilder = new PuzzleBuilder("GetAnObject");
}

function RemoveAnObjectOrCharacter() {
    console.log("RemoveAnObjectOrCharacter");
    alert("not supported right now");
    // PuzzleBuilder = new PuzzleBuilder("RemoveAnObjectOrCharacter");

}

function ChangeImageOfAnObject() {
    console.log("ChangeImageOfAnObject");
    alert("not supported right now");
    // PuzzleBuilder = new PuzzleBuilder("ChangeImageOfAnObject");

}


// -----------------------STEP 2: CHOOSE LOCATION location---------------------------------------------------------------

function ChooseNewLocation() {
    console.log("the new location is");

    //update goal
    var goal = document.getElementById("choose-goal");
    goal.innerHTML = "goal: choose new location"

    // console.log(AliceEditor.GameProperties.instance.sceneList.map(x => x.id));

    var locationOptions = CreateDropDownMenu("Location", GetSceneList());
    document.getElementById("choose-location").appendChild(locationOptions);
}

function UpdateLocation(id, SceneName) {
    console.log("location is " + SceneName);
    var location = document.getElementById("choose-location");
    location.innerHTML += " : " + SceneName;
    puzzleBuilder.UpdatePuzzleNewLocation(parseInt(id));
    ChooseHow();
}


// -----------------------STEP 3: CHOOSE HOW how functions---------------------------------------------------------------
function ChooseHow() {
    var how = CreateDropDownMenu("How", GoToALocationByOptionsList());
    document.getElementById("choose-how").append(how);
}

function UpdateHow(id, method) {
    var how = document.getElementById("choose-how");
    how.innerHTML += " : " + method;

    if (method === "By Clicking an Object") {
        puzzleBuilder.UpdatePuzzleHow(parseInt(id));
        ChooseObject();
    }
}


function ChooseObject() {
    console.log("choose object");
    // console.log(hierarchy)
    var objectList = CreateDropDownMenu("Object", GetObjectList());
    document.getElementById("choose-object").appendChild(objectList);
}



function UpdateObject(id, object) {
    var obj = document.getElementById("choose-object");
    obj.innerHTML += " : " + object;

    puzzleBuilder.UpdatePuzzleObjectClickedToNewLocation(parseInt(id));
    AddChallenge();
}


// -----------------------STEP 4: MAKE IT MORE CHALLENGING BY XXX functions---------------------------------------------------------------

function AddChallenge() {
    var challengeList = CreateDropDownMenu("Challenge", GetChallengeList());
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
    var c = document.getElementById("choose-challenge");
    c.innerHTML += " : " + challenge;

    if (id === 0) {
        AddALock();
    } else if (id === 1) {
        AddAGuard();
    } else if (id === 2) {
        AddASwich();
    } else {
        AddLooksGood();
    }
}


// -----------------------STEP 5: CHOOSE THE CHALLENGE OBJECTS functions---------------------------------------------------------------


function ChooseSwitchObject() {
    var chooseChallengeObject = document.getElementById("choose-challenge-object-or-character");
    chooseChallengeObject.innerHTML = "Unlock object using a switch"
    var dropdownMenu = CreateDropDownMenu("ChallengeObject", GetObjectList());
    chooseChallengeObject.appendChild(dropdownMenu);
}

function UpdateChallengeObject(id, object) {
    var obj = document.getElementById("choose-challenge-object-or-character");
    obj.innerHTML += " : " + object;
    puzzleBuilder.UpdatePuzzleChallengeObject(parseInt(id));

    ShowFinishPuzzleBlock();

}


// -----------------------STEP 6: Finish ---------------------------------------------------------------

function ShowFinishPuzzleBlock() {
    const button = document.createElement("button");
    button.innerHTML = "Finish";
    button.onclick = function () {
        ClearPuzzleBuilder();
    }

    let finishButton = document.getElementById("choose-finish");
    finishButton.appendChild(button)

    let finishedPuzzle = puzzleBuilder.ToJsonObject();


    console.log(finishedPuzzle);


}

function ClearPuzzleBuilder() {
    let choices = document.getElementsByClassName("puzzle-builder-block");
    for (var i = 0; i < choices.length; i++) {
        choices.item(i).innerHTML = "";
    }

    const goal = document.getElementById("choose-goal");
    goal.innerHTML = "Goal";

    puzzleBuilder.ResetPuzzle();
}



// -----------------------helper functions---------------------------------------------------------------


// return a div of dropdown menu
function CreateDropDownMenu(name, listOfOptions) {
    //wrapper div
    var wrap = document.createElement("div")
    wrap.className = "dropdown";
    wrap.setAttribute("class", "dropdown")


    //first child, btn
    var menu = document.createElement("div");
    menu.className = "dropbtn";
    // menu.setAttribute("id", "choose-location")
    menu.onmouseover = function (event) {
        dropdownShow(event);
    };
    // menu.setAttribute("class", "dropbtn");
    menu.innerHTML = name;

    //second child, dropdowns
    var dropdownContent = document.createElement("DIV")
    // dropdownContent.setAttribute("class", "dropdown-content")
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
    const challenges = ['Add a Lock', 'Add a Guard', 'Add a Switch', 'Looks Good'];
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