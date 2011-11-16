class Conway
  constructor: (@columns = 25, @rows = 25, @cellSize = 16) ->
    @map = []
    for j in [0...@rows]
      @map[j] = (0 for i in [0...@columns])

    @r = Raphael("world", @columns * @cellSize, @rows * @cellSize)

    @delay = 100
    @generation = 0
    @draw()

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
    next = []
    for j in [0...@rows]
      next[j] = []
      for i in [0...@columns]
        neighbors =
          (@map[j-1]?[i-1] ? 0) + (@map[j-1]?[i] ? 0) + (@map[j-1]?[i+1] ? 0) +
          (@map[j]?[i-1] ? 0) + (@map[j]?[i+1] ? 0) +
          (@map[j+1]?[i-1] ? 0) + (@map[j+1]?[i] ? 0) + (@map[j+1]?[i+1] ? 0)
        next[j][i] = @map[j][i] and 2 <= neighbors <= 3 or not @map[j][i] and neighbors == 3

    @map = next
    @generation += 1
    @draw()

  draw: ->
    for j in [0...@rows]
      for i in [0...@columns]
        cell = @r.rect(i*@cellSize, j*@cellSize, @cellSize, @cellSize, 3)
        cell.attr 'fill', if @map[j][i] then '#aaf' else '#ccc'

  randomize: ->
    @stop()
    for j in [0...@rows]
      for i in [0...@columns]
        @map[j][i] = if Math.random() < 0.5 then 1 else 0
    @generation = 0
    @draw()

$ -> window.world = new Conway
