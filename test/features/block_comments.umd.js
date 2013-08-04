(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(
      ["rsvp"],
      function(__dependency1__) {
        factory(__dependency1__);
      });
  } else if (typeof exports === 'object') {
    factory(require("rsvp"));
  } else {
    throw new Error('root UMD compilation not yet implemented');
  }
}(function(__dependency1__) {
  "use strict";
  /* import { foo } from "foo";
  import { bazz } from "bazz";
  import { bar } from "bar";
  import { buzz } from "buzz"; */
}));
