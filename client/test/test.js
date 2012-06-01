describe('TestSuite', function (){
  it('should run', function (){
    expect(window).not.to.be(undefined);
  });
});

describe('Ember', function (){
  it('should be loaded', function (){
    expect(Ember).not.to.be(undefined);
  });
});
