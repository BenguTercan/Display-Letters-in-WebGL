
var program;
var gl;
var theta;
var thetaLoc;
var isDirClockwise;
var stop = true;
var distanceLocX;
var distanceLocY;
var distanceX = 0;
var distanceY = 0;
var scaleLocX;
var scaleLocY;
var scaleX = 1;
var scaleY = 1;
var redLoc = 0;
var myRed = 0.2;
var greenLoc = 0;
var myGreen = 0.5;
var blueLoc = 0;
var myBlue = 0.6;


// to describe events we use callback functions = event listeners/handlers
// init() is the callback function because of window.onload -> onload is event
window.onload = function init() { 

  	const canvas = document.querySelector("#glcanvas");
  	// Initialize the GL context
  	gl = WebGLUtils.setupWebGL(canvas); // instead of gl = canvas.getContext("webgl"); -> in webgl-utils
  	// Only continue if WebGL is available and working
  	if (!gl) {
    	alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    	return;
  	}


	program = initShaders (gl, "vertex-shader", "fragment-shader"); // initialize shaders and use that shaders in the program
	gl.useProgram( program ); // can be used shaders to draw anything
	
	
	var myButton1 = document.getElementById("ClockwiseButton"); 
	myButton1.addEventListener("click", 
				function() {isDirClockwise = true;
							stop = false;			});
				
	myButton1.style.position = "absolute";
	myButton1.style.right = "400px";
	myButton1.style.top = "30px";
			
			
	var myButton2 = document.getElementById("NonClockwiseButton"); 
	myButton2.addEventListener("click", 
				function() {isDirClockwise = false;
							stop = false;});
											
	myButton2.style.position = "absolute";
	myButton2.style.left = "1200px";
	myButton2.style.top = "30px";

	
	var menu = document.getElementById("scaleMenu");
	menu.addEventListener("click", function() {
		switch (menu.selectedIndex) {
			case 0:
				if( scaleX > 0.1 && scaleY > 0.1)
				{
					scaleX -= 0.1;
					scaleY -= 0.1;
				}
				break;
			case 1:
				scaleX += 0.1;
				scaleY += 0.1;
				break;
		}
	});

	menu.style.position = "absolute";
	menu.style.right = "290px";
	menu.style.top = "130px";
	
	
	window.addEventListener("keydown", function() {
		switch (event.keyCode) {
			case 37: // left arrow
				distanceX += -0.05;
				break;
			case 39: // right arrow	
			 	distanceX += 0.05;
				break;
			case 38: // up arrow
			 	distanceY += 0.05;
				break;
			case 40: // down arrow
			 	distanceY += -0.05;
				break;
		}
	});
	

	document.getElementById("redSlider").onchange = function() {myRed = this.value;};
	document.getElementById("greenSlider").onchange = function() {myGreen = this.value;};
	document.getElementById("blueSlider").onchange = function() {myBlue = this.value;};


	//initial vertex coordinates of our letters
	var vertices = [ vec2(-0.4, -0.4), vec2(-0.33, -0.4), vec2(-0.33, 0.25), 
					 vec2(-0.4, -0.4),  vec2(-0.33, 0.25), vec2(-0.4, 0.25),
					 vec2(-0.33, 0.25), vec2(-0.33, 0.15), vec2(-0.2, 0.25),
					 vec2(-0.33, 0.15), vec2(-0.2, 0.25), vec2(-0.2, 0.15),
					 vec2(-0.2, 0.25), vec2(-0.2, 0.0), vec2(-0.13, 0.25),
					 vec2(-0.2, 0.0), vec2(-0.13, 0.25), vec2(-0.13, 0.0),
					 vec2(-0.06, 0.0), vec2(-0.33, -0.1), vec2(-0.33, 0.0),
					 vec2(-0.06, 0.0), vec2(-0.33, -0.1), vec2(-0.06, -0.1),
					 vec2(-0.06, -0.1), vec2(-0.13, -0.3), vec2(-0.13, -0.1),
					 vec2(-0.06, -0.1), vec2(-0.13, -0.3), vec2(-0.06, -0.3),
					 vec2(-0.06, -0.3), vec2(-0.33, -0.3), vec2(-0.06, -0.4),
					 vec2(-0.33, -0.3), vec2(-0.06, -0.4), vec2(-0.33, -0.4),
					 
					 vec2(0.06, -0.4), vec2(0.13, -0.4), vec2(0.13, 0.25),
					 vec2(0.06, -0.4), vec2(0.13, 0.25), vec2(0.06, 0.25),
					 vec2(0.13, 0.25), vec2(0.13, 0.05), vec2(0.33, -0.4),
					 vec2(0.13, 0.25), vec2(0.33, -0.4),  vec2(0.33, -0.2),
					 vec2(0.33, -0.4), vec2(0.33, 0.25), vec2(0.4, 0.25),
					 vec2(0.33, -0.4), vec2(0.4, 0.25), vec2(0.4, -0.4) ];


	var bufferId = gl.createBuffer(); // create buffer object on GPU
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId ); // buffer is ready to be used by webgl (bind buffer to the webgl) -> current buffer to use
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW ); // put our data(vertices) in the buffer to be drawn later



	// Associate out shader variables with our data buffer
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition ); // enable the vertex attributes that are in the shaders
	
	thetaLoc = gl.getUniformLocation(program, "theta"); // link the theta in vertex shader with thetaloc in .js file to access theta in the shader
	theta = 0;
	gl.uniform1f(thetaLoc, theta); // send the theta value to the thetaLoc
	// theta is 1 dimensional and float


  	// Set clear color to black, fully opaque
  	gl.clearColor(.75, .55, .85, .8);

	requestAnimFrame(render); // in webgl-utils.js

	};
	
		
	function render() {
		
		gl.clear(gl.COLOR_BUFFER_BIT);
		if(stop == false)
		{
			if (isDirClockwise == true)
			{
				theta += -0.1; // change theta in the program (increment it to have rotation)
				gl.uniform1f(thetaLoc, theta); // send new theta to GPU (update it's value )
				stop = true;
				
			}
			
			if (isDirClockwise == false)
			{
				theta += 0.1; // change theta in the program (increment it to have rotation)
				gl.uniform1f(thetaLoc, theta); // send new theta to GPU (update it's value )
				stop = true;

			}
		}		
			
			distanceLocX = gl.getUniformLocation(program, "distanceX"); // link the distanceX in vertex shader with distanceLocX in .js file to access distanceX in the shader
			gl.uniform1f(distanceLocX, distanceX); // send the distanceX value to the distanceLocX
			// distanceX is 1 dimensional and float

			distanceLocY = gl.getUniformLocation(program, "distanceY"); // link the distanceY in vertex shader with distanceLocY in .js file to access distanceY in the shader
			gl.uniform1f(distanceLocY, distanceY); // send the distanceY value to the distanceLocY
			// distanceY is 1 dimensional and float
			
			scaleLocX = gl.getUniformLocation(program, "scaleX"); // link the scaleX in vertex shader with scaleLocX in .js file to access scaleX in the shader
			gl.uniform1f(scaleLocX, scaleX); // send the scaleX value to the scaleLocX
			
			scaleLocY = gl.getUniformLocation(program, "scaleY"); // link the scaleY in vertex shader with scaleLocY in .js file to access scaleY in the shader
			gl.uniform1f(scaleLocY, scaleY); // send the scaleY value to the scaleLocY
			
			redLoc = gl.getUniformLocation(program, "myRed");
			gl.uniform1f(redLoc, myRed);

			greenLoc = gl.getUniformLocation(program, "myGreen");
			gl.uniform1f(greenLoc, myGreen); 

			blueLoc = gl.getUniformLocation(program, "myBlue");
			gl.uniform1f(blueLoc, myBlue); 


		gl.drawArrays(gl.TRIANGLES, 0, 54); // use 54 points (vertices)
		requestAnimFrame(render);

}


