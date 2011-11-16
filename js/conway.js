var Cell, World;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Cell = (function() {
  function Cell(world, x, y, alive) {
    var cs;
    this.world = world;
    this.x = x != null ? x : 0;
    this.y = y != null ? y : 0;
    this.alive = alive != null ? alive : false;
    this.neighbors = [];
    cs = this.world.cellSize;
    this.cell = this.world.r.rect(this.x * cs, this.y * cs, cs, cs, 3);
    this.draw();
    this.cell.click(__bind(function() {
      this.next = !this.alive;
      return this.draw();
    }, this));
  }
  Cell.prototype.connect = function(other) {
    this.neighbors.push(other);
    return other.neighbors.push(this);
  };
  Cell.prototype.step = function() {
    var neighbor, neighbors, _i, _len, _ref;
    neighbors = 0;
    _ref = this.neighbors;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      neighbor = _ref[_i];
      if (neighbor.alive) {
        neighbors += 1;
      }
    }
    return this.next = this.alive && (2 <= neighbors && neighbors <= 3) || !this.alive && neighbors === 3;
  };
  Cell.prototype.draw = function() {
    if (this.next != null) {
      this.alive = this.next;
      this.next = null;
    }
    return this.cell.attr('fill', this.alive ? '#88f' : '#eee');
  };
  return Cell;
})();
World = (function() {
  function World(columns, rows, cellSize) {
    var cell, x, y, _ref, _ref2;
    this.columns = columns != null ? columns : 60;
    this.rows = rows != null ? rows : 35;
    this.cellSize = cellSize != null ? cellSize : 16;
    this.r = Raphael("world", this.columns * this.cellSize, this.rows * this.cellSize);
    this.map = [];
    for (x = 0, _ref = this.columns; 0 <= _ref ? x < _ref : x > _ref; 0 <= _ref ? x++ : x--) {
      this.map[x] = [];
      for (y = 0, _ref2 = this.rows; 0 <= _ref2 ? y < _ref2 : y > _ref2; 0 <= _ref2 ? y++ : y--) {
        this.map[x][y] = cell = new Cell(this, x, y);
        if (x > 0) {
          if (y > 0) {
            cell.connect(this.map[x - 1][y - 1]);
          }
          cell.connect(this.map[x - 1][y]);
          if (y < this.rows - 1) {
            cell.connect(this.map[x - 1][y + 1]);
          }
        }
        if (y > 0) {
          cell.connect(this.map[x][y - 1]);
        }
      }
    }
    this.delay = 100;
    this.generation = 0;
  }
  World.prototype.start = function() {
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
  World.prototype.stop = function() {
    return this.running = false;
  };
  World.prototype.step = function() {
    var x, y, _ref, _ref2;
    for (x = 0, _ref = this.columns; 0 <= _ref ? x < _ref : x > _ref; 0 <= _ref ? x++ : x--) {
      for (y = 0, _ref2 = this.rows; 0 <= _ref2 ? y < _ref2 : y > _ref2; 0 <= _ref2 ? y++ : y--) {
        this.map[x][y].step();
      }
    }
    this.generation += 1;
    return this.draw();
  };
  World.prototype.draw = function() {
    var x, y, _ref, _ref2;
    for (x = 0, _ref = this.columns; 0 <= _ref ? x < _ref : x > _ref; 0 <= _ref ? x++ : x--) {
      for (y = 0, _ref2 = this.rows; 0 <= _ref2 ? y < _ref2 : y > _ref2; 0 <= _ref2 ? y++ : y--) {
        this.map[x][y].draw();
      }
    }
    return $('#generation').text(this.generation);
  };
  World.prototype.randomize = function() {
    var x, y, _ref, _ref2;
    this.stop();
    for (x = 0, _ref = this.columns; 0 <= _ref ? x < _ref : x > _ref; 0 <= _ref ? x++ : x--) {
      for (y = 0, _ref2 = this.rows; 0 <= _ref2 ? y < _ref2 : y > _ref2; 0 <= _ref2 ? y++ : y--) {
        this.map[x][y].next = Math.random() < 0.5;
      }
    }
    this.generation = 0;
    return this.draw();
  };
  World.prototype.clear = function() {
    var x, y, _ref, _ref2;
    this.stop();
    for (x = 0, _ref = this.columns; 0 <= _ref ? x < _ref : x > _ref; 0 <= _ref ? x++ : x--) {
      for (y = 0, _ref2 = this.rows; 0 <= _ref2 ? y < _ref2 : y > _ref2; 0 <= _ref2 ? y++ : y--) {
        this.map[x][y].next = false;
      }
    }
    this.generation = 0;
    return this.draw();
  };
  return World;
})();
$(function() {
  window.world = new World;
  $('#start-stop').click(function() {
    if (world.running) {
      world.stop();
      return $(this).text('Start');
    } else {
      world.start();
      return $(this).text('Stop');
    }
  });
  $('#randomize').click(function() {
    world.randomize();
    return $('#start-stop').text('Start');
  });
  return $('#clear').click(function() {
    world.clear();
    return $('#start-stop').text('Start');
  });
});