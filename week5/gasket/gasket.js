var gl;
var points = [];
var NumTimesToSubdivide = 10;

window.onload = function init() {
  var canvas = document.getElementById("gl-canvas");
  //tag와 관련된것
  gl = WebGLUtils.setupWebGL(canvas); //webgl용 canvas로 바꿔줌
  if (!gl) {
    alert("WebGL isn't available");
  }

  


  gl.viewport(0, 0, canvas.width, canvas.height); 
  gl.clearColor(0.0, 0.0, 0.0, 1.0); 


  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  var vertices = [
    vec2(-1, -1),
    vec2(0, 1),
    vec2(1, -1)
  ];

  divideTriangle(vertices[0], vertices[1], vertices[2], NumTimesToSubdivide);



  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);


  

  render();


};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, points.length);
}



function triangle(a, b, c){  
  points.push(a, b, c);
}

function divideTriangle(a, b, c, count){

  if ( count == 0 ) {
    triangle( a, b, c);
  }

  else {
    //bisect the sides
    var ab = mix( a, b, 0.5 );
    var ac = mix( a, c, 0.5 );
    var bc = mix( b, c, 0.5 );
    
    count--;
    // three new triangles
    divideTriangle(a, ab, ac, count);
    divideTriangle(c, ac, bc, count);
    divideTriangle(b, bc, ab, count);
  }
  
}


  
