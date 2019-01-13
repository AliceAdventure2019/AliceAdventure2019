function dropdownShow(event) {
  var targetParent = event.target.parentNode;
   var targetChildren = targetParent.childNodes;
   var target_dropdown;
   var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }

    
   for(j=0;j<targetChildren.length;j++){
      if(targetChildren[j].tagName === 'DIV'){
        target_dropdown = targetChildren[j];

      }
   }

   target_dropdown.classList.toggle("show"); //dropdown_content
  
   // document.getElementById("myDropdown").classList.toggle("show");
}



// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  } 
}

