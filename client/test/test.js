describe('App', function (){
  it('should exist', function (){
    expect(App).not.to.be(undefined);
  });
  
  it('should be an Ember app', function (){
    expect(App).to.be.an(Ember.Application);
  });
  
  it('should have a root element of #everything', function (){
    expect(App.rootElement).to.be("#everything");
  });
  
  describe("#Router", function (){
    it('should exist', function (){
      expect(App.Router).to.not.be(undefined);
    });
  });
  
  describe("#Game", function (){
    it('should exist', function (){
      expect(App.Game).to.not.be(undefined);
    });
  });
  
  describe("#HelpStep", function (){
    it('should exist', function (){
      expect(App.HelpStep).to.not.be(undefined);
    });
  });
  
  describe("#ApplicationController", function (){
    it('should exist', function (){
      expect(App.ApplicationController).to.not.be(undefined);
    });
  });
  
  describe("#GamesController", function (){
    it('should exist', function (){
      expect(App.GamesController).to.not.be(undefined);
    });
  });
  
  describe("#HelpController", function (){
    it('should exist', function (){
      expect(App.HelpController).to.not.be(undefined);
    });
  });
  
  describe("#HelpStepController", function (){
    it('should exist', function (){
      expect(App.HelpStepController).to.not.be(undefined);
    });
  });
  
  describe("#GameIndexView", function (){
    it('should exist', function (){
      expect(App.GameIndexView).to.not.be(undefined);
    });
  });
  
  describe("#GameView", function (){
    it('should exist', function (){
      expect(App.GameView).to.not.be(undefined);
    });
  });
  
  describe("#HelpIndexView", function (){
    it('should exist', function (){
      expect(App.HelpIndexView).to.not.be(undefined);
    });
  });
  
  describe("#HelpView", function (){
    it('should exist', function (){
      expect(App.HelpView).to.not.be(undefined);
    });
  });
  
  describe("#router", function (){
    it('should exist', function (){
      expect(App.router).to.not.be(undefined);
      expect(App.router).to.be.an(Ember.Router);
      expect(App.router).to.be.an(App.Router);
    });
  });
});
