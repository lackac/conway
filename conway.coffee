class Cell
  constructor: (@world, @x = 0, @y = 0, @alive = false) ->
    @neighbors = []
    cs = @world.cellSize
    @cell = @world.r.rect(@x * cs, @y * cs, cs, cs, 3)
    @draw()
    @cell.click =>
      @next = not @alive
      @draw()

  connect: (other) ->
    @neighbors.push other
    other.neighbors.push this

  step: ->
    neighbors = 0
    neighbors += 1 for neighbor in @neighbors when neighbor.alive
    @next = @alive and 2 <= neighbors <= 3 or not @alive and neighbors == 3

  draw: ->
    if @next?
      @alive = @next
      @next = null
    @cell.attr 'fill', if @alive then '#88f' else '#eee'


class World
  constructor: (@columns = 60, @rows = 35, @cellSize = 16) ->
    @r = Raphael("world", @columns * @cellSize, @rows * @cellSize)

    @map = []
    for x in [0...@columns]
      @map[x] = []
      for y in [0...@rows]
        @map[x][y] = cell = new Cell(this, x, y)
        if x > 0
          cell.connect(@map[x-1][y-1]) if y > 0
          cell.connect(@map[x-1][y])
          cell.connect(@map[x-1][y+1]) if y < @rows-1
        cell.connect(@map[x][y-1]) if y > 0

    @delay = 100
    @generation = 0

  start: ->
    @running = true
    runner = =>
      return unless @running
      @step()
      setTimeout(runner, @delay)
    runner()

  stop: ->
    @running = false

  step: ->
    for x in [0...@columns]
      for y in [0...@rows]
        @map[x][y].step()
    @generation += 1
    @draw()

  draw: ->
    for x in [0...@columns]
      for y in [0...@rows]
        @map[x][y].draw()
    $('#generation').text @generation

  randomize: ->
    @stop()
    for x in [0...@columns]
      for y in [0...@rows]
        @map[x][y].next = Math.random() < 0.5
    @generation = 0
    @draw()

  clear: ->
    @stop()
    for x in [0...@columns]
      for y in [0...@rows]
        @map[x][y].next = false
    @generation = 0
    @draw()


$ ->
  window.world = new World

  $('#start-stop').click ->
    if world.running
      world.stop()
      $(this).text 'Start'
    else
      world.start()
      $(this).text 'Stop'

  $('#randomize').click ->
    world.randomize()
    $('#start-stop').text 'Start'

  $('#clear').click ->
    world.clear()
    $('#start-stop').text 'Start'
