var game_types = {
  'hd': "Symmetric, Hawk-Dove"
, 'pd': "Symmetric, Prisoner's Dilemma"
, 'pl': "Symmetric, Prisoner's Delight"
, 'sh': "Symmetric, Stag Hunt"
, 'edge': "Symmetric, Edge Case"
, 'mp': "Asymmetric, Matching Pennies"
, 'bos': "Asymmetric, Battle of the Sexes"
, 'zsum': "Asymmetric, Zero-Sum"
};

var event = require("event")
  , dom = require("dom")
  , each = require("each")
  , storage = require("storage")
  , emitter = require("emitter")
  , indexOf = require("indexof")
  , all = require("all")
  , simplify = require("simplify")
  , dynamics = require("dynamics")
  , Canvas = require("./canvas")
  
  , game_tmpl = require('./templates/game')
  , game_store = storage('games')
  ;
  
module.exports = Game;

function Game(game){
  this.game = game || null;
  
  if (game){
    this.dom = dom(game_tmpl({startindex: 0, game: game}));
    this.setDisplayValues();
    this.setDisplayHeaders();
  }
  else {
    this.dom = dom(game_tmpl());
  }
  
  this._symmetric_set = false;
  this._zerosum_set = false;
  this._autofill_set = false;
  this.setBindings();
}

emitter(Game.prototype);

Game.prototype.toggleInput = function (off, cr){
  var tohide = ['input.entry-input[name=tl-' + cr + ']', 'input.entry-input[name=tr-' + cr + ']', 
                'input.entry-input[name=bl-' + cr + ']', 'input.entry-input[name=br-' + cr + ']']
    , toshow = ['.entry.tl-' + cr, '.entry.tr-' + cr, '.entry.bl-' + cr, '.entry.br-' + cr]
    , self = this
    ;
  
  function hide(tohide){
    each(tohide, function (sel){
      self.dom.find(sel).css('display', 'none');
    });
  }
  
  function show(toshow){
    each(toshow, function (sel){
      self.dom.find(sel).css('display', 'inline');
    });
  }
  
  if (off){
    hide(tohide);
    show(toshow);
  }
  else {
    hide(toshow);
    show(tohide);
  }
};

Game.prototype.toggleColumnInput = function (off){
  this.toggleInput(off, 'c');
};

Game.prototype.toggleRowInput = function (off){
  this.toggleInput(off, 'r');
}

Game.prototype.setSymmetricBindings = function (symmetric){
  var self = this;
  var newels = {
    'tl': 'tl'
  , 'tr': 'bl'
  , 'bl': 'tr'
  , 'br': 'br'
  }
  
  function input_binding(el){
    var newel = newels[el];
    
    return function (){
      var val = parseInt(self.dom.find('input.entry-input[name=' + el + '-r]').els[0].value) || 0;
      self.dom.find('input.entry-input[name=' + newel + '-c]').els[0].value = val;
      self.dom.find('.entry.' + newel + '-c').els[0].innerHTML = val;
    }
  }
    
  if (symmetric && !this._symmetric_set){
    this._symmetric_set = true;
    
    this.toggleColumnInput(true);
    
    each(['tl', 'tr', 'bl', 'br'], function (el){
      var domel = self.dom.find('input.entry-input[name=' + el + '-r]').els[0]; 
      event.bind(domel, 'change', input_binding(el));
      event.bind(domel, 'blur', input_binding(el));
      event.bind(domel, 'keypress', input_binding(el));
      domel.blur()
    });
    
  }
  else if (!symmetric && this._symmetric_set){
    this._symmetric_set = false;
    
    this.toggleColumnInput(false);
    
    each(['tl', 'tr', 'bl', 'br'], function (el){
      var domel = self.dom.find('input.entry-input[name=' + el + '-r]').els[0]; 
      event.unbind(domel, 'change', input_binding(el));
      event.unbind(domel, 'blur', input_binding(el));
      event.unbind(domel, 'keypress', input_binding(el));
    });
  }
};

