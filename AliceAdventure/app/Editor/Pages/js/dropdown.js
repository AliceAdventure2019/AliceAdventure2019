function dropdownShow(event) {
  const targetParent = event.target.parentNode;
  const targetChildren = targetParent.childNodes;
  const dropdowns = document.getElementsByClassName('dropdown-content');
  for (let i = 0; i < dropdowns.length; i += 1) {
    const openDropdown = dropdowns[i];
    if (openDropdown.classList.contains('show')) {
      openDropdown.classList.remove('show');
    }
  }

  for (let j = 0; j < targetChildren.length; j += 1) {
    if (targetChildren[j].tagName === 'DIV') {
      const targetDropdown = targetChildren[j];
      targetDropdown.classList.toggle('show');
    }
  }

  // dropdown_content

  // document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = event => {
  if (!event.target.matches('.dropbtn')) {
    const dropdowns = document.getElementsByClassName('dropdown-content');
    let i;
    for (i = 0; i < dropdowns.length; i += 1) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};
