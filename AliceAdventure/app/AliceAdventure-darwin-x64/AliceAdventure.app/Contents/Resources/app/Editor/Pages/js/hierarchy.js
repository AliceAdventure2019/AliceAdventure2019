function showListView(event) {
				//document.addEventListener("click", function(event){
					var targetElement = event.target || event.srcElement;
					var parentTargetElement = targetElement.parentElement;
					console.log(parentTargetElement.nodeName);
					var childTargetElements = parentTargetElement.childNodes;
					var childTargetElement;
					var childTargetElementLi;

					var icon;
	

					for(k=0;k<parentTargetElement.childNodes.length;k++){
						if(parentTargetElement.childNodes[k].tagName === 'I')
						icon = parentTargetElement.childNodes[k];
					}
					

					if(childTargetElements !== null){
						for(t=0; t<childTargetElements.length; t++){
							if(childTargetElements[t].tagName === 'OL'){
								childTargetElement = childTargetElements[t];
							} 
						}

						
					}

					for(j=0; j<childTargetElement.childNodes.length; j++){
						if(childTargetElement.childNodes[j].tagName === 'LI'){
							childTargetElementLi = childTargetElement.childNodes[j];
						}
					}

					
					if(childTargetElementLi !== null){ 
							if(childTargetElement.style.display === "none"){
								icon.className = "down";
								childTargetElement.style.display = "block";
							}else if(childTargetElement.style.display === "block"){
										childTargetElement.style.display = "none";
										icon.className = "right";
							} 
					}
					
				//});
			}