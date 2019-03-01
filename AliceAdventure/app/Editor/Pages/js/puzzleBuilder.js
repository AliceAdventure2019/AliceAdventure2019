// -----------------------goal functions---------------------------------------------------------------


function GoToALocation() {
    console.log("go to a location");
    ChooseNewLocation()

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


// -----------------------location---------------------------------------------------------------

function ChooseNewLocation() {
    console.log("the new location is");

    //update goal
    var goal = document.getElementById("choose-goal");
    goal.innerHTML = "goal: choose new location"

    // var newLocation = '<div>New Location is <span>Scene1</span><span>Scene2</span></div>';
    // var newLocation = document.createElement('div'); // is a node
    // newLocation.innerHTML = 'New Location is';

    var locationOptions = CreateDropDownMenu("locations", ['scene1', 'scene2'])
    // newLocation.appendChild(locationOptions)
    // document.getElementById("choose-new-location").appendChild(locationOptions);
    document.getElementById("progressive-builder").appendChild(locationOptions);

    ChooseHow()
}


// -----------------------how functions---------------------------------------------------------------
function ChooseHow() {
    // var how = '<div>How<span>dropdown</span></div>'
}

function ChooseObject() {
    console.log("choose object");
}



// -----------------------add complexity functions---------------------------------------------------------------

function AddALock() {
    console.log("add a lock");
}

function AddAGuard() {
    console.log("add a guard");
}

function AddASwich() {
    console.log("add a switch");
}


// -----------------------helper functions---------------------------------------------------------------


function CreateDropDownMenu(name, listOfOptions) {
    //wrapper div
    var wrap = document.createElement("div")
    wrap.className = "dropdown";
    wrap.setAttribute("class", "dropdown")


    //first child, btn
    var menu = document.createElement("div");
    menu.className = "dropbtn";
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
        dropdownContent.appendChild(option);
    });

    wrap.appendChild(menu);
    wrap.appendChild(dropdownContent);

    console.log(wrap)
    return wrap;
}