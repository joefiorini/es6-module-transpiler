(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(
      ["rsvp"],
      function(__dependency1__) {
        "use strict";
        factory(__dependency1__);
      });
  } else if (typeof exports === 'object') {
    factory(require("rsvp"));
  } else {
    factory(window.RSVP);
  }
}(function(RSVP) {
  "use strict";
}));
