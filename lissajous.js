window.onload=function(){

  drawGrid();

  //////////////////////////////////////////////////////

  var canvas = document.getElementById("lissajous");
  var ctx = canvas.getContext("2d");

  var width = canvas.width,
     height = canvas.height;

  ctx.fillStyle = "black";
  ctx.fillRect(0,0, width,height);
  ctx.strokeStyle = "limegreen";

  function reset() { ctx.fillRect(0,0, width,height); }

  var graph = DataGrapher(canvas, [-1.1, 1.1], [-1.1, 1.1]).oldRender;

  //////////////////////////////////////////////////////////

  function updateLissajous() {
    reset();

    if (this.value === this.oldValue) return;
    this.oldValue = this.value;

    cancelAnimationFrame(window.loopRequest);
    this.class = "flash";

    try
    {
      eval(this.value);
    }
    catch (error)
    {
      reset();

      var oldFillStyle = ctx.fillStyle;
      ctx.fillStyle = ctx.strokeStyle;
      ctx.font = '14pt serif';
      ctx.fillText(error, 50,50);
      ctx.fillStyle = oldFillStyle;

      console.log(error);
    }
  };

  var program = document.getElementById("program");

  program.oldValue = "";

  program.onkeyup = program.onchange = updateLissajous;

  updateLissajous.call(program);

  document.getElementById("button-print").onclick = function() {
    window.open(canvas.toDataURL());
  };

  ////

  
  var createKnobCSS = function(knob, id) {
    var $input     = $(knob.element),
        $container = $('<div class="container '+ id + '">'),
        $body      = $('<div class="ui-knob ui-shadow '+ id + '">'),
        $indicator = $('<div class="ui-indicator '+ id + '">');

    $container.append($body);
    $container.append($indicator);

    // $input.hide();
    $container.insertBefore($input);
    $container.append($input);

    // center knob in container
    $body.css({
      "margin-top": -($body.outerHeight()/2),
      "margin-left":-($body.outerWidth()/2)
    });

    setupKnob(knob, $container[0]);
  }

  var drawKnobCSS = function(knob, indicator) {
    var $indicator = $(knob.element).siblings('.ui-indicator');
    $indicator.css({
      left: indicator.x - $indicator.outerWidth()/2,
      top:  indicator.y - $indicator.outerHeight()/2
    });

    var rotateText = 'rotate('+(-indicator.angle)+'deg)';
    $indicator.css({
      'transform': rotateText,
      '-webkit-transform': rotateText,
      '-moz-transform': rotateText,
      '-o-transform': rotateText
    });
  }


  var positionRotateKnob = new Knob(document.getElementById('position-rotate'),
    function(knob, indicator) {
      drawKnobCSS(knob, indicator);
    }
  );
  createKnobCSS(positionRotateKnob, 'position-rotate');

};

function drawGrid() {
  var grid = document.getElementById("grid");
  var grid_ctx = grid.getContext("2d");

  grid_ctx.lineWidth = 1;
  grid_ctx.strokeStyle = "darkgreen";

  grid_ctx.beginPath();

  var x_tics = 10, y_tics = 8;

  var i;

  for (i=0; i<x_tics; i++)
  {
    grid_ctx.moveTo(i*grid.width/x_tics, 0);
    grid_ctx.lineTo(i*grid.width/x_tics, grid.height);
  }

  for (i=0; i<y_tics; i++)
  {
    grid_ctx.moveTo(0, i*grid.width/y_tics);
    grid_ctx.lineTo(grid.width, i*grid.width/y_tics);
  }

  grid_ctx.stroke();
}