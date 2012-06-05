//Opt-in to coming Ember changes early
window.ENV = window.ENV || {};
window.ENV.CP_DEFAULT_CACHEABLE = true;
window.ENV.VIEW_PRESERVES_CONTEXT = true;

//Actual Application

window.App = Ember.Application.create({
  rootElement: "#everything"
});



