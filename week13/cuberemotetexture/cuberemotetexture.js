
var canvas;
var gl;

var numVertices  = 36;

var texSize=64;

var program;

var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];

var texCoord=[
    vec2(0,0),
    vec2(0,1),
    vec2(1,1),
    vec2(1,0)
]

var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ), // 0
        vec4( -0.5,  0.5,  0.5, 1.0 ), // 1
        vec4(  0.5,  0.5,  0.5, 1.0 ), // 2
        vec4(  0.5, -0.5,  0.5, 1.0 ), // 3
        vec4( -0.5, -0.5, -0.5, 1.0 ), // 4 
        vec4( -0.5,  0.5, -0.5, 1.0 ), // 5
        vec4(  0.5,  0.5, -0.5, 1.0 ), // 6
        vec4(  0.5, -0.5, -0.5, 1.0 )  // 7
    ];

var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = xAxis;
var theta = [ 0, 0, 0 ];

var modelViewMatrixLoc;

function configureTexture(image){
    texture=gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
    
    // let's assume all images are not a power of 2
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    
    gl.uniform1i(gl.getUniformLocation(program,"texture"),0);
}


function quad(a,b,c,d){
    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    texCoordsArray.push(texCoord[0]);
    
    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[a]);
    texCoordsArray.push(texCoord[1]);
    
    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    texCoordsArray.push(texCoord[2]);
    
    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    texCoordsArray.push(texCoord[0]);
    
    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    texCoordsArray.push(texCoord[2]);
    
    pointsArray.push(vertices[d]);
    colorsArray.push(vertexColors[a]);
    texCoordsArray.push(texCoord[3]);
}

function colorCube()
{
    quad( 1, 0, 3, 2 ); // blue
    quad( 2, 3, 7, 6 ); // yellow
    quad( 3, 0, 4, 7 ); // green
    quad( 6, 5, 1, 2 ); // cyan
    quad( 4, 5, 6, 7 ); // red       
    quad( 5, 4, 0, 1 ); // magenta
}

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.FRONT);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    colorCube();
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    // make buffer for texture and set the buffer to texCoordsArray
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    // link vTexCoord in vertex shader with javascript
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );
    
    //var url="https://cl.staticflickr.com/9/8873/18598400202_3af67ef38f_q.jpg";
    
    // url for image
    var url="https://c1.staticflickr.com/9/8873/18598400202_3af67ef38f_q.jpg";

    
    // make image variable and when image is loaded, set texture
    var image = new Image();
    image.onload=function(){
        configureTexture(image);
    }
    
    image.crossOrigin="";
    image.src=url;
    
    modelViewMatrixLoc=gl.getUniformLocation(program,"modelViewMatrix");
    
    document.getElementById("ButtonX").onclick=function(){
        axis=xAxis;
        theta[axis] += 2.0;
    }
    
    document.getElementById("ButtonY").onclick=function(){
        axis=yAxis;
        theta[axis] += 2.0;
    }
    
    document.getElementById("ButtonZ").onclick=function(){
        axis=zAxis;
        theta[axis] += 2.0;
    }
    
    render();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    var ctm=mat4();
    ctm=mult(ctm,rotate(theta[zAxis],0,0,1)); // rotateZ
    ctm=mult(ctm,rotate(theta[yAxis],0,1,0)); // rotateY
    ctm=mult(ctm,rotate(theta[xAxis],1,0,0)); // rotateX
    gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(ctm));
    gl.drawArrays(gl.TRIANGLES,0,numVertices);
    requestAnimFrame(render);
}

