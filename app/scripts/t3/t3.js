/* global define */
(function(root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['d3', 'lodash', 'watch'], factory);
  } else {
    root.Tablamo = factory(root.d3, root._, root.watch);
  }
}(this, function(d3, _, watch) {
  'use strict';

  // Data Model
  function T3Model (args) {
    var properties = ['data', 'columns'];

    properties.forEach(function (property) {
      this[property] = args[property];
    });
  }

  // Model functions
  _.extend(T3Model.prototype, {
    chain: function (data) {
      this.__chained__ = true;
      this.__wrapped__ = data;
      return this;
    },

    nest: function () {
      var last;
      var nestFn = d3.nest();

      if (this.nestBy.length > 1) {
        last = this.nestBy.pop();
      }

      this.nestBy.forEach(function(nestDef) {
        nestFn = nestFn.key.call(this, function(d) {
          return d[nestDef.field];
        });

        nestDef.direction = nestDef.direction || 'ascending';

        nestFn = nestFn.sortKeys.call(this, function (a, b) {
          var aa = parseFloat(a);
          var bb = parseFloat(b);
          
          a = (isNaN(aa)) ? a : aa;
          b = (isNaN(bb)) ? b : bb;

          return d3[nestDef.direction].call(this, a, b);
        });
      });

      if (last) {
        nestFn = nestFn.sortValues(function (a, b) {
          return d3[last.direction].call(this, a[last.field], b[last.field]);
        });
      }

      if (!this.__chained__) {
        return nestFn.entries.call(this, this.data);
      }

      this.__wrapped__ = nestFn.entries.call(this, this.__wrapped__);
      return this;
    },

    flatten: function () {
      var data = (this.__chained__) ? this.__wrapped__ : this.data;
      var flattendData = [];

      function flattenGroup (group) {
        if (group.values[0] && group.values[0].key && group.values[0].values) {
          group.values.forEach(flattenGroup);
        } else {
          flattendData.push(group);
        }
      }

      data.forEach(flattenGroup);

      if (!this.__chained__) {
        return flattendData;
      }

      this.__wrapped__ = flattendData;
      return this;
    },

    limit: function () {
      var data = (this.__chained__) ? this.__wrapped__ : this.data;
      var limits = this.limts;
      var limitedData = [];
      var count = -1;

      data.forEach(function (group) {
        limitedData.push(_.filter(group.values, function () {
          count++;
          return (count >= limits.min) && (count <= limits.max);
        }));
      });

      if (!this.__chained__) {
        return limitedData;
      }

      this.__wrapped__ = limitedData;
      return this;
    },

    values: function () {
      var data = this.__wrapped__;

      this.__wrapped__ = undefined;
      this.__chained__ = false;

      return data;
    }
  });

  T3Model.prototype.constructor = T3Model;

  // Contructor
  function T3 (args) {
    args = args || {};

    this.model = new T3Model(args);
    this.table = args.element || document.createElement('div');

    this.initBindings();
  }

  // Events functions
  _.extend(T3.prototype, {
    initBindings: function () {
      WatchJS.watch(this.model, 'data', this.dataChange.bind(this));
      WatchJS.watch(this.model, 'columns', this.columnChange.bind(this));
    },

    dataChange: function (prop, action, newValue, oldValue) {

    },

    columnChange: function (prop, action, newValue, oldValue) {

    }
  });

  // Draw functions
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
        .data(this.model.columns);

      columns.enter()
        .append('th')
        .html(function (d){
          return d.name;
        });

      columns.exit()
        .remove();
    },

    drawGroups: function () {
      var data = this.model.data
        .nest()
        .limit()
        .values();

      var groups = d3.select(this.table).select('table')
        .selectAll('tbody')
        .data(data);

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
      var that = this;

      var cells = d3.select(this.table).selectAll('tbody tr')
        .selectAll('td')
        .data(function (d, i) {
          return this.model.columns.map(function (column) {
            var oldRow = that.__cache__[i] || {};

            return {
              value: d[column.field],
              oldValue: oldRow[column.field],
              column: column
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
    }
  });

  T3.prototype.constructor = T3;

  return T3;
}));