Game.prototype.setZeroSumBindings = function (zerosum){
  var self = this;

  function input_binding(el){
    return function (){
      var val = parseInt(self.dom.find('input.entry-input[name=' + el + '-r]').els[0].value) || 0;
      self.dom.find('input.entry-input[name=' + el + '-c]').els[0].value = -1 * val;
      self.dom.find('.entry.' + el + '-c').els[0].innerHTML = (-1 * val).toString();
    }
  }

  if (zerosum && !this._zerosum_set){
    this._zerosum_set = true;
    
    this.toggleColumnInput(true);
    
    each(['tl', 'tr', 'bl', 'br'], function (el){
      var domel = self.dom.find('input.entry-input[name=' + el + '-r]').els[0]; 
      event.bind(domel, 'change', input_binding(el));
      event.bind(domel, 'blur', input_binding(el));
      event.bind(domel, 'keypress', input_binding(el));
    });
  }
  else if (!zerosum && this._zerosum_set){
    this._zerosum_set = false;
    
    this.toggleColumnInput(false);
    
    each(['tl', 'tr', 'bl', 'br'], function (el){
      var domel = self.dom.find('input.entry-input[name=' + el + '-r]').els[0]; 
      event.unbind(domel, 'change', input_binding(el));
      event.unbind(domel, 'blur', input_binding(el));
      event.unbind(domel, 'keypress', input_binding(el));
    });
  }
};

Game.prototype.setAutofillBindings = function (autofill){
  if (autofill){
    this._autofill_set = true;
    
    this.toggleRowInput(true);
    this.toggleColumnInput(true);
    
    var aftype = this.dom.find('select[name=presets]').els[0].value;
    var newgame = false;
    
    //['sh', 'pd', 'hd', 'pl', 'mp', 'bos']
    switch (aftype){
      case 'sh':
        newgame = {
          'tl-r': 4
        , 'tl-c': 4
        , 'tr-r': 0
        , 'tr-c': 3
        , 'bl-r': 3
        , 'bl-c': 0
        , 'br-r': 2
        , 'br-c': 2
        };
        break;
      case 'pd':
        newgame = {
          'tl-r': 3
        , 'tl-c': 3
        , 'tr-r': 0
        , 'tr-c': 4
        , 'bl-r': 4
        , 'bl-c': 0
        , 'br-r': 1
        , 'br-c': 1
        };
        break;
      case 'hd':
        newgame = {
          'tl-r': 3
        , 'tl-c': 3
        , 'tr-r': 2
        , 'tr-c': 4
        , 'bl-r': 4
        , 'bl-c': 2
        , 'br-r': 0
        , 'br-c': 0
        };
        break;
      case 'pl':
        newgame = {
          'tl-r': 4
        , 'tl-c': 4
        , 'tr-r': 1
        , 'tr-c': 3
        , 'bl-r': 3
        , 'bl-c': 1
        , 'br-r': 0
        , 'br-c': 0
        };
        break;
      case 'mp':
        newgame = {
          'tl-r': 1
        , 'tl-c': -1
        , 'tr-r': -1
        , 'tr-c': 1
        , 'bl-r': -1
        , 'bl-c': 1
        , 'br-r': 1
        , 'br-c': -1
        };
        break;
      case 'bos':
        newgame = {
          'tl-r': 3
        , 'tl-c': 2
        , 'tr-r': 0
        , 'tr-c': 0
        , 'bl-r': 0
        , 'bl-c': 0
        , 'br-r': 2
        , 'br-c': 3
        };
        break; 
    }
    
    this.setInputValues(newgame);
    this.setDisplayValues(newgame);
  }
  else if (!autofill && this._autofill_set){
    this._autofill_set = false;
    
    this.toggleRowInput(false);
    this.toggleColumnInput(false);
  }
}

