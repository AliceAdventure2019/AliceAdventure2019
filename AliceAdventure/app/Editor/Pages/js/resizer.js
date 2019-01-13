angular.module('mc.resizer', []).directive('resizer', function($document) {

  return function($scope, $element, $attrs) {

    $element.on('mousedown', function(event) {
      event.preventDefault();

      $document.on('mousemove', mousemove);
      $document.on('mouseup', mouseup);
    });

    function mousemove(event) {

      if ($attrs.resizer == 'vertical-left') {
        // Handle vertical resizer for left 
        var x = event.pageX;

        if ($attrs.resizerMax && x > $attrs.resizerMax) {
          x = parseInt($attrs.resizerMax);
        }

        if(x>10){
          $element.css({
            left: x + 'px'
          });

          $($attrs.resizerLeft).css({
            width: x + 'px'
          });
          $($attrs.resizerRight).css({
            left: (x + parseInt($attrs.resizerWidth)) + 'px'
          });
        }  

      } else if($attrs.resizer == 'vertical-right'){
          var x = window.innerWidth -event.pageX;

        if ($attrs.resizerMax && x > $attrs.resizerMax) {
          x = parseInt($attrs.resizerMax);
        }

          if(x>10){
          $element.css({
            right: x + 'px'
          });

          $($attrs.resizerLeft).css({
           right: (x + parseInt($attrs.resizerWidth)) + 'px'
          });
          $($attrs.resizerRight).css({
             width: x + 'px'
            
          });
          
        }
      }else if($attrs.resizer =='horizontal'){
        // Handle horizontal resizer


        var y = window.innerHeight - event.pageY;
        if (y > 100 && y < $attrs.resizerMin) {

          $element.css({
            bottom: y + 'px'
          });

          $($attrs.resizerTop).css({
            bottom: (y + parseInt($attrs.resizerHeight)) + 'px'
          });
          $($attrs.resizerBottom).css({
            height: y + 'px'
          });

        }
      }
    }

    function mouseup() {
      $document.unbind('mousemove', mousemove);
      $document.unbind('mouseup', mouseup);
    }
  };
});