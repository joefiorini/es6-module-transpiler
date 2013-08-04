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
    factory(RSVP);
  }
}(function(RSVP) {
  "use strict";
}));
