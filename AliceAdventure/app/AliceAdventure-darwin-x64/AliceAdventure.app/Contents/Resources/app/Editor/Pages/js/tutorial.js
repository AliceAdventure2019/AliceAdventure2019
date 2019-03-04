  var state = 1;
  function goBack(){
  	var state_1 = document.getElementById('step_1');
  	  var state_2 = document.getElementById('step_2');
  	  var state_3 = document.getElementById('step_3');
  	  var state_4 = document.getElementById('step_4');
  	switch(state){
  		case 2:
  		state = 1;
  		state_1.style.display = "block";
  		state_2.style.display = "none";
  		break;
  		case 3:
  		state = 2;
  		state_2.style.display = "block";
  		state_3.style.display = "none";
  		break;
  		case 4:
  		state =3;
  		state_3.style.display = "block";
  		state_4.style.display = "none";
  		break;
  		default:
  		break;
  	}
  }
  function goToNext(){
  	  var state_1 = document.getElementById('step_1');
  	  var state_2 = document.getElementById('step_2');
  	  var state_3 = document.getElementById('step_3');
  	  var state_4 = document.getElementById('step_4');
  	switch(state){
  		case 1:
  		state =2;
  		state_1.style.display = "none";
  		state_2.style.display = "block";
  	
  		break;
  		case 2:
  		state =3;
  		state_2.style.display = "none";
  		state_3.style.display = "block";
  		break;
  		case 3:
  		state =4;
  		state_3.style.display = "none";
  		state_4.style.display = "block";
  		break;
  		case 4:
  		state =5;
  		break;
  		default:
  		break;

  	}

   }

    function goSkip(){
    	state = 5;
    }