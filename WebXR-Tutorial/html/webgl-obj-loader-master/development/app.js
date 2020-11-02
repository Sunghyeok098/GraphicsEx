// WebGL context
var gl = {};
// the canvas element
var canvas = null;
// main shader program
var program = null;
// main app object
var app = {};
app.meshes = {};
app.models = {};
app.mvMatrix = mat4.create();
app.mvMatrixStack = [];
app.pMatrix = mat4.create();

function initWebGL(canvas) {
	
   gl = WebGLUtils.setupWebGL( canvas );
   if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    gl.viewport(0, 0, canvas.width, canvas.height);
	
    return gl;
}

function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function setShaders() {
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	
    const attrs = {
        aVertexPosition: OBJ.Layout.POSITION.key,
        aVertexNormal: OBJ.Layout.NORMAL.key,
        aTextureCoord: OBJ.Layout.UV.key,
        aDiffuse: OBJ.Layout.DIFFUSE.key,
        aSpecular: OBJ.Layout.SPECULAR.key,
        aSpecularExponent: OBJ.Layout.SPECULAR_EXPONENT.key
    };

    program.attrIndices = {};
    for (const attrName in attrs) {
        if (!attrs.hasOwnProperty(attrName)) {
            continue;
        }
        program.attrIndices[attrName] = gl.getAttribLocation(program, attrName);
        if (program.attrIndices[attrName] != -1) {
            gl.enableVertexAttribArray(program.attrIndices[attrName]);
        } else {
            console.warn(
                'Shader attribute "' +
                    attrName +
                    '" not found in shader. Is it undeclared or unused in the shader code?'
            );
        }
    }

    program.pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
    program.mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");
    program.nMatrixUniform = gl.getUniformLocation(program, "uNMatrix");

    program.applyAttributePointers = function(model) {
        const layout = model.mesh.vertexBuffer.layout;
        for (const attrName in attrs) {
            if (!attrs.hasOwnProperty(attrName) || program.attrIndices[attrName] == -1) {
                continue;
            }
            const layoutKey = attrs[attrName];
            if (program.attrIndices[attrName] != -1) {
                const attr = layout.attributeMap[layoutKey];
                gl.vertexAttribPointer(
                    program.attrIndices[attrName],
                    attr.size,
                    gl[attr.type],
                    attr.normalized,
                    attr.stride,
                    attr.offset
                );
            }
        }
    };
}

function drawObject(model) {
    /*
     Takes in a model that points to a mesh and draws the object on the scene.
     Assumes that the setMatrixUniforms function exists
     as well as the program has a uniform attribute called "samplerUniform"
     */
    //    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.vertexBuffer);
    program.applyAttributePointers(model);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.mesh.indexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, model.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.copy(copy, app.mvMatrix);
    app.mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (app.mvMatrixStack.length === 0) {
        throw "Invalid popMatrix!";
    }
    app.mvMatrix = app.mvMatrixStack.pop();
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(program.pMatrixUniform, false, app.pMatrix);
    gl.uniformMatrix4fv(program.mvMatrixUniform, false, app.mvMatrix);

    var normalMatrix = mat3.create();
    mat3.normalFromMat4(normalMatrix, app.mvMatrix);
    gl.uniformMatrix3fv(program.nMatrixUniform, false, normalMatrix);
}

function initBuffers() {
    var layout = new OBJ.Layout(
        OBJ.Layout.POSITION,
        OBJ.Layout.NORMAL,
        OBJ.Layout.DIFFUSE,
        OBJ.Layout.UV,
        OBJ.Layout.SPECULAR,
        OBJ.Layout.SPECULAR_EXPONENT
    );

    // initialize the mesh's buffers
    for (var mesh in app.meshes) {
        // Create the vertex buffer for this mesh
        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        var vertexData = app.meshes[mesh].makeBufferData(layout);
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
        vertexBuffer.numItems = vertexData.numItems;
        vertexBuffer.layout = layout;
        app.meshes[mesh].vertexBuffer = vertexBuffer;

        // Create the index buffer for this mesh
        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        var indexData = app.meshes[mesh].makeIndexBufferDataForMaterials(...Object.values(app.meshes[mesh].materialIndices));
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);
        indexBuffer.numItems = indexData.numItems;
        app.meshes[mesh].indexBuffer = indexBuffer;

        // this loops through the mesh names and creates new
        // model objects and setting their mesh to the current mesh
        app.models[mesh] = {};
        app.models[mesh].mesh = app.meshes[mesh];
    }
}

function animate() {
    app.timeNow = new Date().getTime();
    app.elapsed = app.timeNow - app.lastTime;
    if (!app.time) {
        app.time = 0.0;
    }
    app.time += app.elapsed / 1000.0;
    if (app.lastTime !== 0) {
        // do animations
    }
    app.lastTime = app.timeNow;
}

function drawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.perspective(app.pMatrix, 45 * Math.PI / 180.0, gl.viewportWidth / gl.viewportHeight, 0.01, 1000.0);
    mat4.identity(app.mvMatrix);
    // move the camera
    mat4.translate(app.mvMatrix, app.mvMatrix, [0, 0, -5]);
    mat4.rotate(app.mvMatrix, app.mvMatrix, app.time * 0.25 * Math.PI, [0, 1, 0]);
    // set up the scene
    mvPushMatrix();
    drawObject(app.models.suzanne);
    mvPopMatrix();
}

function tick() {
	window.requestAnimationFrame(tick);
    drawScene();
    animate();
}

function webGLStart(meshes) {
    app.meshes = meshes;
    canvas = document.getElementById("mycanvas");
    gl = initWebGL(canvas);
    setShaders();
    initBuffers();
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.enable(gl.DEPTH_TEST);

    tick();
}

window.onload = function() {
    // OBJ.downloadMeshes({
    //     'suzanne': '/development/models/suzanne.obj'
    // }, webGLStart);
    let p = OBJ.downloadModels([
        {
            name: "die",
            obj: "/webgl-obj-loader-master/development/models/die.obj",
            mtl: "/webgl-obj-loader-master/development/models/die.mtl"
        },
        {
            obj: "/webgl-obj-loader-master/development/models/suzanne.obj",
            mtl: true
        } // ,
        // {
        // obj: '/development/models/suzanne.obj'
        // }
    ]);

    p.then(models => {
        for ([name, mesh] of Object.entries(models)) {
            console.log("Name:", name);
            console.log("Mesh:", mesh);
        }
        webGLStart(models);
    });
};
