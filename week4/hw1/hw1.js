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
  gl.clearColor(0.0, 0.0, 0.0, 1.0); 
  gl.clear(gl.COLOR_BUFFER_BIT);

  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  var program2 = initShaders(gl, "vertex-shader", "fragment-shader1");

  
  gl.useProgram(program);


  var sun = [
    
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
  
 
  var bufferId = gl.createBuffer(); //gpu에 보낼 object를 만든다.
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(sun), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var uOffset = gl.getUniformLocation(program, "uOffset");
  gl.uniform4fv(uOffset, [0.05, -0.05, 0, 0]);

  var uColor = gl.getUniformLocation(program, "uColor");
  gl.uniform4fv(uColor, [1, 1, 0, 1]);
  
  render2(0, 9);

  
  var home = [
    vec2(0.25, 0),
    vec2(0.25, 0.25),
    vec2(0.6, 0.25),
    vec2(0.25, 0),
    vec2(0.6, 0.25),
    vec2(0.6, 0)
  ];


  var bufferId = gl.createBuffer(); //gpu에 보낼 object를 만든다.
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(home), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var uOffset = gl.getUniformLocation(program, "uOffset");
  gl.uniform4fv(uOffset, [0, -0.3, 0, 0]);

  var uColor = gl.getUniformLocation(program, "uColor");
  gl.uniform4fv(uColor, [0.5, 0.5, 0.5, 1]);


  render(0,6);

  var loof = [
    vec2(0.15, 0.25),
    vec2(0.425, 0.4),
    vec2(0.7, 0.25),
 
  ];


  var bufferId = gl.createBuffer(); //gpu에 보낼 object를 만든다.
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(loof), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var uOffset = gl.getUniformLocation(program, "uOffset");
  gl.uniform4fv(uOffset, [0, -0.3, 0, 0]);

  var uColor = gl.getUniformLocation(program, "uColor");
  gl.uniform4fv(uColor, [0.2, 0.5, 0.6, 1]);


  render(0,3);

  var win = [
    vec2(0.3, 0.1),
    vec2(0.3, 0.2),
    vec2(0.4, 0.2),
    vec2(0.3, 0.1),
    vec2(0.4, 0.2),
    vec2(0.4, 0.1),
  ];


  var bufferId = gl.createBuffer(); //gpu에 보낼 object를 만든다.
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(win), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var uOffset = gl.getUniformLocation(program, "uOffset");
  gl.uniform4fv(uOffset, [0, -0.3, 0, 0]);

  var uColor = gl.getUniformLocation(program, "uColor");
  gl.uniform4fv(uColor, [1, 1, 1, 1]);


  render(0,6);

  
  gl.useProgram(program2);

  var mount = [
    vec2(-0.95, 0.05),
    vec2(0, 0.05),
    vec2(-0.45, 0.8),
 
  ];

  var mount_color = [
    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(1.0, 1.0, 1.0, 1.0)
  ];


  var bufferId = gl.createBuffer(); //gpu에 보낼 object를 만든다.
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(mount), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program2, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var uOffset = gl.getUniformLocation(program, "uOffset");
  gl.uniform4fv(uOffset, [0, 0, 0, 0]);

  var vertexColorBufferID = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBufferID);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(mount_color), gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program2, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);


  //var uColor = gl.getUniformLocation(program, "uColor");
  //gl.uniform4fv(uColor, [0, 1, 0, 1]);

  
  render(0,3);

  var mount = [
    vec2(-0.35, 0.3),
    vec2(0.7, 0.35),
    vec2(0.2, 0.95),
    
 
  ];

  var mount_color = [
    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(1.0, 1.0, 1.0, 1.0)
  ];


  var bufferId = gl.createBuffer(); //gpu에 보낼 object를 만든다.
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(mount), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program2, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var uOffset = gl.getUniformLocation(program2, "uOffset");
  gl.uniform4fv(uOffset, [-0.1, -0.15, 0, 0]);

  var vertexColorBufferID = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBufferID);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(mount_color), gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program2, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);



  render(0,3);


  gl.useProgram(program)

  var river = [
    vec2(-1, -0.95),
    vec2(-1, -0.7),
    vec2(1, -0.3),
    vec2(-1, -0.95),
    vec2(1, -0.3),
    vec2(1, -0.7),
  ];


  var bufferId = gl.createBuffer(); //gpu에 보낼 object를 만든다.
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(river), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var uOffset = gl.getUniformLocation(program, "uOffset");
  gl.uniform4fv(uOffset, [0, 0, 0, 0]);

  var uColor = gl.getUniformLocation(program, "uColor");
  gl.uniform4fv(uColor, [0, 0.5, 1, 1]);


  render(0,6);

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

  var body = [
    vec2(-0.825, -0.5),
    vec2(-0.825, -0.4),
    vec2(-0.775, -0.4),

    vec2(-0.825, -0.5),
    vec2(-0.775, -0.4),
    vec2(-0.775, -0.5),
  
  ];


  var bufferId = gl.createBuffer(); //gpu에 보낼 object를 만든다.
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(leaf), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var uOffset = gl.getUniformLocation(program, "uOffset");
  gl.uniform4fv(uOffset, [0, -0.1, 0, 0]);

  var uColor = gl.getUniformLocation(program, "uColor");
  gl.uniform4fv(uColor, [0, 1, 0.8, 1]);

  render(0,9);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(body), gl.STATIC_DRAW);
  gl.uniform4fv(uColor, [0.5, 0.25, 0, 1]);

  render(0,6);

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

  var body = [
    vec2(-0.825, -0.5),
    vec2(-0.825, -0.4),
    vec2(-0.775, -0.4),

    vec2(-0.825, -0.5),
    vec2(-0.775, -0.4),
    vec2(-0.775, -0.5),
  
  ];


  var bufferId = gl.createBuffer(); //gpu에 보낼 object를 만든다.
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(leaf), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var uOffset = gl.getUniformLocation(program, "uOffset");
  gl.uniform4fv(uOffset, [0.25, -0.05, 0, 0]);

  var uColor = gl.getUniformLocation(program, "uColor");
  gl.uniform4fv(uColor, [0, 1, 0.8, 1]);

  render(0,9);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(body), gl.STATIC_DRAW);
  gl.uniform4fv(uColor, [0.5, 0.25, 0, 1]);

  render(0,6);

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

  var body = [
    vec2(-0.825, -0.5),
    vec2(-0.825, -0.4),
    vec2(-0.775, -0.4),

    vec2(-0.825, -0.5),
    vec2(-0.775, -0.4),
    vec2(-0.775, -0.5),
  
  ];


  var bufferId = gl.createBuffer(); //gpu에 보낼 object를 만든다.
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(leaf), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  var uOffset = gl.getUniformLocation(program, "uOffset");
  gl.uniform4fv(uOffset, [0.5, 0, 0, 0]);

  var uColor = gl.getUniformLocation(program, "uColor");
  gl.uniform4fv(uColor, [0, 1, 0.8, 1]);

  render(0,9);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(body), gl.STATIC_DRAW);
  gl.uniform4fv(uColor, [0.5, 0.25, 0, 1]);

  render(0,6);


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

  var uOffset = gl.getUniformLocation(program, "uOffset");
  gl.uniform4fv(uOffset, [0, 0, 0, 0]);

  var uColor = gl.getUniformLocation(program, "uColor");
  gl.uniform4fv(uColor, [0, 1, 0.8, 1]);


  render3(0,6);

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

  var uOffset = gl.getUniformLocation(program, "uOffset");
  gl.uniform4fv(uOffset, [0.15, 0.025, 0, 0]);

  var uColor = gl.getUniformLocation(program, "uColor");
  gl.uniform4fv(uColor, [0, 1, 0.8, 1]);


  render3(0,6);

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

  var uOffset = gl.getUniformLocation(program, "uOffset");
  gl.uniform4fv(uOffset, [0.3, 0.05, 0, 0]);

  var uColor = gl.getUniformLocation(program, "uColor");
  gl.uniform4fv(uColor, [0, 1, 0.8, 1]);


  render3(0,6);

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

  var uOffset = gl.getUniformLocation(program, "uOffset");
  gl.uniform4fv(uOffset, [0.45, 0.075, 0, 0]);

  var uColor = gl.getUniformLocation(program, "uColor");
  gl.uniform4fv(uColor, [0, 1, 0.8, 1]);


  render3(0,6);

  


};

function render(first, last) {
 
  gl.drawArrays(gl.TRIANGLES, first, last);
}

function render2(first, last){

  gl.drawArrays(gl.TRIANGLE_FAN, first, last);
}

function render3(first, last){

  gl.drawArrays(gl.LINES, first, last);
}
