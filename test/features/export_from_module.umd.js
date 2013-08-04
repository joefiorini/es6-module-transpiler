(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(
      ["path","exports"],
      function(__reexport1__, exports) {
        factory(__reexport1__,exports);
      });
  } else if (typeof exports === 'object') {
    factory(require("path"),exports);
  } else {
    throw new Error('root UMD compilation not yet implemented');
  }
}(function(__reexport1__, exports) {
  "use strict";
  exports.join = __reexport1__.join;
  exports.extname = __reexport1__.extname;
}));
