"use strict";

var gl;
var points;

// initializing our data to control the number of points, image size and the number of iterations
var NumPoints = 5000;
var changingImage = 0;
var iterations = 0;
var interval;
function init()
{
    //resetting the number of points and the size of the image after 10 iterations
    if(NumPoints < 500){
        changingImage=0;
        NumPoints = 5000;
    }
    changingImage+=1;
    var canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 )
    ];

    //setting an array of 10 colors to select one for a triangle on every iteration
    var colors = [
		
		vec4(0.0, 0.0, 0.0, 1.0),
		vec4(0,0.5,0.6,1.0),
        vec4(1.0, 0.5, 0.0, 1.0),
        vec4(0.0, 1.0, 0.1, 1.0),
        vec4(0.0, 0.6, 1.0, 1.0),
        vec4(1.0, 0.0, 1.0, 1.0),
        vec4(0.5, 0.5, 0.0, 1.0),
        vec4(0.0, 0.5, 0.5, 1.0),
        vec4(0.5, 0.0, 0.5, 1.0),
        vec4(0.5, 0.1, 0.1, 1.0)
		
    ]

    // Specify a starting point p for our iterations
    // p must lie inside any set of three vertices

    var u = add( vertices[0], vertices[1] );
    var v = add( vertices[0], vertices[2] );
    var p = scale( 0.25, add( u, v ) );

    // And, add our initial point into our array of points

    points = [ p ];

    // Compute new points
    // Each new point is located midway between
    // last point and a randomly chosen vertex
        for ( var i = 0; points.length < NumPoints; ++i ) {
            var j = Math.floor(Math.random() * 3);
            p = add( points[i], vertices[j] );
            p = scale( 0.5, p );
            points.push( p );
        }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width * Math.pow(0.8,changingImage - 1),canvas.width * Math.pow(0.8,changingImage - 1));
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    
    //  create, compile, attach, link, Load shaders and initialize attribute buffers

    var vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader,[
        'attribute vec4 vPosition;',
        'void main() {',
            'gl_PointSize = 1.0;',
            'gl_Position = vPosition;',
        '}'
    ].join('\n'));
    gl.compileShader(vertexShader)
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragmentShader,[
        'precision mediump float;',
        'uniform vec4 color;',
        'void main() {',
        'gl_FragColor = color;',
        '}'
    ].join('\n'));
    gl.compileShader(fragmentShader);
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram( program );
    
     program.color = gl.getUniformLocation(program,'color');
     gl.uniform4fv(program.color,colors[changingImage - 1]);

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    render();

    NumPoints -= 500;
    iterations++;
    if (iterations > 50)
        clearInterval(interval);
};

window.onload = init;

// call the init function on every 1000 ms to render the triangle with the updated parameters
interval = setInterval(init, 1000);


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    //gl.drawArrays( gl.POINTS, 0, points.length );
    gl.drawArrays( gl.POINTS, 0, NumPoints );
}
