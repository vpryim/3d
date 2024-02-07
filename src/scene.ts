export function init(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('webgl')

  if (!ctx) {
    throw new Error('WebGL is not supported')
  }

  const vert = `
    attribute vec2 a_position;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `

  const frag = `
    precision mediump float;
    uniform vec4 u_color;

    void main() {
        gl_FragColor = u_color;
    }
  `

  // Create shaders
  function createShader(ctx, type, source) {
    const shader = ctx.createShader(type)
    ctx.shaderSource(shader, source)
    ctx.compileShader(shader)
    return shader
  }

  const vertexShader = createShader(ctx, ctx.VERTEX_SHADER, vert)
  const fragmentShader = createShader(ctx, ctx.FRAGMENT_SHADER, frag)

  // Create program and attach shaders
  const program = ctx.createProgram()
  if (!program) {
    throw new Error('Failed to create WebGL program')
  }
  ctx.attachShader(program, vertexShader)
  ctx.attachShader(program, fragmentShader)
  ctx.linkProgram(program)
  ctx.useProgram(program)

  // Set up position buffer
  const positionBuffer = ctx.createBuffer()
  ctx.bindBuffer(ctx.ARRAY_BUFFER, positionBuffer)

  // Calculate circle vertices
  const vertices = [
    // ...[0, 0],
    // ...[0, 0.5],
    // ...[0.5, 0.5],
    // ...[0.5, 0.5],
    // ...[0.5, 0],
    // ...[0, 0],

    ...[-1, 1],
    ...[-1, 1],
    ...[1, 1],
    ...[1, 1],
    ...[1, -1],
    ...[-1, -1],
  ]
  // const radius = 0.5
  const segments = 6
  // const angleIncrement = (2 * Math.PI) / segments
  // for (let i = 0; i < segments; i++) {
  //   const angle = i * angleIncrement
  //   const x = Math.cos(angle) * radius
  //   const y = Math.sin(angle) * radius
  //   vertices.push(x, y)
  // }

  // Pass vertex data to buffer
  ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(vertices), ctx.STATIC_DRAW)

  // Get position attribute location and enable it
  const positionAttributeLocation = ctx.getAttribLocation(program, 'a_position')
  ctx.enableVertexAttribArray(positionAttributeLocation)
  ctx.vertexAttribPointer(positionAttributeLocation, 2, ctx.FLOAT, false, 0, 0)

  // Set uniform color
  const colorUniformLocation = ctx.getUniformLocation(program, 'u_color')
  ctx.uniform4fv(colorUniformLocation, [1, 0, 0, 1]) // Red color

  // Clear canvas and draw the circle
  ctx.clearColor(0, 0, 0, 0)
  ctx.clear(ctx.COLOR_BUFFER_BIT)
  ctx.drawArrays(ctx.TRIANGLE_FAN, 0, segments)
}
