var page = require("page")
  , classes = require("classes")
  , bsnav = require("booting-sub-nav")
  , staticpage = require('./static')
  , storage = require('storage')
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
    ;
    
  main.innerHTML = '';
}

function showLegend(ctx, next){
  document.getElementById('legend').style.display = '';
  next();
}

function hideLegend(ctx, next){
  document.getElementById('legend').style.display = 'none';
  next();
}
