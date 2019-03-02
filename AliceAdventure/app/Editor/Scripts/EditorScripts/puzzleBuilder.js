class PuzzleBuilder {

    constructor(goal) {
        this.goal = goal;
        this.newLocation = null;
        this.how = null;
        this.objectClickedToNewLocation = null;
        this.challenge = null;
        this.objectThatUnlocksSwitch = null;
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

}



// -----------------------STEP 1: CHOOSE GOAL goal functions---------------------------------------------------------------


function GoToALocation() {
    console.log("go to a location");
    PuzzleBuilder = new PuzzleBuilder("GoToALocation");
    console.log(PuzzleBlock);
    ChooseNewLocation();
}

function GetAnObject() {
    console.log("get an object");
    PuzzleBuilder = new PuzzleBuilder("GetAnObject");
}

function RemoveAnObjectOrCharacter() {
    console.log("RemoveAnObjectOrCharacter");
    PuzzleBuilder = new PuzzleBuilder("RemoveAnObjectOrCharacter");

}

function ChangeImageOfAnObject() {
    console.log("ChangeImageOfAnObject");
    PuzzleBuilder = new PuzzleBuilder("ChangeImageOfAnObject");

}


// -----------------------STEP 2: CHOOSE LOCATION location---------------------------------------------------------------

function ChooseNewLocation() {
    console.log("the new location is");

    //update goal
    var goal = document.getElementById("choose-goal");
    goal.innerHTML = "goal: choose new location"

    // console.log(AliceEditor.GameProperties.instance.sceneList.map(x => x.name));

    var locationOptions = CreateDropDownMenu("Location", AliceEditor.GameProperties.instance.sceneList.map(x => x.name));
    document.getElementById("choose-location").appendChild(locationOptions);
}

function UpdateLocation(SceneName) {
    console.log("location is " + SceneName);
    var location = document.getElementById("choose-location");
    location.innerHTML += " : " + SceneName;

    ChooseHow();
}


// -----------------------STEP 3: CHOOSE HOW how functions---------------------------------------------------------------
function ChooseHow() {
    var how = CreateDropDownMenu("How", ['By Clicking an Object']);
    document.getElementById("choose-how").append(how);
}

function UpdateHow(method) {
    var how = document.getElementById("choose-how");
    how.innerHTML += " : " + method;

    if (method === "By Clicking an Object") {
        ChooseObject();
    }
}


function ChooseObject() {
    console.log("choose object");
    // console.log(hierarchy)
    // console.log(AliceEditor.GameProperties.instance.objectList.map(x => x.name));
    var objectList = CreateDropDownMenu("Object", AliceEditor.GameProperties.instance.objectList.map(x => x.name));
    document.getElementById("choose-object").appendChild(objectList);
}



function UpdateObject(object) {
    var obj = document.getElementById("choose-object");
    obj.innerHTML += " : " + object;

    AddChallenge();
}


// -----------------------STEP 4: MAKE IT MORE CHALLENGING BY XXX functions---------------------------------------------------------------

function AddChallenge() {
    var challengeList = CreateDropDownMenu("Challenge", ['Add a Lock', 'Add a Guard', 'Add a Switch', 'Looks Good']);
    document.getElementById("choose-challenge").appendChild(challengeList);
}

function AddALock() {
    console.log("add a lock");
}

function AddAGuard() {
    console.log("add a guard");
}

function AddASwich() {
    console.log("add a switch");
    ChooseSwitchObject();
}

function AddLooksGood() {
    console.log("looks good");
}

function UpdateChallenge(challenge) {
    var c = document.getElementById("choose-challenge");
    c.innerHTML += " : " + challenge;

    if (challenge === "Add a Lock") {
        AddALock();
    } else if (challenge === "Add a Guard") {
        AddAGuard();
    } else if (challenge === "Add a Switch") {
        AddASwich();
    } else {
        AddLooksGood();
    }
}


// -----------------------STEP 5: CHOOSE THE CHALLENGE OBJECTS functions---------------------------------------------------------------


function ChooseSwitchObject() {
    var chooseChallengeObject = document.getElementById("choose-challenge-object-or-character");
    chooseChallengeObject.innerHTML = "Unlock object using a switch"
    var dropdownMenu = CreateDropDownMenu("ChallengeObject", AliceEditor.GameProperties.instance.objectList.map(x => x.name));
    chooseChallengeObject.appendChild(dropdownMenu);
}

function UpdateChallengeObject(object) {
    var obj = document.getElementById("choose-challenge-object-or-character");
    obj.innerHTML += " : " + object;
    ShowFinishPuzzleBlock();

}


// -----------------------STEP 6: Finish ---------------------------------------------------------------

function ShowFinishPuzzleBlock() {
    const button = document.createElement("button");
    button.innerHTML = "Finish";
    button.className

    let finishButton = document.getElementById("choose-finish");
    finishButton.appendChild(button)

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
        var option = document.createElement("a");
        option.innerHTML = arrayItem.toString();
        // option.setAttribute("class", "dropdown-item")
        option.className = "dropdown-item";
        if (name === "Goal") {
            option.onclick = function () {
                UpdateGoal(arrayItem.toString());
            }
        }
        else if (name === "Location") {
            option.onclick = function () {
                UpdateLocation(arrayItem.toString());
            }
        } else if (name === "How") {
            option.onclick = function () {
                UpdateHow(arrayItem.toString());
            }
        } else if (name === "Object") {
            option.onclick = function () {
                UpdateObject(arrayItem.toString());
            }
        } else if (name === "Challenge") {
            option.onclick = function () {
                UpdateChallenge(arrayItem.toString());
            }
        } else if (name == "ChallengeObject") {
            option.onclick = function () {
                UpdateChallengeObject(arrayItem.toString());
            }
        }

        dropdownContent.appendChild(option);
    });

    wrap.appendChild(menu);
    wrap.appendChild(dropdownContent);

    console.log(wrap)
    return wrap;
}