// Add mozilla header here

// Options that can be configured to alter behavior of the sample
// These are constants but in theory could be changed to variables
// to allow uture UI additions to change them in-flight.

const xRotationDegreesPerSecond = 0;      // Rotation per second around X axis
const yRotationDegreesPerSecond = 0;      // Rotation per second around Y axis
const zRotationDegreesPerSecond = 0;      // Rotation per second around Z axis
const enableRotation = true;
const allowMouseRotation = true;
const allowKeyboardMotion = true;
const enableForcePolyfill = false;
const SESSION_TYPE = "immersive-vr";       // "immersive-vr" or "inline"
//const SESSION_TYPE = "inline";
const MOUSE_SPEED = 0.003;
const MOVE_DISTANCE = 0.4;


// WebXR variables

let polyfill = null;
let xrSession = null;
let xrInputSources = null;
let xrReferenceSpace = null;
let xrButton = null;
let gl = null;
let animationFrameRequestID = 0;

// Renderer variables and constants

const viewerStartPosition = vec3.fromValues(0, 0, -10);
const viewerStartOrientation = vec3.fromValues(0, 0, 1.0);

const upVector = vec3.fromValues(0, 1, 0);
const cubeOrientation = vec3.create();
const cubeMatrix = mat4.create();
const mouseMatrix = mat4.create();

// Conversion constants

const RADIANS_PER_DEGREE = Math.PI / 180.0;

// Vectors used for creating "orthonormal up"; that is,
// the vector pointing straight out of the top of the
// object, even if it's rotated.

const vecX = vec3.create();
const vecY = vec3.create();


// For storing references to the elements into which matrices
// are to be output

let projectionMatrixOut;
let modelMatrixOut;
let cameraMatrixOut;
let mouseMatrixOut;

// Log a WebGL error message. The where parameter should be
// a string identifying the circumstance of the error.

function LogGLError(where) {
  let err = gl.getError();
  if (err) {
    console.error(`WebGL error returned by ${where}: ${err}`);
  }
}

//
// Shaders from the original cube demo
//

// Vertex shader program
const vsSource = `
  attribute vec4 aVertexPosition;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  }
`;

// Fragment shader program
const fsSource = `
  void main(void) {
    gl_FragColor = vec4(0.0,1.0,0.0,1.0);
  }
`;

window.addEventListener("load", onLoad);

function onLoad() {
  xrButton = document.querySelector("#enter-xr");
  xrButton.addEventListener("click", onXRButtonClick);

  // Get the matrix output elements

  projectionMatrixOut = document.querySelector("#projection-matrix div");
  modelMatrixOut = document.querySelector("#model-view-matrix div");
  cameraMatrixOut = document.querySelector("#camera-matrix div");
  mouseMatrixOut = document.querySelector("#mouse-matrix div");

  // Install the WebXR polyfill if needed or if the
  // enableForcePolyfill option is set to true

  if (!navigator.xr || enableForcePolyfill) {
    console.log("Using the polyfill");
    polyfill = new WebXRPolyfill();
  }
  setupXRButton();
}

function setupXRButton() {
  if (navigator.xr.isSessionSupported) {
    navigator.xr.isSessionSupported(SESSION_TYPE)
    .then((supported) => {
      xrButton.disabled = !supported;
    });
  } else {
    navigator.xr.supportsSession(SESSION_TYPE)
    .then(() => {
      xrButton.disabled = false;
    })
    .catch(() => {
      xrButton.disabled = true;
    });
  }
}

async function onXRButtonClick(event) {
  if (!xrSession) {
    navigator.xr.requestSession(SESSION_TYPE)
    .then(sessionStarted);
  } else {
    await xrSession.end();

    // If the end event didn't cause us to close things down,
    // do it explicitly here, now that the promise returned by
    // end() has been resolved.

    if (xrSession) {
      sessionEnded();
    }
  }
}

// Variables for storing the details about the GLSL program and the
// data it needs.

let shaderProgram = null;
let programInfo = null;
let buffers = null;
let texture = null;