Game.prototype.changeBindings = function (){
  var self = this
    , sbox = this.dom.find('select[name=presets]').els[0]
    , sboxval = sbox.options[sbox.selectedIndex].value
    , symbind = (sboxval === 's')
    , zsumbind = (sboxval === 'zsum')
    , autobind = (indexOf(['sh', 'pd', 'hd', 'pl', 'mp', 'bos'], sboxval) !== -1)
    , bindings = [symbind, zsumbind, autobind]
    ;

  each(bindings, function (tf, ind){
    if (!tf){
      switch (ind){
        case 0:
          self.setSymmetricBindings(tf);
          break;
        case 1:
          self.setZeroSumBindings(tf);
          break;
        case 2:
          self.setAutofillBindings(tf);
          break;
      }
    }
  });
  
  each(bindings, function (tf, ind){
    if (tf){
      switch (ind){
        case 0:
          self.setSymmetricBindings(tf);
          break;
        case 1:
          self.setZeroSumBindings(tf);
          break;
        case 2:
          self.setAutofillBindings(tf);
          break;
      }
    }
  });
}

Game.prototype.setBindings = function (){
  var self = this;
  
  this.setSymmetricBindings(false);
  this.setZeroSumBindings(false);
  this.setAutofillBindings(false);
  
  event.bind(this.dom.find('a.save-button').els[0], 'click', function (){ self.stopEditing(); });
  
  event.bind(this.dom.find('a.process-button').els[0], 'click', function (){ console.log("Generating graphs..."); self.generateGraphs(); });
  
  event.bind(this.dom.find('a.edit-button').els[0], 'click', function (){ self.startEditing(); });
  
  event.bind(this.dom.find('a.delete-game').els[0], 'click', function (){
    document.getElementById('main').removeChild(self.dom.els[0]);
    
    self.game = null;
    self.emit('change');
  }); 
  
  var selectbox = this.dom.find('select[name=presets]').els[0];
  event.bind(selectbox, 'change', function (){ self.changeBindings(); });
  event.bind(selectbox, 'blur', function (){ self.changeBindings(); });  
};

Game.prototype.startEditing = function (){
  this.dom.find("input[name=label]").els[0].value = this.game.label || "";
  this.setInputValues();
  
  this.dom.first().addClass('editing');  
  this.dom.find(".canvas-container").els[0].style.display = 'none';
};

Game.prototype.stopEditing = function (){
  this.game = this.game || {};
  
  this.game.label = this.dom.find("input[name=label]").els[0].value || "";
  this.game['tl-r'] = parseInt(this.dom.find("input.entry-input[name=tl-r]").els[0].value || 0);
  this.game['tl-c'] = parseInt(this.dom.find("input.entry-input[name=tl-c]").els[0].value || 0);
  this.game['tr-r'] = parseInt(this.dom.find("input.entry-input[name=tr-r]").els[0].value || 0);
  this.game['tr-c'] = parseInt(this.dom.find("input.entry-input[name=tr-c]").els[0].value || 0);
  this.game['bl-r'] = parseInt(this.dom.find("input.entry-input[name=bl-r]").els[0].value || 0);
  this.game['bl-c'] = parseInt(this.dom.find("input.entry-input[name=bl-c]").els[0].value || 0);
  this.game['br-r'] = parseInt(this.dom.find("input.entry-input[name=br-r]").els[0].value || 0);
  this.game['br-c'] = parseInt(this.dom.find("input.entry-input[name=br-c]").els[0].value || 0);
  
  this.setDisplayValues();
  this.setDisplayHeaders();
  
  this.dom.first().removeClass('editing');
  this.emit('change');
};

