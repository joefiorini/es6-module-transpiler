(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(
      ["rsvp"],
      function(RSVP) {
        factory(RSVP);
      });
  } else if (typeof exports === 'object') {
    factory(require("rsvp"));
  } else {
    throw new Error('root UMD compilation not yet implemented');
  }
}(function(RSVP) {
  "use strict";
}));
