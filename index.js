var page = require("page")
  , each = require("each")
  , map = require("map")
  , select = require("select")
  , bsnav = require("booting-sub-nav")
  , storage = require('storage')
  
  , staticpage = require('./static')
  , Game = require('./game')
  , menus = require('./menu')
  
  , game_store = storage('games')
  , game_handles = []
  ;

module.exports = {
  run: setup
}
  
function setup(){
  /* Routing */
  
  bsnav(document.getElementById('legend'), 10);

  page('/', showLegend, index);
  page('/help', hideLegend, staticpage('help'));
  page('/help/requirements', hideLegend, staticpage('requirements'));
  page('/help/walkthrough/:step?', hideLegend, staticpage('walkthrough'));
  page();
}

function index(ctx, next){
  var main = document.getElementById('main')
    , game_list = game_store.get('game_list') || []
    ;
    
  main.innerHTML = '';
  game_handles = [];
  
  if (game_list.length){
    each(game_list, function (game, index){
      var g = new Game(game);
      g.on('change', saveGameList);
      prepend(main, g.dom.first().els[0]);
      game_handles.push(g);
    });
  }
  else {
    addNewGame();
  }
  
  var action_menu = new menus.ActionMenu({addNewGame: addNewGame});
  prepend(main, action_menu.dom.first().els[0]);
}

function showLegend(ctx, next){
  document.getElementById('legend').style.display = '';
  next();
}

function hideLegend(ctx, next){
  document.getElementById('legend').style.display = 'none';
  next();
}

function prepend(target, content){
  if (target.childNodes.length){
    target.insertBefore(content, target.firstChild);
  }
  else {
    append(target, content);
  }
}

function append(target, content){
  target.appendChild(content);  
}

function addNewGame(ev){
  if (ev){
    ev.preventDefault();
  }
  
  var main = document.getElementById('main')
    ;
  
  var g = new Game();
  g.dom.first().addClass('editing');
  g.on('change', saveGameList);
  game_handles.push(g);
    
  if (main.childNodes.length > 1){
    main.insertBefore(g.dom.first().els[0], main.childNodes[1])
  }
  else {
    append(main, g.dom.first().els[0]);
  }
}

function saveGameList(){
  var game_list = select(map(game_handles, function (game){ return game.game; }), function (game){ return game !== null; })
  game_store.set('game_list', game_list);
  if (game_list.length === 0){
    addNewGame();
  }
}
