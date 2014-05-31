/* global define */
(function(root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['d3', 'lodash', 'watch', './t3Model', './t3Util'], factory);
  } else {
    root.Tablamo = factory(root.d3, root._, root.watch, root.T3Model, root.T3Util);
  }
}(this, function(d3, _, watch, T3Model, T3Util) {
  'use strict';

  function T3Model (args) {

  }

  _.extend(T3Model.prototype, {
  });

  T3Model.prototype.contructor = T3Model;

  return T3Model;
}));