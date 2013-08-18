(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(
      ["ember","rsvp"],
      function(__dependency1__, __dependency2__) {
        factory(__dependency1__,__dependency2__);
      });
  } else if (typeof exports === 'object') {
    factory(require("ember"),require("rsvp"));
  } else {
    factory(Ember, RSVP);
  }
}(function(__dependency1__, __dependency2__) {
  "use strict";
  var get = __dependency1__.get;
  var set = __dependency1__.set;
  var makeDeferred = __dependency2__.defer;
}));