Game.prototype.setDisplayValues = function (game){
  game = game || this.game;

  this.dom.find(".entry.tl-r").els[0].innerHTML = game['tl-r'] || 0;
  this.dom.find(".entry.tl-c").els[0].innerHTML = game['tl-c'] || 0;
  this.dom.find(".entry.tr-r").els[0].innerHTML = game['tr-r'] || 0;
  this.dom.find(".entry.tr-c").els[0].innerHTML = game['tr-c'] || 0;
  this.dom.find(".entry.bl-r").els[0].innerHTML = game['bl-r'] || 0;
  this.dom.find(".entry.bl-c").els[0].innerHTML = game['bl-c'] || 0;
  this.dom.find(".entry.br-r").els[0].innerHTML = game['br-r'] || 0;
  this.dom.find(".entry.br-c").els[0].innerHTML = game['br-c'] || 0; 
};

Game.prototype.setDisplayHeaders = function (){
  this.dom.find("h1.label").els[0].innerHTML = this.game.label || "";
  if (typeof this.game === "object"){
    this.dom.find("h2.game-type").els[0].innerHTML = this.getGameType();
  }
};

Game.prototype.setInputValues = function (game){
  game = game || this.game || {};
  
  this.dom.find("input.entry-input[name=tl-r]").els[0].value = game['tl-r'] || 0;
  this.dom.find("input.entry-input[name=tl-c]").els[0].value = game['tl-c'] || 0;
  this.dom.find("input.entry-input[name=tr-r]").els[0].value = game['tr-r'] || 0;
  this.dom.find("input.entry-input[name=tr-c]").els[0].value = game['tr-c'] || 0;
  this.dom.find("input.entry-input[name=bl-r]").els[0].value = game['bl-r'] || 0;
  this.dom.find("input.entry-input[name=bl-c]").els[0].value = game['bl-c'] || 0;
  this.dom.find("input.entry-input[name=br-r]").els[0].value = game['br-r'] || 0;
  this.dom.find("input.entry-input[name=br-c]").els[0].value = game['br-c'] || 0;
};

Game.prototype.generateCanvases = function (){
  if (this.canvases) return;
  
  this.canvases = {};
  var self = this;
  
  each(this.dom.find(".canvas-container canvas").els, function (canvas){
    if (!canvas) return;
    var key = canvas.className;
    self.canvases[key] = new Canvas(canvas, [1, 19], [1, 19]);
    self.canvases[key].drawBoundary();
  });
};

Game.prototype.generateGraphs = function (){
  console.log("Un-hiding canvas container");
  this.dom.find(".canvas-container").els[0].style.display = 'block';
  
  if (!this.canvases) this.generateCanvases();
  else {
    for (var key in (this.canvases || {})){
      this.canvases[key].strongClear();
      this.canvases[key].drawBoundary();
    }
  }

  /*each(this.dom.find(".canvas-container canvas").els, function (canvas){
    var newCanvas = document.createElement("canvas");
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    newCanvas.className = canvas.className;
    canvas.parentNode.replaceChild(newCanvas, canvas);
    
    var context = newCanvas.getContext("2d");
    var box = newCanvas.getBoundingClientRect();
    var width = box.width;
    var height = box.height;
    
    context.lineWidth = 1;
    context.strokeStyle = '#bbbbbb';
    context.fillStyle = '#ffffff';
    context.clearRect(0,0,width,height);
    
    context.fillRect(1,1,width-19,height-19);
    context.strokeRect(1,1,width-19,height-19);
  });*/
  
  var self = this;
  
  setTimeout(function (){
    self.generateBRPaths();
  }, 0);
  
  setTimeout(function (){
    //self.generateDtRPaths();
  }, 0);
  
  setTimeout(function (){
    //self.generateCtRPaths();
  }, 0);
  
  //TODO: implement other graphs
};

