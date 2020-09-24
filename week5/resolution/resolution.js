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

 

  var vertices = new Float32Array([
    10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30,
  ]);


  var vResolution = gl.getUniformLocation(program, "vResolution");
  // set the resolution
  gl.uniform2f(vResolution, gl.canvas.width, gl.canvas.height);

  /*
  var bufferId = gl.createBuffer(); //gpu에 보낼 object를 만든다.
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);
*/
  // we added a uniform called vResolution.
 

  render();


};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);
}
