(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(
      [],
      function() {
        return factory();
      });
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    return factory();
  }
}(function() {
  "use strict";
  var jQuery = function() { };

  return jQuery;
}));
