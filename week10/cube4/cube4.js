
var canvas;
var gl;

var xAxis=0;
var yAxis=1;
var zAxis=2;

var axis=0;
var theta=[0,0,0]

var thetaLoc;

var flag = false;

var points = [];
var colors = [];

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    // create cube(edge length=0.5)
    var myCube=cube(0.5);
    
    // rotate cube in 45 degrees in xAxis, yAxis, zAxis
    myCube.rotate(45,[1,1,1]);
    // translagte cube 0.5 about x,y
    myCube.translate(0.5,0.5,0.0);
    
    // set colors array with TriangleVertexColors array in geometry.js
    colors=myCube.TriangleVertexColors;
    
    // set points array with TrinagleVertices array in geometry.js
    points=myCube.TriangleVertices;

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    // We will do depth test
    gl.enable(gl.DEPTH_TEST);
    //gl.enable(gl.CULL);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Make buffer for color
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    // connect vColor variable in vertex shader with JavaScript
    // and set color
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    // make buffer for vertex's position
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    
    // connect vPosition variable in vertex shader with JavaScript
    // and set position
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta"); 
    
    //event listeners for buttons
    
    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };
    
    document.getElementById( "ButtonT" ).onclick = function () {
        flag=!flag;
    };
        
    render();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // If flag is true, theta increases 2.0
    if(flag){
        theta[axis] += 2.0;
    }
    
    // set theta in vertex shader to theta
    gl.uniform3fv(thetaLoc,theta);
    
    // draw cube
    gl.drawArrays(gl.TRIANGLES,0,points.length);
    
    requestAnimFrame(render);
    
}