function sessionStarted(session) {
  let refSpaceType;

  xrSession = session;
  xrButton.innerText = "Exit WebXR";

  // Listen for the "end" event; when it arrives, we will
  // halt any animations and the like.

  xrSession.addEventListener("end", sessionEnded);

  // Set up the rendering context for use with the display we're
  // using. Here, we're using a context that's actually
  // visible in the document, in order to see what's going
  // on even without a headset. Normally you would use
  // document.createElement("canvas") to create an offscreen
  // canvas.

  let canvas = document.querySelector("canvas");
  gl = canvas.getContext("webgl", { xrCompatible: true });

  // If we have mouse rotation support enabled, add it here.

  if (allowMouseRotation) {
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("contextmenu", (event) => { event.preventDefault(); });
  }

  // If keyboard movement is enabled, add it

  if (allowKeyboardMotion) {
    document.addEventListener("keydown", handleKeyDown);
  }

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVertexNormal, aTextureCoord,
  // and look up uniform locations.
  programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  buffers = initBuffers(gl);
  // Create the XRWebGLLayer to use as the base layer for the
  // session.

  xrSession.updateRenderState({
    baseLayer: new XRWebGLLayer(xrSession, gl)
  });

  // Get the reference space for querying poses.

  if (SESSION_TYPE == "immersive-vr") {
    refSpaceType = "local";
  } else {
    refSpaceType = "viewer";
  }

  // Set up the initial matrix for the cube's position
  // and orientation.

  mat4.fromTranslation(cubeMatrix, viewerStartPosition);

  // Initialize the cube's current orientation relative to the
  // global space.

  vec3.copy(cubeOrientation, viewerStartOrientation);

  // Set vecY to point straight up copying the upVector
  // into it. vecY will always point outward from the top
  // of the object, regardless of changes made to yaw and
  // pitch by the user.

  vec3.copy(vecY, upVector);

  xrSession.requestReferenceSpace(refSpaceType)
  .then((refSpace) => {
    xrReferenceSpace = refSpace;
    xrReferenceSpace = xrReferenceSpace.getOffsetReferenceSpace(
          new XRRigidTransform(viewerStartPosition, cubeOrientation));
    animationFrameRequestID = xrSession.requestAnimationFrame(drawFrame);
  });

  return xrSession;
}

function sessionEnded() {
  xrButton.innerText = "Enter WebXR";

  // If we have a pending animation request, cancel it; this
  // will stop processing the animation of the scene.

  if (animationFrameRequestID) {
    xrSession.cancelAnimationFrame(animationFrameRequestID);
    animationFrameRequestID = 0;
  }
  xrSession = null;
}

// Variables used to handle rotation using the mouse

let mouseYaw = 0;
let mousePitch = 0;
const inverseOrientation = quat.create();

// Variables for handling keyboard movement

let axialDistance = 0;
let transverseDistance = 0;
let verticalDistance = 0;

// Handle keyboard events; for the WASD keys,
// apply movement forward/backward or side-to-side.
// The "R" key resets the position and orientation
// to the starting point.

function handleKeyDown(event) {
  switch(event.key) {
    // Forward
    case "w":
    case "W":
      verticalDistance -= MOVE_DISTANCE;
      break;
    // Backward
    case "s":
    case "S":
      verticalDistance += MOVE_DISTANCE;
      break;
    // Left
    case "a":
    case "A":
      transverseDistance += MOVE_DISTANCE;
      break;
    // Right
    case "d":
    case "D":
      transverseDistance -= MOVE_DISTANCE;
      break;
    case "ArrowUp":
      axialDistance += MOVE_DISTANCE;
      break;
    case "ArrowDown":
      axialDistance -= MOVE_DISTANCE;
      break;
    // Reset
    case "r":
    case "R":
      transverseDistance = axialDistance = verticalDistance = 0;
      mouseYaw = mousePitch = 0;
      break;
    default:
      break;
  }
}

// Handle the pointermove event; called only if rotation
// using the mouse is enabled. The right mouse button
// must also be down.

function handlePointerMove(event) {
  if (event.buttons & 2) {
    rotateViewBy(event.movementX, event.movementY);
  }
}

// Rotate the view by the specified deltas. Used for
// things like mouse/keyboard/touch controls.