Game.prototype.generateCtRPaths = function (){
  var canvas = this.dom.find(".canvas-container canvas.br").els[0];
  if (!canvas) return;
  
  var box = canvas.getBoundingClientRect();
  var context = canvas.getContext("2d");
  var imgwidth = box.width - 20;
  var imgheight = box.height - 20;
  
  var emitters = [];
  
  var grid = 8;
  var startpts = [];
  for (var xpt = 1; xpt < grid; xpt++){
    for (var ypt = 1; ypt < grid; ypt++){
      startpts.push({x: xpt / grid, y: ypt / grid});
    }
  }
  
  console.log(startpts);
  
  var colors = ['green', 'yellow'];
  var colorind = 1;
  
  function nextColor(){
    colorind = 1 - colorind;
    return colors[colorind];
  }
  
  var segment_length = 250;
  var self = this;
  
  function next(){
    var start = startpts.shift();
    if (!start){
      console.log("Done drawing all paths.");
      return;
    }
    
    console.log("Starting drawing CtR path from (%s, %s)...", start.x, start.y);
    var emitter = new dynamics.ContinuousReplicatorPath(self.game, start, {timestep: 0.005, duration: 10, debug: false});
      
    context.beginPath();
    context.moveTo(imgwidth * start.x + 1, imgheight * start.y + 1);
    context.lineWidth = 1;
    context.strokeStyle = nextColor();
    
    var path_segments = [[]];
    
    emitter.on("point", function (point){
      if (path_segments[path_segments.length - 1].length >= segment_length){
        draw_segment(path_segments[path_segments.length - 1]);
        path_segments.push([]);
      }
      
      path_segments[path_segments.length - 1].push(point);
    });
    
    emitter.on("done", function (){
      console.log("Done drawing path.");
      draw_segment(path_segments[path_segments.length - 1]);
      setTimeout(next, 0);
    });
    
    emitter.generate(); 
  }
  
  function draw_segment(segment){
    var simple_segment = simplify(segment, 0.0001);
    
    each(simple_segment, function (node){
      context.lineTo(imgwidth * node.x + 1, imgheight * node.y + 1);
    });
    
    context.stroke();
  }
  
  next();
};

Game.prototype.generateDtRPaths = function (){
  var canvas = this.dom.find(".canvas-container canvas.tr").els[0];
  if (!canvas) return;
  
  var box = canvas.getBoundingClientRect();
  var context = canvas.getContext("2d");
  var imgwidth = box.width - 20;
  var imgheight = box.height - 20;
  
  var emitters = [];
  
  var grid = 8;
  var startpts = [];
  for (var xpt = 1; xpt < grid; xpt++){
    for (var ypt = 1; ypt < grid; ypt++){
      startpts.push({x: xpt / grid, y: ypt / grid});
    }
  }
  
  console.log(startpts);
  
  var colors = ['green', 'yellow'];
  var colorind = 1;
  
  function nextColor(){
    colorind = 1 - colorind;
    return colors[colorind];
  }
  
  var segment_length = 5;
  var self = this;
  
  function next(){
    var start = startpts.shift();
    if (!start){
      console.log("Done drawing all paths.");
      return;
    }
    
    console.log("Starting drawing DtR path from (%s, %s)...", start.x, start.y);
    var emitter = new dynamics.DiscreteReplicatorPath(self.game, start, {debug: false});
      
    context.beginPath();
    context.moveTo(imgwidth * start.x + 1, imgheight * start.y + 1);
    context.lineWidth = 1;
    context.strokeStyle = nextColor();
    
    var path_segments = [[]];
    
    emitter.on("point", function (point){
      if (path_segments[path_segments.length - 1].length >= segment_length){
        draw_segment(path_segments[path_segments.length - 1]);
        path_segments.push([]);
      }
      
      path_segments[path_segments.length - 1].push(point);
    });
    
    emitter.on("done", function (){
      console.log("Done drawing path.");
      draw_segment(path_segments[path_segments.length - 1]);
      setTimeout(next, 0);
    });
    
    emitter.generate(); 
  }
  
  function draw_segment(segment){
    //TODO: arrows instead of just lines
    each(segment, function (node){
      if (!node) return;
      context.lineTo(imgwidth * node.x + 1, imgheight * node.y + 1);
    });
    
    context.stroke();
  }
  
  next();
};

