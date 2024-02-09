export function init(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl')

  if (!gl) {
    throw new Error('WebGL is not supported')
  }

  const vert = `
    attribute vec4 a_position;
    attribute vec4 a_color;
    uniform mat4 u_model;
    uniform mat4 u_project;
    varying lowp vec4 v_color;

    void main() {
        gl_Position = u_project * u_model * a_position;
        v_color = a_color;
    }
  `

  const frag = `
    varying lowp vec4 v_color;

    void main() {
        gl_FragColor = v_color;
    }
  `

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vert)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, frag)

  // Create program and attach shaders
  const program = gl.createProgram()
  if (!program) {
    throw new Error('Failed to create WebGL program')
  }
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  // setup buffer
  const positionBuffer = initPositionBuffer(gl)
  const colorBuffer = initColorBuffer(gl)
  const indexBuffer = initIndexBuffer(gl)

  // draw
  let cubeRotation = 0.0
  let deltaTime = 0
  let then = 0

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001 // convert to seconds
    deltaTime = now - then
    then = now

    draw(gl, program, cubeRotation, positionBuffer, indexBuffer, colorBuffer)
    cubeRotation += deltaTime

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

function draw(
  gl,
  prog,
  cubeRotation,
  positionBuffer,
  indexBuffer,
  colorBuffer,
) {
  // Clear canvas and draw the circle
  gl.clearColor(0, 0, 0, 0)
  gl.clearDepth(1.0)
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  const fieldOfView = (45 * Math.PI) / 180 // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
  const zNear = 0.1
  const zFar = 100.0
  const uProject = mat4.create()
  mat4.perspective(uProject, fieldOfView, aspect, zNear, zFar)
  const uModel = mat4.create()
  // mat4.scale(uModel, uModel, [0.5, 0.5, 1])
  mat4.translate(
    uModel, // destination matrix
    uModel, // matrix to translate
    [-0.0, 0.0, -5.0],
  )
  mat4.rotate(
    uModel, // destination matrix
    uModel, // matrix to rotate
    cubeRotation, // amount to rotate in radians
    [0, 0, 1],
  ) // axis to rotate around (Z)
  mat4.rotate(
    uModel, // destination matrix
    uModel, // matrix to rotate
    cubeRotation * 0.7, // amount to rotate in radians
    [0, 1, 0],
  ) // axis to rotate around (Y)
  mat4.rotate(
    uModel, // destination matrix
    uModel, // matrix to rotate
    cubeRotation * 0.3, // amount to rotate in radians
    [1, 0, 0],
  ) // axis to rotate around (X)

  // setPositionAttribute
  const positionAttributeLocation = gl.getAttribLocation(prog, 'a_position')
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(positionAttributeLocation)

  // setColorAttribute
  const colorAttributeLocation = gl.getAttribLocation(prog, 'a_color')
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(colorAttributeLocation)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.useProgram(prog)

  gl.uniformMatrix4fv(gl.getUniformLocation(prog, 'u_model'), false, uModel)
  gl.uniformMatrix4fv(gl.getUniformLocation(prog, 'u_project'), false, uProject)

  {
    const vertexCount = 36
    const type = gl.UNSIGNED_SHORT
    const offset = 0
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
  }
}

// Create shaders
function createShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return shader
}

function initPositionBuffer(gl) {
  const positions = [
    // Front face
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
  ]
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
  return positionBuffer
}

function initIndexBuffer(gl) {
  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = [
    0,
    1,
    2,
    0,
    2,
    3, // front
    4,
    5,
    6,
    4,
    6,
    7, // back
    8,
    9,
    10,
    8,
    10,
    11, // top
    12,
    13,
    14,
    12,
    14,
    15, // bottom
    16,
    17,
    18,
    16,
    18,
    19, // right
    20,
    21,
    22,
    20,
    22,
    23, // left
  ]

  // Now send the element array to GL

  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW,
  )

  return indexBuffer
}

function initColorBuffer(gl) {
  const faceColors = [
    [1.0, 1.0, 1.0, 1.0], // Front face: white
    [1.0, 0.0, 0.0, 1.0], // Back face: red
    [0.0, 1.0, 0.0, 1.0], // Top face: green
    [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
    [1.0, 1.0, 0.0, 1.0], // Right face: yellow
    [1.0, 0.0, 1.0, 1.0], // Left face: purple
  ]

  // Convert the array of colors into a table for all the vertices.

  var colors = []

  for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j]
    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(c, c, c, c)
  }

  const colorBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

  return colorBuffer
}
