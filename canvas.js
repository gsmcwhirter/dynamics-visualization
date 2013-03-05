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
 
  console.log(this.width, this.height);
};

Canvas.prototype.beginPathFrom = function (start, options){
  this.context.beginPath();
  this.context.moveTo(this.width * start.x + this.xpadding[0], this.height * start.y + this.ypadding[0]);
};

Canvas.prototype.drawLineTo = function (topoint, forceStroke){
  this.context.lineTo(this.width * topoint.x + this.xpadding[0], this.height * (1-topoint.y) + this.ypadding[0]);
  if (forceStroke) this.stroke();
};

Canvas.prototype.stroke = function (){
  this.context.stroke();
}

Canvas.prototype.drawBoundary = function (){
  this.context.lineWidth = 1;
  this.context.strokeStyle = '#bbbbbb';
  this.context.fillStyle = '#ffffff';
  this.context.clearRect(0,0,this.full_width,this.full_height);
  
  this.context.fillRect(this.xpadding[0],this.ypadding[0],this.width + this.xpadding[0],this.height+this.ypadding[0]);
  this.context.strokeRect(this.xpadding[0],this.ypadding[0],this.width + this.xpadding[0],this.height+this.ypadding[0]);
}

Canvas.prototype.strongClear = function (){
  var newCanvas = document.createElement("canvas");
  newCanvas.width = this.canvas.width;
  newCanvas.height = this.canvas.height;
  newCanvas.className = this.canvas.className;
  this.canvas.parentNode.replaceChild(newCanvas, this.canvas);
  this.canvas = newCanvas;
  this.context = this.canvas.getContext("2d");
  
  var box = domcanvas.getBoundingClientRect();
  
  this.full_width = box.width;
  this.width = box.width - this.xpadding[0] - this.xpadding[1];
  
  this.full_height = box.height;
  this.height = box.height - this.ypadding[0] - this.ypadding[1]; 
}