Game.prototype.generateBRPaths = function (){
  this.generateCanvases();
  var canvas = this.canvases['tl'];
  if (!canvas) return;
  
  var grid = 8;
  var startpts = [];
  for (var xpt = 1; xpt < grid; xpt++){
    for (var ypt = 1; ypt < grid; ypt++){
      startpts.push({x: xpt / grid, y: ypt / grid});
    }
  }
  
  var colors = ['green', 'yellow'];
  var colorind = 1;
  
  function nextColor(){
    colorind = 1 - colorind;
    return colors[colorind];
  }
  
  var self = this;
  
  function next(){
    var start = startpts.shift();
    if (!start){
      console.log("Done drawing all paths.");
      console.log("Drawing BR curves for each player...");
      var br_curves = dynamics.BestResponseCurves(self.game, {debug: true});
      br_curves.forEach(function (curve_pts, player){
        start = curve_pts.shift();
        
        if (!start) return;
        canvas.beginPathFrom(start);
        canvas.context.lineWidth = 1;
        canvas.context.strokeStyle = ['red', 'blue'][(player || 0) % 2];
        curve_pts.forEach(function (node){
          canvas.drawLineTo(node);
        });
        canvas.stroke();
      });
      
      return;
    }
    
    console.log("Starting drawing BR path from (%s, %s)...", start.x, start.y);
    var emitter = new dynamics.BestResponsePath(self.game, start, {debug: true});
      
    canvas.beginPathFrom(start);
    canvas.context.lineWidth = 1;
    canvas.context.strokeStyle = nextColor();
    
    emitter.on("point", function (point){
      draw_segment([point]);
    });
    
    emitter.on("done", function (){
      console.log("Done drawing path.");
      setTimeout(next, 0);
    });
    
    emitter.generate(); 
  }
  
  function draw_segment(segment){
    //TODO: Arrows instead of just lines
    each(segment, function (node){
      if (!node) return;
      canvas.drawLineTo(node);
    });
    
    canvas.stroke();
  }
  
  next();
};

/**
 * Determines if the game is symmetric or not
 */
Game.prototype.isSymmetric = function (){
  console.log("here");
  console.log(this.game);
  return  (this.game['tl-r'] || 0) == (this.game['tl-c'] || 0) &&
          (this.game['tr-r'] || 0) == (this.game['bl-c'] || 0) &&
          (this.game['bl-r'] || 0) == (this.game['tr-c'] || 0) &&
          (this.game['br-r'] || 0) == (this.game['br-c'] || 0);
};

/**
 * Classifies the game
 *
 */
Game.prototype.identify = function (){
  if (!this.isSymmetric()){
    return this.isBattleOfTheSexes() || this.isMatchingPennies() || this.isZeroSum() || false;
  }
  
  var a = (this.game['tl-r'] || 0) - (this.game['bl-r'] || 0);
  var b = (this.game['br-r'] || 0) - (this.game['tr-r'] || 0);

  if (a > 0 && b > 0) {
      return 'sh';
  }
  else if (a > 0 && b < 0) {
      return 'pl';
  }
  else if (a < 0 && b > 0) {
      return 'pd';
  }
  else if (a < 0 && b < 0) {
      return 'hd';
  }
  else {
      return 'edge';
  }
};

/**
 * Normalizes game payoffs for type checking
 *
 */
