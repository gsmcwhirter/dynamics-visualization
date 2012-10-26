//Workarounds for test errors on global leaking
window._gat = window._gat || undefined;
window._GOOG_TRANS_EXT_VER = window._GOOG_TRANS_EXT_VER || undefined;

//Actual application
window.App = Ember.Application.create({
  rootElement: "#everything"
});

App.Router = Ember.Router.extend({
    location: 'hash'
  , root: Ember.Route.extend({
    setupControllers: function (router){
      var applicationController = router.get("applicationController")
        , rootView
        ;
        
      rootView = Ember.ContainerView.create({
          controller: applicationController
        , currentViewBinding: 'controller.view'
      });
      
      rootView.appendTo('div[role=main]');
    }
    , index: Ember.Route.extend({
          route: '/'
        , redirectsTo: 'games.index'
    })
    , games: Ember.Route.extend({
          route: '/games'
        , setupControllers: function (router){
          var gamesController = router.get("gamesController");
          //TODO: implement
          gamesController.set('content', []);
        }
        , index: Ember.Route.extend({
            route: '/'
          , setupControllers: function (router){
            var gamesController = router.get("gamesController")
              , appController = router.get("applicationController")
              ;
              
            appController.set('view', App.GameIndexView.create({
              controller: gamesController
            }));
          }
        })
    })
    , help: Ember.Route.extend({
          route: '/help'
        , index: Ember.Route.extend({
              route: '/'
            , setupControllers: function (router){
              var helpController = router.get("helpController")
                , appController = router.get("applicationController")
                ;
                
              appController.set('view', App.HelpIndexView.create({
                controller: helpController
              }));
            }
        })
        , show: Ember.Route.extend({
              route: '/:step'
            , modelType: 'App.WalkthroughStep'
            , setupControllers: function (router, step){
              var helpController = router.get("helpStepController")
                , appController = router.get("applicationController")
                ;
                
              helpController.set('content', step);
              
              appController.set('view', App.HelpView.create({
                controller: helpController
              }));
            }
        })
    })
  })
}); 

App.LocalStorageAdapter = DS.Adapter.extend({
    find: function (store, type, id){
      var records = this.local.get(type);
      store.load(type, records[id]);
  }
  , findMany: function (store, type, ids){
      var records = this.local.get(type);
      store.loadMany(type, _(records).pick(ids));  
  }
  , findAll: function (store, type){
      var records = this.local.get(type);
      store.loadMany(type, records);
  }
  , findQuery: function (store, type, query, modelArray){
    //TODO: implement?
  }
  //, findAll: function (store, type){}
  , createRecord: function (store, type, model){
      var records = this.local.get(type);
      var id = records.length + 1;
      model.set('id', id);
      
      var data = get(model, 'data');
      records[id] = data;
      
      local.set(type, records);
      store.didCreateRecord(model, data);
  }
  , createRecords: function (store, type, array){
      var records = this.local.get(type)
        , lastid = records.length
        ;
      
      for(var i = 0; i < array.length; i++){
        array[i].set('id', lastid + 1);
        records[lastid + 1] = get(array[i], 'data');
        lastid++;
      }
      
      local.set(type, records);
      store.didCreateRecords(type, array, array.mapProperty('data'));
      
  }
  , updateRecord: function (store, type, model){
      var id = get(model, 'id')
        , data = get(model, 'data')
        , records = this.local.get(type)
        ;
        
      if (records[id]){
        records[id] = data;
        this.local.set(type, records);
        store.didUpdateRecord(model, data);
      }
  }
  , updateRecords: function (store, type, array){
      var records = this.local.get(type);
      
      for (var i = 0; i < array.length; i++){
        var id = get(array[i], 'id')
          , data = get(array[i], 'data')
          ;
          
        if (records[id]){
          records[id] = data;
        }
      }
      
      this.local.set(type, records);
      store.didUpdateRecords(array);
  }
  , deleteRecord: function (store, type, model){
    var records = this.local.get(type);
    var id = mode.get('id');
    
    if (records.length >= id){
      records[id] = null;
    }
    
    store.didDeleteRecord(model);
  }
  , deleteRecords: function (store, type, array){
    var records = this.local.get(type)
      , ids = array.mapProperty('id')
      ;
      
    for(var i = 0; i < ids.length; i++){
      if (records.length >= ids[i]){
        records[ids[i]] = null;
      }
    }
    
    store.didDeleteRecords(array);
    
  }
  
  , local: {
      get: function (key){
        var value = localStorage.getItem(key);
        value = JSON.parse(value) || [];
        return value;
    }
    , set: function (key, value){
        localStorage.setItem(key, JSON.stringify(value));
    }
  }
});

App.StaticStorageAdapter = DS.Adapter.extend({
    find: function (store, type, id){
      
  }
  , findMany: function (store, type, ids){
    
  }
  , findQuery: function (store, type, query, modelArray){
    
  }
  //, findAll: function (store, type){}
  , createRecord: function (store, type, model){
    //fail
    return false; 
  }
  , createRecords: function (store, type, array){
    //fail
    return false;
  }
  , updateRecord: function (store, type, model){
    //fail
    return false;
  }
  , updateRecords: function (store, type, array){
    //fail
    return false;
  }
  , deleteRecord: function (store, type, model){
    //fail
    return false;
  }
  , deleteRecords: function (store, type, array){
    //fail
    return false;
  }
  
  , staticData: {}
});

App.gameStore = DS.Store.create({
    revision: 4
  , adapter: App.LocalStorageAdapter.create()
});

App.helpStore = DS.Store.create({
    revision: 4
  , adapter: App.StaticStorageAdapter.create()
});


App.Game = DS.Model.extend({});

App.HelpStep = DS.Model.extend({});

App.ApplicationController = Ember.Controller.extend({
    view: null 
});

App.GamesController = Ember.ArrayController.extend({});

App.GameController = Ember.Controller.extend({
    view: null
});

App.HelpController = Ember.Controller.extend({});

App.HelpStepController = Ember.Controller.extend({});

App.GameIndexView = Ember.View.extend({
  templateName: 'game_index'
});

App.GameView = Ember.ContainerView.extend({
    controller: App.GameController.create()
  , currentViewBinding: 'controller.view'
});

App.GameDisplayView = Ember.View.extend({
  templateName: 'game_display'
});

App.GameEditView = Ember.View.extend({
  templateName: 'game_edit'
});

App.HelpIndexView = Ember.View.extend({
  templateName: 'help_index'
});

App.HelpView = Ember.View.extend({
  templateName: 'help_display'
});

App.router = App.Router.create();

App.initialize(App.router);
