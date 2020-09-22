var gl;
var points;

window.onload = function init() {
  var canvas = document.getElementById("gl-canvas");
  //tag와 관련된것
  gl = WebGLUtils.setupWebGL(canvas); //webgl용 canvas로 바꿔줌
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height); 
  gl.clearColor(1.0, 1.0, 1.0, 1.0); 


  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);



  var bufferId = gl.createBuffer(); //gpu에 보낼 object를 만든다.
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var uColor = gl.getUniformLocation(program, "uColor");
  var uOffset = gl.getUniformLocation(program, "uOffset");

  

  gl.clear(gl.COLOR_BUFFER_BIT);


  var leaf = [
    vec2(0, 1),
    vec2(-0.5, 0.5),
    vec2(0.5, 0.5),
    vec2(0, 0.5),
    vec2(-0.5, 0),
    vec2(0.5, 0),
    vec2(0, 0),
    vec2(-0.5, -0.5),
    vec2(0.5, -0.5)
  ];


  gl.bufferData(gl.ARRAY_BUFFER, flatten(leaf), gl.STATIC_DRAW);
  gl.uniform4fv(uColor, [0, 1, 0, 1]);

  var first = 0;
  var last = 9;
  render(first, last);

  var body = [
    vec2(-0.15, -0.5),
    vec2(-0.15, -1),
    vec2(0.15, -0.5),
    vec2(0.15, -0.5),
    vec2(-0.15, -1),
    vec2(0.15, -1)
  ];

  gl.bufferData(gl.ARRAY_BUFFER, flatten(body), gl.STATIC_DRAW);
  gl.uniform4fv(uColor, [0.5, 0.25, 0, 1]);
  gl.uniform4fv(uOffset, [1, 0, 0, 0]);
  var first = 0;
  var last = 6;
  render(first, last);
  
};

function render(first, last) {
  //gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, first, last);
}
