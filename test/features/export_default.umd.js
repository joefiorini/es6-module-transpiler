(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(
      [],
      function() {
        return factory();
      });
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    throw new Error('root UMD compilation not yet implemented');
  }
}(function() {
  "use strict";
  var jQuery = function() { };

  return jQuery;
}));
