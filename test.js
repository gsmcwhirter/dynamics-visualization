module.exports = function (){
  describe("dynvis", function (){
    it('should exist on window', function (){
      expect(window.dynvis).to.not.be(undefined);
      expect(dynvis).to.not.be(undefined);
    });
    
    it('should be an object', function (){
      expect(window.dynvis).to.be.a('object');
    });
    
    describe("#run()", function (){
      it('should be a function', function (){
        expect(dynvis.run).to.be.a('function');
      });
    });
  });
  
  describe("static", function (){
    var stat = require("./static");
    
    it('should exist', function (){
      expect(stat).to.not.be(undefined);
    });
    
    it('should be an object', function (){
      expect(stat).to.be.a('object');
    });
    
    describe("#help()", function (){
      it('should exist and be a function', function (){
        expect(stat.help).to.not.be(undefined);
        expect(stat.help).to.be.a('function');
      });
      
    });
    
    describe("#requirements()", function (){
      it('should exist and be a function', function (){
        expect(stat.requirements).to.not.be(undefined);
        expect(stat.requirements).to.be.a('function');
      });
    });
    
    describe("#walkthrough()", function (){
      it('should exist and be a function', function (){
        expect(stat.walkthrough).to.not.be(undefined);
        expect(stat.walkthrough).to.be.a('function');
      });
    });
  });
}
