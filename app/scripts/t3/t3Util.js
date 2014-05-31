/* global define */
(function(root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['d3', 'lodash'], factory);
  } else {
    root.Tablamo = factory(root.d3, root._);
  }
}(this, function(d3, _) {
  'use strict';

  function T3Util (args) {

  }

  _.extend(T3Util.prototype, {

    limitTo: function () {

    },

    nestBy: function () {
      var last;
      var nestFn = d3.nest();

      if (sortBy.length > 1) {
        last = sortBy.pop();
      }

      sortBy.forEach(function(sortDef) {
        nestFn = nestFn.key.call(this, function(d) {
          return d[sortDef.field];
        });

        if (sortDef.direction) {
          nestFn = nestFn.sortKeys.call(this, function (a, b) {
            var aa = parseFloat(a);
            var bb = parseFloat(b);
            
            a = (isNaN(aa)) ? a : aa;
            b = (isNaN(bb)) ? b : bb;

            return d3[sortDef.direction].call(this, a, b);
          });
        }
      });

      if (last) {
        nestFn = nestFn.sortValues(function (a, b) {
          return d3[last.direction].call(this, a[last.field], b[last.field]);
        });
      }

      return nestFn.entries.call(this, this.get('data'));    
    },

    sortBy: function () {

    },
    
    filter: function () {

    }
  });

  T3Util.prototype.contructor = T3Util;

  return T3Util;
}));