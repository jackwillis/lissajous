var ParametricQueue = function(xt, yt, size) {
  var queue = FixedQueue(size);

  queue.t = 0;
  queue.step = function(tstep) {
    this.push([ xt(this.t), yt(this.t) ]);
    this.t += tstep;
  };

  return queue;
};

window.onload=function(){

  drawGrid();

  //////////////////////////////////////////////////////

  var canvas = document.getElementById("lissajous");
  var ctx = canvas.getContext("2d");

  var width = canvas.width, height = canvas.height;

  ctx.fillStyle = "black";
  ctx.fillRect(0,0, width,height);
  ctx.strokeStyle = "limegreen";

  function reset() { ctx.fillRect(0,0, width,height); }

  var graph = DataGrapher(canvas, [-1.1, 1.1], [-1.1, 1.1]);

  //////////////////////////////////////////////////////////

  var program = document.getElementById("program");

  program.oldValue = "";

  function updateLissajous() {
    if (this.value === this.oldValue) return;
    this.oldValue = this.value;

    clearInterval(window.loopInterval);
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

  program.onkeyup = program.onchange = updateLissajous;

  updateLissajous.call(program);

  document.getElementById("button-print").onclick = function() {
    window.open(canvas.toDataURL());
  };


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