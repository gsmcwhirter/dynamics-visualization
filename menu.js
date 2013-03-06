var dom = require("dom")
  , event = require("event")
  , action_tmpl = require('./templates/index_actions')
  ;
  
module.exports = {
  ActionMenu: ActionMenu
}

function ActionMenu(bindings){
  this.dom = dom(action_tmpl());
  this.bindings = bindings || {};
  this.setBindings(); 
}

ActionMenu.prototype.setBindings = function (){
  var self = this;
  this.dom.find('a.add-game').each(function (el, i){
    event.bind(el.els[0], 'click', self.bindings.addNewGame || function (){});
  });
};
