var Conway;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Conway = (function() {
  function Conway(columns, rows, cellSize) {
    var i, j, _ref;
    this.columns = columns != null ? columns : 25;
    this.rows = rows != null ? rows : 25;
    this.cellSize = cellSize != null ? cellSize : 16;
    this.map = [];
    for (j = 0, _ref = this.rows; 0 <= _ref ? j < _ref : j > _ref; 0 <= _ref ? j++ : j--) {
      this.map[j] = (function() {
        var _ref2, _results;
        _results = [];
        for (i = 0, _ref2 = this.columns; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
          _results.push(0);
        }
        return _results;
      }).call(this);
    }
    this.r = Raphael("world", this.columns * this.cellSize, this.rows * this.cellSize);
    this.delay = 100;
    this.generation = 0;
    this.draw();
  }
  Conway.prototype.start = function() {
    var runner;
    this.running = true;
    runner = __bind(function() {
      if (!this.running) {
        return;
      }
      this.step();
      return setTimeout(runner, this.delay);
    }, this);
    return runner();
  };
  Conway.prototype.stop = function() {
    return this.running = false;
  };
  Conway.prototype.step = function() {
    var i, j, neighbors, next, _ref, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
    next = [];
    for (j = 0, _ref = this.rows; 0 <= _ref ? j < _ref : j > _ref; 0 <= _ref ? j++ : j--) {
      next[j] = [];
      for (i = 0, _ref2 = this.columns; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
        neighbors = ((_ref3 = (_ref4 = this.map[j - 1]) != null ? _ref4[i - 1] : void 0) != null ? _ref3 : 0) + ((_ref5 = (_ref6 = this.map[j - 1]) != null ? _ref6[i] : void 0) != null ? _ref5 : 0) + ((_ref7 = (_ref8 = this.map[j - 1]) != null ? _ref8[i + 1] : void 0) != null ? _ref7 : 0) + ((_ref9 = (_ref10 = this.map[j]) != null ? _ref10[i - 1] : void 0) != null ? _ref9 : 0) + ((_ref11 = (_ref12 = this.map[j]) != null ? _ref12[i + 1] : void 0) != null ? _ref11 : 0) + ((_ref13 = (_ref14 = this.map[j + 1]) != null ? _ref14[i - 1] : void 0) != null ? _ref13 : 0) + ((_ref15 = (_ref16 = this.map[j + 1]) != null ? _ref16[i] : void 0) != null ? _ref15 : 0) + ((_ref17 = (_ref18 = this.map[j + 1]) != null ? _ref18[i + 1] : void 0) != null ? _ref17 : 0);
        next[j][i] = this.map[j][i] && (2 <= neighbors && neighbors <= 3) || !this.map[j][i] && neighbors === 3;
      }
    }
    this.map = next;
    this.generation += 1;
    return this.draw();
  };
  Conway.prototype.draw = function() {
    var cell, i, j, _ref, _results;
    _results = [];
    for (j = 0, _ref = this.rows; 0 <= _ref ? j < _ref : j > _ref; 0 <= _ref ? j++ : j--) {
      _results.push((function() {
        var _ref2, _results2;
        _results2 = [];
        for (i = 0, _ref2 = this.columns; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
          cell = this.r.rect(i * this.cellSize, j * this.cellSize, this.cellSize, this.cellSize, 3);
          _results2.push(cell.attr('fill', this.map[j][i] ? '#aaf' : '#ccc'));
        }
        return _results2;
      }).call(this));
    }
    return _results;
  };
  Conway.prototype.randomize = function() {
    var i, j, _ref, _ref2;
    this.stop();
    for (j = 0, _ref = this.rows; 0 <= _ref ? j < _ref : j > _ref; 0 <= _ref ? j++ : j--) {
      for (i = 0, _ref2 = this.columns; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
        this.map[j][i] = Math.random() < 0.5 ? 1 : 0;
      }
    }
    this.generation = 0;
    return this.draw();
  };
  return Conway;
})();
$(function() {
  return window.world = new Conway;
});