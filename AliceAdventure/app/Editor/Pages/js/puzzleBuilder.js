// -----------------------STEP 1: CHOOSE GOAL goal functions---------------------------------------------------------------


function GoToALocation() {
    console.log("go to a location");
    ChooseNewLocation();
}

function GetAnObject() {
    console.log("get an object");
}

function RemoveAnObjectOrCharacter() {
    console.log("RemoveAnObjectOrCharacter");
}

function ChangeImageOfAnObject() {
    console.log("ChangeImageOfAnObject");
}


// -----------------------STEP 2: CHOOSE LOCATION location---------------------------------------------------------------

function ChooseNewLocation() {
    console.log("the new location is");

    //update goal
    var goal = document.getElementById("choose-goal");
    goal.innerHTML = "goal: choose new location"

    var locationOptions = CreateDropDownMenu("Location", ['scene1', 'scene2']);
    document.getElementById("choose-location").appendChild(locationOptions);
}

function UpdateLocation(SceneName) {
    console.log("location is " + SceneName);
    var location = document.getElementById("choose-location");
    location.innerHTML += " : " + SceneName;

    ChooseHow()
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
    //TO-Do: get object list from hierarchy
    var objectList = CreateDropDownMenu("Object", ['Pineapple', 'Call Button', 'Arrow', 'Radio']);
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
        }

        dropdownContent.appendChild(option);
    });

    wrap.appendChild(menu);
    wrap.appendChild(dropdownContent);

    console.log(wrap)
    return wrap;
}