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


  var vertices = [
   vec2(-0.5, -0.5),
   vec2(-0.5, 0.5),
   vec2(0.5, 0.5),
   vec2(0.5, -0.5),
  ];


  var bufferId = gl.createBuffer(); //gpu에 보낼 object를 만든다.
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  // we added a uniform called vResolution.
  var vResolution = gl.getUniformLocation(program, "vResolution");
  // set the resolution
  gl.uniform2f(vResolution, gl.canvas.width, gl.canvas.height);

  var fColor = gl.getUniformLocation(program, "fColor");

  for(var i=0;i<50;++i){

    setRectangle(gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));
    gl.uniform4f(fColor, Math.random(), Math.random(), Math.random(), 1);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }



};

function randomInt(range){

  return Math.floor(Math.random()*range);
}

function setRectangle(gl, x, y, width, height){

  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1,y1,x2,y1,x1,y2,x1,y2,x2,y1,x2,y2

  ]), gl.STATIC_DRAW)
}