function rotateViewBy(dx, dy) {
  mouseYaw -= dx * MOUSE_SPEED;
  mousePitch -= dy * MOUSE_SPEED;

  if (mousePitch < -Math.PI * 0.5) {
    mousePitch = -Math.PI * 0.5;
  } else if (mousePitch > Math.PI * 0.5) {
    mousePitch = Math.PI * 0.5;
  }
}

let lastFrameTime = 0;

function drawFrame(time, frame) {
  // Adjust for any mouse-based movement of the viewer

  let adjustedRefSpace = applyViewerControls(xrReferenceSpace);

  // Get the pose relative to the reference space

  let pose = frame.getViewerPose(adjustedRefSpace);

  // Let the session know to go ahead and plan to hit us up
  // again next frame

  animationFrameRequestID = frame.session.requestAnimationFrame(drawFrame);

  // Make sure we have a pose and start rendering

  if (pose) {
    let glLayer = frame.session.renderState.baseLayer;

    // Bind the WebGL layer's framebuffer to the renderer

    gl.bindFramebuffer(gl.FRAMEBUFFER, glLayer.framebuffer);
    LogGLError("bindFrameBuffer");

    // Clear the GL context in preparation to render the
    // new frame

    gl.clearColor(0, 0, 0, 1.0);
    gl.clearDepth(1.0);                 // Clear everything
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    LogGLError("glClear");

    const deltaTime = (time - lastFrameTime) * 0.001;  // Convert to seconds
    lastFrameTime = time;

    // Render all of the frame's views to the output

    for (let view of pose.views) {
      let viewport = glLayer.getViewport(view);
      gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
      LogGLError(`Setting viewport for eye: ${view.eye}`);
      gl.canvas.width = viewport.width * pose.views.length;
      gl.canvas.height = viewport.height;

      // Draw the view; typically there's one view for each eye unless
      // we're in a monoscopic view, such as an inline session.

      renderScene(gl, view, programInfo, buffers, deltaTime);
    }
  }
}

// Create a new reference space that includes the effect
// of the rotiation indicated by mousePitch and mouseYaw.
// Include also the keyboard motion information if
// available.

function applyViewerControls(refSpace) {
  if (!mouseYaw && !mousePitch && !axialDistance &&
      !transverseDistance && !verticalDistance) {
    return refSpace;
  }

  // Compute the quaternion used to rotate the viewpoint based
  // on the pitch and yaw.

  quat.identity(inverseOrientation);
  quat.rotateX(inverseOrientation, inverseOrientation, -mousePitch);
  quat.rotateY(inverseOrientation, inverseOrientation, -mouseYaw);

  // Compute the true "up" vector for our object.

 // vec3.cross(vecX, vecY, cubeOrientation);
 // vec3.cross(vecY, cubeOrientation, vecX);

  // Now compute the transform that teleports the object to the
  // specified point and save a copy of it to display to the user
  // later; otherwise we probably wouldn't need to save mouseMatrix
  // at all.

  let newTransform = new XRRigidTransform({x: transverseDistance,
                                           y: verticalDistance,
                                           z: axialDistance},
                         {x: inverseOrientation[0], y: inverseOrientation[1],
                          z: inverseOrientation[2], w: inverseOrientation[3]});
  mat4.copy(mouseMatrix, newTransform.matrix);

  // Create a new reference space that transforms the object to the new
  // position and orientation, returning the new reference space.

  return refSpace.getOffsetReferenceSpace(newTransform);
}

// Storage for values used by renderScene(), declared
// globally so they aren't being reallocated every
// frame. Could also be in an object if renderScene()
// were a method on an object.

const modelViewMatrix = mat4.create();

