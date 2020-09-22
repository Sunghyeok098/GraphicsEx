var gl;
var points;

window.onload = function init() {
  var canvas = document.getElementById("gl-canvas");
  
  gl = WebGLUtils.setupWebGL(canvas); 
  if (!gl) {
    alert("WebGL isn't available");
  }


  gl.viewport(0, 0, canvas.width, canvas.height); 
  gl.clearColor(0.0, 0.0, 0.0, 1.0); 
  gl.clear(gl.COLOR_BUFFER_BIT);

  
  var program = initShaders(gl, "vertex-shader", "fragment-shader");  //Load shaders and initialize attribute buffers (uniform)
  var program2 = initShaders(gl, "vertex-shader", "fragment-shader1"); //Load shaders and initialize attribute buffers (varying)

  
  gl.useProgram(program); // use program1

  //moon vertex definition
  var moon = [
    vec2(-0.25, 0.79),
    vec2(-0.3, 0.85),
    vec2(-0.25, 0.87),
    vec2(-0.20, 0.85),
    vec2(-0.20, 0.83),
    vec2(-0.20, 0.81),
    vec2(-0.25, 0.79),
    vec2(-0.3, 0.81),
    vec2(-0.3, 0.85),
  ];
  
 
  var bufferId = gl.createBuffer(); //create buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(moon), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var uOffset = gl.getUniformLocation(program, "uOffset"); //load offset
  gl.uniform4fv(uOffset, [0.05, -0.05, 0, 0]); //move vertex with offset

  var uColor = gl.getUniformLocation(program, "uColor"); //load color
  gl.uniform4fv(uColor, [1, 1, 0, 1]); //set vertex color
  
  render2(0, 9); //render

  
  //home vertex definition
  var home = [
    vec2(0.25, 0),
    vec2(0.25, 0.25),
    vec2(0.6, 0.25),
    vec2(0.25, 0),
    vec2(0.6, 0.25),
    vec2(0.6, 0)
  ];


  var bufferId = gl.createBuffer(); //create buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(home), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var uOffset = gl.getUniformLocation(program, "uOffset"); //load offset
  gl.uniform4fv(uOffset, [0, -0.3, 0, 0]); //move vertex with offset

  var uColor = gl.getUniformLocation(program, "uColor"); //load color
  gl.uniform4fv(uColor, [0.5, 0.5, 0.5, 1]); //set vertex color


  render(0,6); //render

  // loof vertex definition
  var loof = [
    vec2(0.15, 0.25),
    vec2(0.425, 0.4),
    vec2(0.7, 0.25),
  ];


  var bufferId = gl.createBuffer(); //create buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(loof), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition"); //load offset
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var uOffset = gl.getUniformLocation(program, "uOffset"); //load offset
  gl.uniform4fv(uOffset, [0, -0.3, 0, 0]); //move vertex with offset

  var uColor = gl.getUniformLocation(program, "uColor");  //load color
  gl.uniform4fv(uColor, [0.2, 0.5, 0.6, 1]);  //set vertex color


  render(0,3);   //render

  //home window vertex definition
  var win = [
    vec2(0.3, 0.1),
    vec2(0.3, 0.2),
    vec2(0.4, 0.2),
    vec2(0.3, 0.1),
    vec2(0.4, 0.2),
    vec2(0.4, 0.1),
  ];


  var bufferId = gl.createBuffer();   //create buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(win), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var uOffset = gl.getUniformLocation(program, "uOffset");   //load offset
  gl.uniform4fv(uOffset, [0, -0.3, 0, 0]);  //move vertex with offset

  var uColor = gl.getUniformLocation(program, "uColor");  //load color
  gl.uniform4fv(uColor, [1, 1, 1, 1]);  //set vertex color


  render(0,6);  //render

  
  gl.useProgram(program2); //use program2

  //mountain vertex definition
  var mount = [
    vec2(-0.95, 0.05),
    vec2(0, 0.05),
    vec2(-0.45, 0.8),
 
  ];

  //each mountain vertex definition
  var mount_color = [
    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(1.0, 1.0, 1.0, 1.0)
  ];


  var bufferId = gl.createBuffer();   //create buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(mount), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program2, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var vertexColorBufferID = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBufferID);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(mount_color), gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program2, "vColor"); //load vColor
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);
  
  render(0,3);   //render

   //mountain vertex definition
  var mount = [
    vec2(-0.35, 0.3),
    vec2(0.7, 0.35),
    vec2(0.2, 0.95),
  ];

  //each mountain vertex definition
  var mount_color = [
    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(1.0, 1.0, 1.0, 1.0)
  ];


  var bufferId = gl.createBuffer();   //create buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(mount), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program2, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var uOffset = gl.getUniformLocation(program2, "uOffset");  //load offset
  gl.uniform4fv(uOffset, [-0.1, -0.15, 0, 0]);  //move vertex with offset

  var vertexColorBufferID = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBufferID);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(mount_color), gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program2, "vColor");  //load vColor
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  render(0,3);//render


  gl.useProgram(program) //use program

  //river vertex definition
  var river = [
    vec2(-1, -0.95),
    vec2(-1, -0.7),
    vec2(1, -0.3),
    vec2(-1, -0.95),
    vec2(1, -0.3),
    vec2(1, -0.7),
  ];


  var bufferId = gl.createBuffer();   //create buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(river), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var uOffset = gl.getUniformLocation(program, "uOffset");  //load offset
  gl.uniform4fv(uOffset, [0, 0, 0, 0]);  //move vertex with offset

  var uColor = gl.getUniformLocation(program, "uColor");  //load color
  gl.uniform4fv(uColor, [0, 0.5, 1, 1]);  //set vertex color


  render(0,6);  //render

  //tree leaf vertex definition
  var leaf = [
    vec2(-0.9, -0.2),
    vec2(-0.8, -0.1),
    vec2(-0.7, -0.2),
    vec2(-0.9, -0.3),
    vec2(-0.8, -0.2),
    vec2(-0.7, -0.3),
    vec2(-0.9, -0.4),
    vec2(-0.8, -0.3),
    vec2(-0.7, -0.4),
  
  ];

  //tree body vertex definition
  var body = [
    vec2(-0.825, -0.5),
    vec2(-0.825, -0.4),
    vec2(-0.775, -0.4),
    vec2(-0.825, -0.5),
    vec2(-0.775, -0.4),
    vec2(-0.775, -0.5),
  ];


  var bufferId = gl.createBuffer();   //create buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(leaf), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var uOffset = gl.getUniformLocation(program, "uOffset");  //load offset
  gl.uniform4fv(uOffset, [0, -0.1, 0, 0]);  //move vertex with offset

  var uColor = gl.getUniformLocation(program, "uColor");  //load color
  gl.uniform4fv(uColor, [0, 1, 0.8, 1]);  //set vertex color

  render(0,9); //render
  gl.bufferData(gl.ARRAY_BUFFER, flatten(body), gl.STATIC_DRAW); 
  gl.uniform4fv(uColor, [0.5, 0.25, 0, 1]);//set vertex color

  render(0,6); //render

  //tree leaf vertex definition
  var leaf = [
    vec2(-0.9, -0.2),
    vec2(-0.8, -0.1),
    vec2(-0.7, -0.2),
    vec2(-0.9, -0.3),
    vec2(-0.8, -0.2),
    vec2(-0.7, -0.3),
    vec2(-0.9, -0.4),
    vec2(-0.8, -0.3),
    vec2(-0.7, -0.4),
  ];

  //tree body vertex definition
  var body = [
    vec2(-0.825, -0.5),
    vec2(-0.825, -0.4),
    vec2(-0.775, -0.4),
    vec2(-0.825, -0.5),
    vec2(-0.775, -0.4),
    vec2(-0.775, -0.5),
  ];


  var bufferId = gl.createBuffer();   //create buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(leaf), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var uOffset = gl.getUniformLocation(program, "uOffset");  //load offset
  gl.uniform4fv(uOffset, [0.25, -0.05, 0, 0]);  //move vertex with offset

  var uColor = gl.getUniformLocation(program, "uColor");  //load color
  gl.uniform4fv(uColor, [0, 1, 0.8, 1]);  //set vertex color

  render(0,9);  //render
  gl.bufferData(gl.ARRAY_BUFFER, flatten(body), gl.STATIC_DRAW);
  gl.uniform4fv(uColor, [0.5, 0.25, 0, 1]);  //set vertex color

  render(0,6);  //render

  //tree leaf vertex definition
  var leaf = [
    vec2(-0.9, -0.2),
    vec2(-0.8, -0.1),
    vec2(-0.7, -0.2),
    vec2(-0.9, -0.3),
    vec2(-0.8, -0.2),
    vec2(-0.7, -0.3),
    vec2(-0.9, -0.4),
    vec2(-0.8, -0.3),
    vec2(-0.7, -0.4),

  ];

  //tree body vertex definition
  var body = [
    vec2(-0.825, -0.5),
    vec2(-0.825, -0.4),
    vec2(-0.775, -0.4),
    vec2(-0.825, -0.5),
    vec2(-0.775, -0.4),
    vec2(-0.775, -0.5),
  ];


  var bufferId = gl.createBuffer();   //create buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(leaf), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var uOffset = gl.getUniformLocation(program, "uOffset");  //load offset
  gl.uniform4fv(uOffset, [0.5, 0, 0, 0]);  //move vertex with offset

  var uColor = gl.getUniformLocation(program, "uColor");  //load color
  gl.uniform4fv(uColor, [0, 1, 0.8, 1]);  //set vertex color

  render(0,9);  //render
  gl.bufferData(gl.ARRAY_BUFFER, flatten(body), gl.STATIC_DRAW);
  gl.uniform4fv(uColor, [0.5, 0.25, 0, 1]);  //set vertex color

  render(0,6);  //render

  //grass vertex definition
  var grass = [
    vec2(0, -0.9),
    vec2(-0.05, -0.8),
    vec2(0, -0.9),
    vec2(0, -0.8),
    vec2(0, -0.9),
    vec2(0.05, -0.8),
  ];

  var bufferId = gl.createBuffer();   //create buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(grass), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var uOffset = gl.getUniformLocation(program, "uOffset");  //load offset
  gl.uniform4fv(uOffset, [0, 0, 0, 0]);  //move vertex with offset

  var uColor = gl.getUniformLocation(program, "uColor");  //load color
  gl.uniform4fv(uColor, [0, 1, 0.8, 1]);  //set vertex color


  render3(0,6);

  //grass vertex definition
  var grass = [
    vec2(0, -0.9),
    vec2(-0.05, -0.8),
    vec2(0, -0.9),
    vec2(0, -0.8),
    vec2(0, -0.9),
    vec2(0.05, -0.8),
  ];

  var bufferId = gl.createBuffer();   //create buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(grass), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var uOffset = gl.getUniformLocation(program, "uOffset");  //load offset
  gl.uniform4fv(uOffset, [0.15, 0.025, 0, 0]);//move vertex with offset

  var uColor = gl.getUniformLocation(program, "uColor");  //load color
  gl.uniform4fv(uColor, [0, 1, 0.8, 1]);  //set vertex color


  render3(0,6);  //render

  //grass vertex definition
  var grass = [
    vec2(0, -0.9),
    vec2(-0.05, -0.8),
    vec2(0, -0.9),
    vec2(0, -0.8),
    vec2(0, -0.9),
    vec2(0.05, -0.8),  
  ];

  var bufferId = gl.createBuffer();   //create buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(grass), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var uOffset = gl.getUniformLocation(program, "uOffset");  //load offset
  gl.uniform4fv(uOffset, [0.3, 0.05, 0, 0]);//move vertex with offset

  var uColor = gl.getUniformLocation(program, "uColor");  //load color
  gl.uniform4fv(uColor, [0, 1, 0.8, 1]);  //set vertex color


  render3(0,6);  //render

 //grass vertex definition
  var grass = [
    vec2(0, -0.9),
    vec2(-0.05, -0.8),
    vec2(0, -0.9),
    vec2(0, -0.8),
    vec2(0, -0.9),
    vec2(0.05, -0.8),
  ];

  var bufferId = gl.createBuffer(); //gpu에 보낼 object를 만든다.
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(grass), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var uOffset = gl.getUniformLocation(program, "uOffset");  //load offset
  gl.uniform4fv(uOffset, [0.45, 0.075, 0, 0]);//move vertex with offset

  var uColor = gl.getUniformLocation(program, "uColor");  //load color
  gl.uniform4fv(uColor, [0, 1, 0.8, 1]);  //set vertex color

  render3(0,6);  //render


};

//rendering triangles function with first and last vertex
function render(first, last) {
  gl.drawArrays(gl.TRIANGLES, first, last);
}

//rendering triangle fan function with first and last vertex
function render2(first, last){
  gl.drawArrays(gl.TRIANGLE_FAN, first, last);
}

//rendering line function with first and last vertex
function render3(first, last){
  gl.drawArrays(gl.LINES, first, last);
}
