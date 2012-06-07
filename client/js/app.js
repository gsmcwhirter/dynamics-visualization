
window.App = Ember.Application.create({
  rootElement: "#everything"
});

App.Router = Ember.Router.extend({
  root: Ember.State.extend({
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
    , index: Ember.State.extend({
          route: '/'
        , redirectsTo: 'games.index'
    })
    , games: Ember.State.extend({
          route: '/games'
        , setupControllers: function (router){
          var gamesController = router.get("gamesController");
          //TODO: implement
          gamesController.set('content', []);
        }
        , index: Ember.State.extend({
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
    , help: Ember.State.extend({
          route: '/help'
        , index: Ember.State.extend({
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
        , show: Ember.State.extend({
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

App.Game = DS.Model.extend({});
App.HelpStep = DS.Model.extend({});

App.ApplicationController = Ember.Controller.extend({
    view: null 
});
App.GamesController = Ember.ArrayController.extend({});
App.HelpController = Ember.Controller.extend({});
App.HelpStepController = Ember.Controller.extend({});

App.GameIndexView = Ember.View.extend({});
App.GameView = Ember.View.extend({});
App.HelpIndexView = Ember.View.extend({});
App.HelpView = Ember.View.extend({});

App.router = App.Router.create();
App.initialize(App.router);
