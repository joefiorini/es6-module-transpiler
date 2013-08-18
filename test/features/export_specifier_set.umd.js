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
    throw new Error('root UMD compilation not yet implemented');
  }
}(function(__dependency1__, __dependency2__) {
  "use strict";
  var get = __dependency1__.get;
  var set = __dependency1__.set;
}));
