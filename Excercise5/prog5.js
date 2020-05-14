var canvas = document.getElementById("canvas");
var cpbezier =document.getElementById("cpbezier");
var cphermite = document.getElementById("cphermite");
var clear = document.getElementById("clear");
var cpbspline = document.getElementById("cpbspline");

var i1 = document.getElementById("x1")

function pointx1(value){

return i1;
}
function pointx2(value){
var i2 = document.getElementById("x2").value;
return i2;
}
function pointx3(value){
var i3 = document.getElementById("x3").value;
return i3;
}
function pointx4(value){
var x4 = document.getElementById("x4").value;
return i4;
}
function pointy1(value){
var j1 = document.getElementById("y1").value;
return j1;
}
function pointy2(value){
var j2 = document.getElementById("y2").value;
return j2;
}
function pointy3(value){
var j3 = document.getElementById("y3").value;
return j3;
}
function pointy4(value){
var j4 = document.getElementById("y4").value;
return j4;
}

var context = canvas.getContext("2d");
context.fillStyle = "pink";

// clear canvas

function clearCanvas(){
	context.clearRect(0,0, canvas.width, canvas.height);
}


function cpbez()
  {
	  var c = document.getElementById("canvas");
	  var ctx=c.getContext("2d");
	  ctx.beginPath();
	  ctx.moveTo(40,40);
	  ctx.bezierCurveTo(40,100,200,100,200,40);
	  ctx.stroke();
	  
  }
cpbezier.addEventListener("click",function(){
	cpbez();
},false);

	
function cpher()
{
	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	var p1 = 250;
	var d1 = 350;
	var p2 = 100;
	var d2 = 450;
	var cmpoints = [p1.x,p1.y,d1.x,d1.y,p2.x,p2.y,d2.x,d2.y];
	var tension = 1;
	var tensionFactor = 2*tension;
	var bpoints = [
	p1,
	p1,
	p1 + d1/tensionFactor,
	p1 + d1/tensionFactor,
	p2 - d2/tensionFactor,
	p2 - d2/tensionFactor,
	p2,
	p2,
	]
	ctx.beginPath();
	ctx.moveTo(bpoints[0],bpoints[2]);
	ctx.bezierCurveTo(bpoints[0],bpoints[2],bpoints[4],bpoints[6],bpoints[7],bpoints[2]);
	//alert(bpoints[7]);
	ctx.stroke();
}
cphermite.addEventListener("click",function(){
	cpher();
},false);

canvas.addEventListener("click",getMouse,false);
	

function drawBezier(context, points) {
    console.log("Draw bezier.")
    context.beginPath();
    for (var t = 0; t < 1; t += segment) {
        context.moveTo(
            Math.pow((1 - t), 3) * points[0].x + 3 * t * Math.pow((1 - t), 2) * points[1].x + 3 * Math.pow((t), 2) * (1 - t) * points[2].x + Math.pow(t, 3) * points[3].x,
            Math.pow((1 - t), 3) * points[0].y + 3 * t * Math.pow((1 - t), 2) * points[1].y + 3 * Math.pow(t, 2) * (1 - t) * points[2].y + Math.pow(t, 3) * points[3].y);
        context.lineTo(
            Math.pow((1 - (t + segment)), 3) * points[0].x + 3 * (t + segment) * Math.pow((1 - (t + segment)), 2) * points[1].x + 3 * Math.pow((t + segment), 2) * (1 - (t + segment)) * points[2].x + Math.pow((t + segment), 3) * points[3].x,
            Math.pow((1 - (t + segment)), 3) * points[0].y + 3 * (t + segment) * Math.pow((1 - (t + segment)), 2) * points[1].y + 3 * Math.pow((t + segment), 2) * (1 - (t + segment)) * points[2].y + Math.pow((t + segment), 3) * points[3].y);
    }
    context.stroke();
}

function drawPoint(context, point) {
    context.fillStyle = "rgb(0, 0, 255)";
    context.fillRect(point.x - 2, point.y - 2, 4, 4);
}

function drawLines(context, points) {
    context.fillStyle = "rgb(255,0, 0)";
    context.moveTo(points[0].x, points[0].y);
    context.lineTo(points[1].x, points[1].y);
    context.moveTo(points[1].x, points[1].y);
    context.lineTo(points[2].x, points[2].y);
    context.moveTo(points[2].x, points[2].y);
    context.lineTo(points[3].x, points[3].y);
    context.stroke();
}


var canvas = document.getElementById("canvas");
var ct = canvas.getContext("2d");
var counter = 0;
var segment = 0.001;

function Point(x, y) {
    this.x = x;
    this.y = y;
}

var points = new Array;

function getCursorPosition(e) { // for accurate position count
    var x;
    var y;
    /*if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    }
    else {
      x = e.clientX + document.body.scrollLeft +
           document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop +
           document.documentElement.scrollTop;
    }*/
    x = e.offsetX;
    y = e.offsetY;
    return {
        x: x,
        y: y
    }
}

function getMouse(event) {
    p = getCursorPosition(event);
    points.push(new Point(p.x, p.y));
    drawPoint(ct, points[counter]);
    counter++;
    if (counter == 4) {
        //drawLines(ct, points);
        drawBezier(ct, points);
    }
}
function clearCanvas(){
	context.clearRect(0,0, canvas.width, canvas.height);
}
clear.addEventListener("click", function(){
	clearCanvas();
	mouseCount = 0;
},false);
