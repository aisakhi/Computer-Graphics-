var canvas;
var gl;

var numVertices  = 54;

var points = [];
var colors = [];

var pointsArray = [];
var colorsArray = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];
var eye;
var thetaLoc;
var near = -1;
var far = 1;
var radius = 1;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -1.0;
var right = 1.0;
var ytop = 1.0;
var bottom = -1.0;


var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);
//var flag = false;
var canvas = document.getElementById( "gl-canvas" );
  
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    colorCube();
	colorTriangle();
	ctx = canvas.getContext("2d");
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);
	
    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
  
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
 
	var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
	 
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
  
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
  
 
	modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
	
    thetaLoc = gl.getUniformLocation(program, "theta"); 
    
    //event listeners for buttons
    
   document.getElementById("depthSlider").onchange = function(event) {
        far = event.target.value/2;
        near = -event.target.value/2;
    };

    document.getElementById("radiusSlider").onchange = function(event) {
       radius = event.target.value;
    };
    document.getElementById("thetaSlider").onchange = function(event) {
        theta = event.target.value* Math.PI/180.0;
    };
    document.getElementById("phiSlider").onchange = function(event) {
        phi = event.target.value* Math.PI/180.0;
    };
    document.getElementById("heightSlider").onchange = function(event) {
        ytop = event.target.value/2;
        bottom = -event.target.value/2;
    };
    document.getElementById("widthSlider").onchange = function(event) {
        right = event.target.value/2;
        left = -event.target.value/2;
    };
	
    render();
}

  function transFront(value) {
    document.getElementById("trans").value=value;
	var f = document.getElementById("z").value;
	var z=document.getElementById("y").value;
    var x = value;
    var y="translate3d("+x+"px,"+z+"px,"+f+"px)";
    document.getElementById("gl-canvas").style.transform = y;
	return y;
  }
  
  function transyFront(value) {
    document.getElementById("y").value=value;
	var x = document.getElementById("trans").value;
	
	var f =document.getElementById("z").value;
 
    var z = value;
    var y="translate3d("+x+"px,"+z+"px,"+f+"px)";
    document.getElementById("gl-canvas").style.transform = y;
  }
  
  function transzFront(value) {
    document.getElementById("z").value=value;
	
    var x = document.getElementById("trans").value;
	
	var f =document.getElementById("y").value;
    var z = value;
    var y="translateZ("+x+"px,"+f+"px,"+z+"px)";
    document.getElementById("gl-canvas").style.transform = y;
  }


function colorCube()
{
    quad( 1, 0, 3, 2 ); // front
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


function quad(a, b, c, d) 
{
    var vertices = [
        vec4( -0.25, -0.25,  0.25, 1.0 ), // <---
        vec4( -0.25,  0.25,  0.25, 1.0 ), // <---
        vec4(  0.25,  0.25,  0.25, 1.0 ), // <---
        vec4(  0.25, -0.25,  0.25, 1.0 ), // <---
        vec4( -0.25, -0.25, -0.25, 1.0 ),
        vec4( -0.25,  0.25, -0.25, 1.0 ),
        vec4(  0.25,  0.25, -0.25, 1.0 ),
        vec4(  0.25, -0.25, -0.25, 1.0 )
    ];


    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, .25 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    
    //vertex color assigned by the index of the vertex
    
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        //colors.push( vertexColors[indices[i]] );
    
        // for solid colored faces use 
        colors.push(vertexColors[a]);
        
    }
}


function colorTriangle()
{
    triangle( 0, 1, 2, 0 ); // triangle - black
    triangle( 3, 4, 5, 1 ); // triangle - green
    triangle( 0, 3, 2, 2 ); // quad
    triangle( 2, 3, 5, 2 ); // quad - red
    triangle( 1, 0, 3, 3 ); // quad
    triangle( 1, 4, 3, 3 ); // quad - blue
    
} // 4 surfaces


function triangle(a, b, c, surface_number) 
{
	// x y z ?
    var vertices = [
        vec4(  0.0,  1.0/2,  0.25, 1.0 ), // 0 <---
        vec4( -0.25,  0.25,  0.25, 1.0 ), // 1 <---
        vec4(  0.25,  0.25,  0.25, 1.0 ), // 2 <---
        vec4(  0.0,  1.0/2, -0.25, 1.0 ), // 3 <---
        vec4( -0.25,  0.25, -0.25, 1.0 ), // 4 <---
        vec4(  0.25,  0.25, -0.25, 1.0 )  // 5 <---
    ];

	var vertexColors = [
        [ 0.0, 0.4, 0.8, 1.0 ],  // black
        [ 0.0, 0.8, 0.4, 1.0 ],  // green
        [ 0.8, 0.0, 0.0, .50 ],  // red
        [ 0.0, 0.0, 0.8, 1.0 ]   // blue
    ];

    // We need to partition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    
    //vertex color assigned by the index of the vertex
    
    var indices = [ a, b, c ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
//         colors.push( vertexColors[indices[i]] );
    
        // for solid colored faces use 
        colors.push(vertexColors[surface_number]);
        
    }

}


var render = function()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius*Math.sin(phi), radius*Math.sin(theta),
             radius*Math.cos(phi));

    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);

        gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
	
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
	
    requestAnimFrame( render );
}

