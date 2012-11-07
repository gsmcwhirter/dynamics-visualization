var page = require("page")
  , dom = require("dom")
  , event = require("event")
  , each = require("each")
  , map = require("map")
  , select = require("select")
  , bsnav = require("booting-sub-nav")
  , storage = require('storage')
  , staticpage = require('./static')
  , game = require('./game')
  , game_tmpl = require('./templates/game')
  , action_tmpl = require('./templates/index_actions')
  
  , game_store = storage('games')
  , game_list = game_store.get('game_list') || []
  , correspondence_map = []
  ;

each(game_list, function (game, index){
  correspondence_map.push(index);
});

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
    ;
    
  main.innerHTML = '';
  
  if (game_list.length){
    each(game_list, function (game, index){
      prepend(main, setGameBindings(game_tmpl({startindex: index, game: game}), index).first().els[0]);
    });
  }
  else {
    addNewGame();
  }
  
  prepend(main, setActionBindings(action_tmpl()).first().els[0]);
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

function setGameBindings(game_html, cmap_index){
  game_html = dom(game_html);
  cmap_index = cmap_index || 0;
  
  var game_root_el = game_html.first().els[0];
  
  game_html.find('a.save-button').each(function (el, i){
    event.bind(el.els[0], 'click', function (){
      game_html.first().removeClass('editing');
      
      var game_index = correspondence_map[cmap_index];
      game = game_list[game_index] || {};
      
      //TODO: set game data
      
      game_list[game_index] = game;
      saveGameList();
    });
  });
  
  game_html.find('a.process-button').each(function (el, i){
    event.bind(el.els[0], 'click', function (){
      //TODO
    });
  });
  
  game_html.find('a.edit-button').each(function (el, i){
    event.bind(el.els[0], 'click', function (){
      game_html.first().addClass('editing');
    });
  });
  
  game_html.find('a.delete-game').each(function (el, i){
    event.bind(el.els[0], 'click', function (){
      var game_index = correspondence_map[cmap_index];
      
      game_list = game_list.slice(0, game_index || 0).concat(game_list.slice(game_index + 1));
      
      correspondence_map = map(correspondence_map, function (item){
        if (item !== null && item > game_index){
          return item - 1;
        }
        else {
          return item;
        }
      });
      correspondence_map[cmap_index] = null;
      
      document.getElementById('main').removeChild(game_root_el);
      
      saveGameList();
      
      if (game_list.length === 0){
        addNewGame();
      }
    });
  });
  
  //TODO: input binding 
  
  return game_html;
}

function setActionBindings(menu_html){
  menu_html = dom(menu_html);
  
  menu_html.find('a.add-game').each(function (el, i){
    event.bind(el.els[0], 'click', addNewGame);
  });
  
  
  return menu_html;
}

function addNewGame(ev){
  if (ev){
    ev.preventDefault();
  }
  
  var main = document.getElementById('main')
    , new_cmap_ind = correspondence_map.length
    , new_games_index = game_list.length 
    , new_domel = setGameBindings(game_tmpl(), new_cmap_ind).first().addClass('editing').els[0]
    ;
  
  correspondence_map.push(new_games_index);
  game_list.push(null);
    
  if (main.childNodes.length > 1){
    main.insertBefore(new_domel, main.childNodes[1])
  }
  else {
    append(main, new_domel);
  }
}

function saveGameList(){
  game_store.set('game_list', select(game_list, function (game){ return game !== null; }));
}
