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

  function T3 (args) {
    T3Model.apply(this, arguments);
    args = args || {};
    this.table = args.element || document.createElement('div');

  }

  _.extend(T3.prototype, {
    createTable: function () {
      var table = d3.select(this.table).selectAll('table')
        .data([[]]);

      table.enter()
        .append('table')
        .append('thead');

      table.exit()
        .remove();
    },

    drawColumns: function () {
      var columns = d3.select(this.table).select('thead tr')
        .selectAll('th')
        .data([this.get('columns')]);

      columns.enter()
        .append('th')
        .html(function (d){
          return d.name;
        });

      columns.exit()
        .remove();
    },

    drawGroups: function () {
      var groups = d3.select(this.table).select('table')
        .selectAll('tbody')
        .data(this.get('groups'));

      groups.enter()
        .append('tbody');

      groups.exit()
        .remove();
    },

    drawRows: function () {
      var rows = d3.select(this.table).selectAll('tbody')
        .selectAll('tr')
        .data(function (d) {
          return d.values;
        });

      rows.enter()
        .append('tr');

      rows.exit()
        .remove();
    },

    drawCells: function () {
      var cells = d3.select(this.table).selectAll('tbody tr')
        .selectAll('td')
        .data(function (d) {
          return Object.keys(d).map(function (key) {
            return {
              value: d[key],
              column: _.findWhere(this.get('columns'), {field: key})
            };
          });
        });

      cells.enter()
        .append('td')
        .html(function (d) {
          return d.value;
        });

      cells.exit()
        .remove();
    },

    drawEditor: function () {

    }
  });

  T3.prototype.constructor = T3;

  return T3;
}));