//
// Render the scene.
//
function renderScene(gl, view, programInfo, buffers, deltaTime) {
  const xRotationForTime = (xRotationDegreesPerSecond * RADIANS_PER_DEGREE) * deltaTime;
  const yRotationForTime = (yRotationDegreesPerSecond * RADIANS_PER_DEGREE) * deltaTime;
  const zRotationForTime = (zRotationDegreesPerSecond * RADIANS_PER_DEGREE) * deltaTime;

  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // If the cube rotation is being animated, do so now.

  if (enableRotation) {
    mat4.rotate(cubeMatrix,  // destination matrix
                cubeMatrix,  // matrix to rotate
                zRotationForTime,     // amount to rotate in radians
                [0, 0, 1]);       // axis to rotate around (Z)
    mat4.rotate(cubeMatrix,  // destination matrix
                cubeMatrix,  // matrix to rotate
                yRotationForTime, // amount to rotate in radians
                [0, 1, 0]);       // axis to rotate around (Y)
    mat4.rotate(cubeMatrix,  // destination matrix
                cubeMatrix,  // matrix to rotate
                xRotationForTime, // amount to rotate in radians
                [1, 0, 0]);       // axis to rotate around (X)
  }

  // Model view matrix is view.transform.inverse.matrix * cubeMatrix; this
  // moves the object in relation to the viewer in order to simulate the movement
  // of the viewer.

  mat4.multiply(modelViewMatrix, view.transform.inverse.matrix, cubeMatrix);

  // Compute the normal matrix for the view

  // Display the matrices to the screen for review and because MathML
  // is a nifty underused technology.

  displayMatrix(view.projectionMatrix, 4, projectionMatrixOut);
  displayMatrix(modelViewMatrix, 4, modelMatrixOut);
  displayMatrix(view.transform.matrix, 4, cameraMatrixOut);
  displayMatrix(mouseMatrix, 4, mouseMatrixOut);

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  // Give WebGL the list of index numbers identifying
  // the order in which to connect the vertices to
  // render the triangle set that makes up our object.
  // Every group of three entries in this list are
  // used as indices into the vertex buffer to get
  // the coordinates that make up each triangle in the
  // batch of triangles.
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing these
  // triangles. The program includes the vertex and
  // fragment shaders that will define the final position
  // of each vertex and the color of each pixel within
  // the rendered triangles.
  gl.useProgram(programInfo.program);

  // Send our computed matrices to the GPU by setting the
  // values of the corresponding uniforms.
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      view.projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  // Render all of the triangles in the list that makes
  // up the object.
  {
    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
}

// Replace the contents of the specified block with a
// MathML-rendered matrix, because MathML is nifty!

function displayMatrix(mat, rowLength, target) {
  let outHTML = "";

  if (mat && rowLength && rowLength <= mat.length) {
    let numRows = mat.length / rowLength;
    outHTML = "<math xmlns='http://www.w3.org/1998/Math/MathML' display='block'>\n<mrow>\n<mo>[</mo>\n<mtable>\n";

    for (let y=0; y<numRows; y++) {
      outHTML += "<mtr>\n";
      for (let x=0; x<rowLength; x++) {
        outHTML += `<mtd><mn>${mat[(x*rowLength) + y].toFixed(2)}</mn></mtd>\n`;
      }
      outHTML += "</mtr>\n";
    }

    outHTML += "</mtable>\n<mo>]</mo>\n</mrow>\n</math>";
  }

  target.innerHTML = outHTML;
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  LogGLError("createProgram");
  gl.attachShader(shaderProgram, vertexShader);
  LogGLError("attachShader (vertex)");
  gl.attachShader(shaderProgram, fragmentShader);
  LogGLError("attachShader (fragment)");

  gl.linkProgram(shaderProgram);
  LogGLError("linkProgram");

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  LogGLError("createShader");

  // Send the source to the shader object

  gl.shaderSource(shader, source);
  LogGLError("shaderSource");

  // Compile the shader program

  gl.compileShader(shader);
  LogGLError("compileShader");

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}


//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple three-dimensional cube.
//
function initBuffers(gl) {
  // Create a buffer for the cube's vertex positions.

  const positionBuffer = gl.createBuffer();
  LogGLError("createBuffer (positionBuffer)");

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  LogGLError("bindBuffer (positionBuffer)");

  // Now create an array of coordinates for each vertex in the
  // cube. These will be referenced by index into the list
  // in order to define the positions of the cube's vertices
  // in object-local space.

  const positions = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
  ];

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  LogGLError("bufferData (positions)");

  // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.

  const indexBuffer = gl.createBuffer();
  LogGLError("createBuffer (indexBuffer)");
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  LogGLError("bindBuffer (indexBuffer)");

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ];

  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);
  LogGLError("bufferData (indices)");

  return {
    position: positionBuffer,
    indices: indexBuffer
  };
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}