Game.prototype.normalizedPayoffs = function (){
  if (this.game === null) return null;
  
  var normal_game = {};
  var keys = ['tl-r', 'tl-c', 'tr-r', 'tr-c', 'bl-r', 'bl-c', 'br-r', 'br-c'];  
  
  var mult_factor;
  var pre_add_factor;
  var max;
  
  //Normalize to the top-left corner, making the greater payoff 1 and the lesser -1, if possible. If they are equal they are both made 1  
  pre_add_factor = ((this.game['tl-r'] || 0) + (this.game['tl-c'] || 0)) / 2.0 * -1;
  
  if ((this.game['tl-r'] || 0) > (this.game['tl-c'] || 0)){
    max = this.game['tl-r'] || 0;
  } 
  else {
    max = this.game['tl-c'] || 0;
  }
  
  if (max == 0 && pre_add_factor == 0){
    pre_add_factor = 1;    
  }
  
  if (max + pre_add_factor != 0){
    mult_factor = 1.0 / (max + pre_add_factor);
  }
  else {
    mult_factor = 1;
  }
  
  var self = this;
  keys.forEach(function (key){
    normal_game[key] = ((self.game[key] || 0) + pre_add_factor) * mult_factor;
  });
  
  return normal_game;
};

/**
 * Determines if the game is a Battle of the Sexes
 *
 */
Game.prototype.isBattleOfTheSexes = function (){
  /*var min = Math.min(this.game['tl-r'], this.game['tl-c'], this.game['tr-r'], this.game['tl-c'],
          this.game['bl-r'], this.game['bl-c'], this.game['br-r'], this.game['br-c']);

  var game2 = {};

  game2['tl-r'] = this.game['tl-r'] - min;
  game2['tr-r'] = this.game['tr-r'] - min;
  game2['bl-r'] = this.game['bl-r'] - min;
  game2['br-r'] = this.game['br-r'] - min;
  game2['tl-c'] = this.game['tl-c'] - min;
  game2['tr-c'] = this.game['tr-c'] - min;
  game2['bl-c'] = this.game['bl-c'] - min;
  game2['br-c'] = this.game['br-c'] - min;

  if (Math.min(game2['tr-r'], game2['tr-c'], game2['bl-r'], game2['bl-c']) == 0 &&
      Math.max(game2['tr-r'], game2['tr-c'], game2['bl-r'], game2['bl-c']) == 0 &&
      (game2['tl-r'] - game2['tl-c']) * (game2['br-r'] - game2['br-c']) < 0){
          return 'bos';
  }

  if (Math.min(game2['tl-r'], game2['tl-c'], game2['br-r'], game2['br-c']) == 0 &&
      Math.max(game2['tl-r'], game2['tl-c'], game2['br-r'], game2['br-c']) == 0 &&
      (game2['tr-r'] - game2['tr-c']) * (game2['bl-r'] - game2['bl-c']) < 0){
          return 'bos';
  }*/
  
  var normal_game = this.normalizedPayoffs();
  
  if (normal_game['tl-r'] == normal_game['br-c'] && normal_game['tl-c'] == normal_game['br-r'] && 
      all(['bl-r', 'bl-c', 'tr-r', 'tr-c'], function (key){
        return this[key] < -1 && this[key] == this['bl-r'];
      }, normal_game)){
        return 'bos';  
  }

  return false;
};

/**
 * Determines if the game is a Matching Pennies
 *
 */
Game.prototype.isMatchingPennies = function (){
  var normal_game = this.normalizedPayoffs();

  return  this.isZeroSum() &&
          (normal_game['tl-r'] + normal_game['tr-r'] == 0) &&
          (normal_game['tl-r'] + normal_game['bl-r'] == 0) &&
          (normal_game['bl-r'] + normal_game['br-r'] == 0) ? 'mp' : false;
};

/**
 * Determines if the game is zero-sum
 *
 */
Game.prototype.isZeroSum = function (){
  var normal_game = this.normalizedPayoffs();

  return  (normal_game['tl-r'] + normal_game['tl-c'] == 0) &&
          (normal_game['tr-r'] + normal_game['tr-c'] == 0) &&
          (normal_game['bl-r'] + normal_game['bl-c'] == 0) &&
          (normal_game['br-r'] + normal_game['br-c'] == 0) ? 'zsum' : false;
};

/**
 * Get the name of the type of the game
 *
 */
Game.prototype.getGameType = function (){
  return game_types[this.identify()] || "Asymmetric";
};
