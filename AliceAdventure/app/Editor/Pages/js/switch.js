function switchGalleryView() {
  var x = document.getElementById('gallery');
  var y = document.getElementById('object-list');

  if (x.style.display === 'none' || y.style.display === 'block') {
    x.style.display = 'block';
    y.style.display = 'none';
  } else {
  }
}

function switchListView() {
  var y = document.getElementById('gallery');
  var x = document.getElementById('object-list');

  if (x.style.display === 'none' || y.style.display === 'block') {
    x.style.display = 'block';
    y.style.display = 'none';
  } else {
  }
}

function switchCategoryView() {
  /*if (document.addEventListener){}else if (document.attachEvent) {  }
   */

  document.addEventListener('click', function(event) {
    var target = event.target;
    var previous_selected = document.getElementsByClassName('selected');
    var assetName = target.getAttribute('aria-controls');
    if (target.className === 'unselecteds') {
      for (i = 0; i < previous_selected.length; i++) {
        previous_selected[i].setAttribute('class', 'unselecteds');
      }

      var unselecteds = document.getElementsByClassName('unselecteds');
      target.className = 'selected';
      document.getElementById(assetName).style.display = 'block';

      var assetName_unselected = [];

      if (unselecteds.length !== null) {
        for (j = 0; j < unselecteds.length; j++) {
          assetName_unselected[j] = unselecteds[j].getAttribute(
            'aria-controls'
          );
        }
        for (t = 0; t < unselecteds.length; t++) {
          document.getElementById(assetName_unselected[t]).style.display =
            'none';
        }

        assetName_unselected = null;
        unselecteds = null;
      }
    }
  });
}

function switchCategoryView2() {
  /*if (document.addEventListener){}else if (document.attachEvent) {  }
   */

  document.addEventListener('click', function(event) {
    var target = event.target;
    var previous_selected = document.getElementsByClassName('selected2');
    var assetName = target.getAttribute('aria-controls');
    if (target.className === 'unselecteds2') {
      console.log('yes');
      for (i = 0; i < previous_selected.length; i++) {
        previous_selected[i].setAttribute('class', 'unselecteds2');
      }

      var unselecteds2 = document.getElementsByClassName('unselecteds2');
      target.className = 'selected2';

      document.getElementById(assetName).style.display = 'block';

      var assetName_unselected = [];

      if (unselecteds2.length !== null) {
        for (j = 0; j < unselecteds2.length; j++) {
          assetName_unselected[j] = unselecteds2[j].getAttribute(
            'aria-controls'
          );
        }

        for (t = 0; t < unselecteds2.length; t++) {
          document.getElementById(assetName_unselected[t]).style.display =
            'none';
        }

        assetName_unselected = null;
        unselecteds2 = null;
      }
    }
  });
}
