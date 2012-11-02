var clone = require('clone')
  , templates = {
      help: require("./templates/help")
    , requirements: require("./templates/requirements")
    , walkthrough: require("./templates/walkthrough")
    }
  ;

module.exports = function (tmpl, locals){
  if (!templates[tmpl]){
    return function (){};
  }
  
  return function (ctx, next){
    var mylocals = clone(locals || {});
    mylocals.ctx = mylocals.ctx || ctx;
    document.getElementById("main").innerHTML = templates[tmpl](mylocals);
  };
}
