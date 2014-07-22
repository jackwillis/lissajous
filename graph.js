// This helper function does a maps a value `x` from some window [a, b] to [c, d].
//
//     rescale(x, { from: [a, b], to: [c, d] })
//     rescale(0.214, { from: [-1, 1], to: [0, 500] }) //=> 303.5

var rescale = function(to_from) {
  var to   = to_from.to,
      from = to_from.from,

      a = from[0],
      b = from[1],
      c = to[0],
      d = to[1];

  return function (x) {
    return c + (d - c) * (x - a) / (b - a);
  };
};


var DataGrapher = function(canvas, xwindow, ywindow) {
  var ctx = canvas.getContext("2d");

  var rescalex = rescale({ from: xwindow, to: [0, canvas.width] }),
      rescaley = rescale({ from: ywindow, to: [canvas.height, 0] });

  ctx.fillStyle = "black";
  var w = canvas.width, h = canvas.height;

  return {

    oldRender: function(points) {
      ctx.fillRect(0,0, w,h);

      var graphx, graphy, canvasx, canvasy, i;
      ctx.beginPath();
      for (i=0; i<points.length; i++)
      {
        graphx = points[i][0];
        graphy = points[i][1];
        
        canvasx = parseInt( rescalex(graphx) );
        canvasy = parseInt( rescaley(graphy) );
        ctx.lineTo(canvasx, canvasy);
      }
      ctx.stroke();
    },

    newRender: function(points) {
      var graphx, graphy, canvasx, canvasy, i;

      if (!points[1]) return;

      ctx.strokeStyle="black";
      ctx.lineWidth=3;
      ctx.beginPath();

      graphx = points[0][0];
      graphy = points[0][1];
      canvasx = parseInt( rescalex(graphx) );
      canvasy = parseInt( rescaley(graphy) );
      ctx.moveTo(canvasx, canvasy);

      graphx = points[1][0];
      graphy = points[1][1];
      canvasx = parseInt( rescalex(graphx) );
      canvasy = parseInt( rescaley(graphy) );
      ctx.lineTo(canvasx, canvasy);

      ctx.stroke();

      ctx.strokeStyle="limegreen";
      ctx.lineWidth=1;
      ctx.beginPath();

      graphx = points[points.length-2][0];
      graphy = points[points.length-2][1];
      canvasx = parseInt( rescalex(graphx) );
      canvasy = parseInt( rescaley(graphy) );
      ctx.moveTo(canvasx, canvasy);

      graphx = points[points.length-1][0];
      graphy = points[points.length-1][1];
      canvasx = parseInt( rescalex(graphx) );
      canvasy = parseInt( rescaley(graphy) );
      ctx.lineTo(canvasx, canvasy);

      ctx.stroke();

      console.log(points.length);
    }

  };
};

var ParametricQueue = function(xt, yt, size) {
  var queue = FixedQueue(size);

  queue.t = 0;
  queue.step = function(tstep) {
    this.push([ xt(this.t), yt(this.t) ]);
    this.t += tstep;
  };

  return queue;
};