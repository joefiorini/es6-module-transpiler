(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(
      ["exports"],
      function(exports) {
        factory(exports);
      });
  } else if (typeof exports === 'object') {
    factory(exports);
  } else {
    throw new Error('root UMD compilation not yet implemented');
  }
}(function(exports) {
  "use strict";
  var jQuery = function() { };

  exports.jQuery = jQuery;
}));
