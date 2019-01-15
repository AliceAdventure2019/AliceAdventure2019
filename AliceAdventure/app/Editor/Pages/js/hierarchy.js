function showListView(event) {
  //	document.addEventListener("click", function(event){
  const targetElement = event.target || event.srcElement;
  const parentTargetElement = targetElement.parentElement;
  console.log(parentTargetElement.nodeName);
  const childTargetElements = parentTargetElement.childNodes;
  let childTargetElement;
  let childTargetElementLi;

  let icon;

  for (let k = 0; k < parentTargetElement.childNodes.length; k += 1) {
    if (parentTargetElement.childNodes[k].tagName === 'I')
      icon = parentTargetElement.childNodes[k];
  }

  if (childTargetElements !== null) {
    for (let t = 0; t < childTargetElements.length; t += 1) {
      if (childTargetElements[t].tagName === 'OL') {
        childTargetElement = childTargetElements[t];
      }
    }
  }

  for (let j = 0; j < childTargetElement.childNodes.length; j += 1) {
    if (childTargetElement.childNodes[j].tagName === 'LI') {
      childTargetElementLi = childTargetElement.childNodes[j];
    }
  }

  if (childTargetElementLi !== null) {
    if (childTargetElement.style.display === 'none') {
      icon.className = 'down';
      childTargetElement.style.display = 'block';
    } else if (childTargetElement.style.display === 'block') {
      childTargetElement.style.display = 'none';
      icon.className = 'right';
    }
  }

  // });
}
