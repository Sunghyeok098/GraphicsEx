
var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    //tag와 관련된것
    gl = WebGLUtils.setupWebGL( canvas );//webgl용 canvas로 바꿔줌
    if ( !gl ) { alert( "WebGL isn't available" ); }

    
    //var vertices = new Float32Array([vec2(-1, -1), vec2(0, 1), vec2(1, -1)]);
    var vertices = [ vec2(-1,-1), vec2(-0.5, 1),vec2(0, -1),vec2(0,-1), vec2(0.5, 1), vec2(1,-1)];
    //var vertices2 = [ vec2(0,-1), vec2(0.5, 1), vec2(1,-1)];
    //  Configure WebGL

    //gl로 canvas를 참조한다. 512*512
    gl.viewport( 0, 0, canvas.width, canvas.height ); //view plane 정의
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 ); // background 정의 black으로
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER,flatten(vertices), gl.STATIC_DRAW );
    //gl.bufferData( gl.ARRAY_BUFFER,flatten(vertices2), gl.STATIC_DRAW );

    // Associate vertex data buffer with shader variables
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 ); //하나의 컴포넌트당 2개의 값을 가진다.
    gl.enableVertexAttribArray( vPosition );

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 6 );
}
