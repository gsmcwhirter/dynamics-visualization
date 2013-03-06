module.exports = Canvas;

function Canvas(domcanvas, xpadding, ypadding){
  this.canvas = domcanvas;
  this.context = domcanvas.getContext("2d");
 
  this.xpadding = xpadding || [0,0];
  this.ypadding = ypadding || [0,0];
  
  var box = this.canvas.getBoundingClientRect();
  
  this.full_width = box.width;
  this.width = box.width - this.xpadding[0] - this.xpadding[1];
  
  this.full_height = box.height;
  this.height = box.height - this.ypadding[0] - this.ypadding[1];
  
  this.last_point = null;
};

Canvas.prototype.transformPoint = function (point){
  return {x: this.width * point.x + this.xpadding[0], y: this.height * (1-point.y) + this.ypadding[0]};
};

Canvas.prototype.beginPathFrom = function (start, options){
  var pt = this.transformPoint(start);
  this.context.beginPath();
  this.context.moveTo(pt.x, pt.y);
  this.last_point = pt;
};

Canvas.prototype.drawLineTo = function (topoint, forceStroke){
  var pt = this.transformPoint(topoint);
  this.context.lineTo(pt.x, pt.y);
  if (forceStroke) this.stroke();
  
  this.last_point = pt;
};

Canvas.prototype.drawArrowTo = function (topoint){
  var dtheta = 0.423
    , point = this.transformPoint(topoint)
    ;
  
  //angle between last point and this one
  var dx = this.last_point.x - point.x
    , dy = this.last_point.y - point.y
    , theta = Math.atan2(dy, dx)
    ;
  
  this.drawLineTo(topoint); // takes care of last_point
  this.stroke();
  
  //if (!(dx > 10 || dy > 10)) return;
  this.context.save();
  this.context.fillStyle = this.context.strokeStyle;
  this.context.arc(point.x, point.y, 5, theta - dtheta, theta + dtheta);
  this.context.lineTo(point.x, point.y);
  this.context.closePath();
  this.context.fill();
  this.context.restore();
  this.context.moveTo(point.x, point.y);
  
};

Canvas.prototype.stroke = function (){
  this.context.stroke();
};

Canvas.prototype.drawBoundary = function (){
  this.context.lineWidth = 1;
  this.context.strokeStyle = '#bbbbbb';
  this.context.fillStyle = '#ffffff';
  this.context.clearRect(0,0,this.full_width,this.full_height);
  
  this.context.fillRect(this.xpadding[0],this.ypadding[0],this.width + this.xpadding[0],this.height+this.ypadding[0]);
  this.context.strokeRect(this.xpadding[0],this.ypadding[0],this.width + this.xpadding[0],this.height+this.ypadding[0]);
};

Canvas.prototype.strongClear = function (){
  var newCanvas = document.createElement("canvas");
  newCanvas.width = this.canvas.width;
  newCanvas.height = this.canvas.height;
  newCanvas.className = this.canvas.className;
  this.canvas.parentNode.replaceChild(newCanvas, this.canvas);
  this.canvas = newCanvas;
  this.context = this.canvas.getContext("2d");
  
  var box = this.canvas.getBoundingClientRect();
  
  this.full_width = box.width;
  this.width = box.width - this.xpadding[0] - this.xpadding[1];
  
  this.full_height = box.height;
  this.height = box.height - this.ypadding[0] - this.ypadding[1];
  
  this.last_point = null; 
};
