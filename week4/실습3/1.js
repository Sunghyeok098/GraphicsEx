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

  gl.clear(gl.COLOR_BUFFER_BIT);
  
  var hexagonVertices = [
    vec2(-0.3, 0.6),
    vec2(-0.4, 0.8),
    vec2(-0.6, 0.8),
    vec2(-0.7, 0.6),
    vec2(-0.6, 0.4),
    vec2(-0.4, 0.4),
    vec2(-0.3, 0.6),
    
  ];

  var triangleVertices = [
    vec2(0.3, 0.4),
    vec2(0.7, 0.4),
    vec2(0.5, 0.8) 
  ];

  var Color = [
    vec4(1.0, 0.0, 0.0, 1.0),
    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(0.0, 0.0, 1.0, 1.0)
  ];

  var stripVertices = [
    vec2(-0.5, 0.2),
    vec2(-0.4, 0.0),
    vec2(-0.3, 0.2),   
    vec2(-0.2, 0.0),
    vec2(-0.1, 0.2),
    vec2(0.0, 0.0),   
    vec2(0.1, 0.2),
    vec2(0.2, 0.0),
    vec2(0.3, 0.2),   
    vec2(0.4, 0.0),
    vec2(0.5, 0.2),

    vec2(-0.5, -0.3),
    vec2(-0.4, -0.5),
    vec2(-0.3, -0.3),   
    vec2(-0.2, -0.5),
    vec2(-0.1, -0.3),
    vec2(0.0, -0.5),   
    vec2(0.1, -0.3),
    vec2(0.2, -0.5),
    vec2(0.3, -0.3),   
    vec2(0.4, -0.5),
    vec2(0.5, -0.3), 

  ];


  var bufferId = gl.createBuffer(); //gpu에 보낼 object를 만든다.
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(hexagonVertices), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  render1(0,7);

  var bufferId = gl.createBuffer(); //gpu에 보낼 object를 만든다.
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(triangleVertices), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var vertexColorBufferID = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBufferID);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(Color), gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  
  gl.enableVertexAttribArray(vColor);

  render(0,3);


  var bufferId = gl.createBuffer(); //gpu에 보낼 object를 만든다.
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(stripVertices), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  
  var vertexColorBufferID = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBufferID);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(Color), gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.disableVertexAttribArray(vColor);
  

  gl.vertexAttrib4f(vColor, 1.0, 1.0, 0.0, 1.0);
  render2(0,11);
  
  gl.vertexAttrib4f(vColor, 0.0, 0.0, 0.0, 1.0);
  render1(0,11);
  render1(11,11);
  


 


  


};

function render(fisrt, count) {
  gl.drawArrays(gl.TRIANGLES, fisrt, count);
}

function render1(fisrt, count) {
  gl.drawArrays(gl.LINE_STRIP, fisrt, count);
}

function render2(fisrt, count) {
  gl.drawArrays(gl.TRIANGLE_STRIP, fisrt, count);
}