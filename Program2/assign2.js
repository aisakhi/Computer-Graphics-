"use script";
var vertexShaderText = [
'attribute vec4 vPosition;',
'',
'void main()',
'{',
	'gl_PointSize=1.0;',
	'gl_Position=vPosition;',
'}'
].join('\n');

var fragmentShaderText=[
'precision mediump float;',
'uniform vec4 u_color;','',
'void main()',
'{',
	'gl_FragColor = u_color;',
'}'
].join('\n');

var start;
var request = null;
var gl;
var points;
var NumPoints= " ";
var color=[1,1,1,1];
var red;
var green;
var blue;

function init()
{
	NumPoints = document.getElementById("myRange");
	NumPoints=NumPoints.value;
	document.getElementById("pts").innerHTML = myRange.value;
	console.log('It is working!!!');
	
	red= document.getElementById("red").value;
	green=document.getElementById("green").value;
	blue=document.getElementById("blue").value;
	//status colors
	document.getElementById("re").innerHTML = red;
    document.getElementById("ge").innerHTML = green;
    document.getElementById("be").innerHTML = blue;  
	
	color=[red/256,green/256,blue/256,1];
	
	var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl ){alert("WebGL isn't working"); }
	//create,combine and compile shaders
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader=gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(vertexShader,vertexShaderText);
	gl.shaderSource(fragmentShader,fragmentShaderText);
	gl.compileShader(vertexShader);
	// get an error if code is not working
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        console.error('ERROR compiling vertex shader!' , gl.getShaderInfoLog(vertexShader));
        return;
    }
	gl.compileShader(fragmentShader);
	 if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        console.error('ERROR compiling fragment shader!' , gl.getShaderInfoLog(fragmentShader));
        return;
    }
	var program = gl.createProgram();
	gl.attachShader(program,vertexShader);
	gl.attachShader(program,fragmentShader);
	gl.linkProgram(program);
	if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
		console.error('ERROR LINKING PROGRAM!',gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if(!gl.getProgramParameter(program,gl.VALIDATE_STATUS)){
		console.error('ERROR VALIDATING PROGRAM!',gl.getProgramInfoLog(program));
		return;
	}
	
	var vertices=[
		vec2(-1,-1),
		vec2(0,1),
		vec2(1,-1)
	];
		
		
	var u = add(vertices[0],vertices[1]);
	var v = add(vertices[0],vertices[2]);
	var p = scale(0.25,add(u,v));
	
	points=[p];
	for(var i =0;points.length <NumPoints;i++){
		var j = Math.floor(Math.random() * 3);
		p = add(points[i],vertices[j]);
		p = scale(0.5,p);
		points.push(p);
	}
	
	gl.viewport(0,0,canvas.width*2,canvas.height*2);
	gl.clearColor(1,1,1,1);
	gl.useProgram(program);
	gl.drawArrays(gl.TRIANGLES,0,3);
	
	var bufferId= gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,bufferId);
	gl.bufferData(gl.ARRAY_BUFFER,flatten(points),gl.STATIC_DRAW);
	
	var vPosition = gl.getAttribLocation(program,"vPosition");
	gl.vertexAttribPointer(vPosition,2,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(vPosition);
	var colorLocation = gl.getUniformLocation(program,"u_color");
	gl.uniform4fv(colorLocation,color);
	
}

window.onload=init;
function updateTextInput(NumPoints)
{
	document.getElementById("numpoints").value=NumPoints;
	
}
function resize()
{
	var canvas = document.getElementById("gl-canvas");
	canvas.width = canvas.width/2;
	canvas.height = canvas.height/2;
	gl.clearColor(1,1,1,1);
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
		if(canvas.height <= 10 || canvas.width <= 10)
			{
					canvas.width = 520;
					canvas.height = 520;
			}
}
function render()
{
	request = true;
	if(request == true)
		{
			setTimeout(function(){
				if(request!=false)
				{
					
                    request = requestAnimationFrame(render);
                    init();
					resize();
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                    gl.drawArrays( gl.POINTS, 0, points.length );
                }
				else
					return;
			},1000);
}}
function render1()
{
	request = true;
	if(request == true)
		{
			setTimeout(function(){
				if(request!=false)
				{
					
                    //request = requestAnimationFrame(render1);
                    init();
					//resize();
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                    gl.drawArrays( gl.POINTS, 0, points.length );
                }
				else
					return;
			},1000);
}}
function Display(){
		var canvas = document.getElementById("gl-canvas");
		if(canvas.height < 520 || canvas.width < 520)
			{
					canvas.width = 520;
					canvas.height = 520;
			}
	
	document.getElementById("ani").innerHTML = "Displaying"
	init();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays( gl.POINTS, 0, points.length );
	render1();
}

function Animation()
{
    document.getElementById("ani").innerHTML = "Animation"
	render();
}

function Clear()
{
		document.getElementById("ani").innerHTML = "Clear canvas"
        gl.clearColor(0.0, 0.0,0.0, 0,0); 
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        request = true;
        if (request == true)
        {cancelAnimationFrame(request);
        }
        request = false;
}
function setColor(){
    var colorhex = document.getElementById("colorpick").value;
    var c = colorhex.substring(1).split('');
        if(c.length == 3){
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x'+c.join('');
    var R = (c>>16)&255;
    var G = (c>>8)&255;
    var B = c&255;
    
    document.getElementById("red").value = R;
    document.getElementById("green").value = G;
    document.getElementById("blue").value = B;
    
    color = [R, G, B, 1];

    document.getElementById("re").innerHTML = R;
    document.getElementById("ge").innerHTML = G;
    document.getElementById("be").innerHTML = B;
        
    
}

	
