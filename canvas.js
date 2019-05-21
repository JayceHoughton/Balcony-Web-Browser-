//Canvas and UI drawing

canvas = document.getElementById("theCanvas")
ctx = canvas.getContext("2d")
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.onresize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

//Function to get the position of the mouse on the Canvas
//Takes a Canvas and an event
function getCanvasMousePosition(canvas, event) {
    coordinates = getMousePosition(event)
    bounds = canvas.getBoundingClientRect()
    return {
        x: coordinates.x - bounds.left,
        y: coordinates.y - bounds.top
    }
}

function drawMouseRect(canvas, event) {
    coordinates = getCanvasMousePosition(canvas, event)
    ctx.rect(coordinates.x, coordinates.y, 100, 100)
    ctx.stroke()
}

function drawDragRect(canvas, event, leftCorner) {
    rightCorner = getCanvasMousePosition(canvas, event)
    ctx.beginPath()
    ctx.rect(leftCorner.x, leftCorner.y, rightCorner.x - leftCorner.x, rightCorner.y - leftCorner.y)
    console.log(rightCorner.x - leftCorner.x)
    ctx.stroke()
    ctx.closePath()
    return {
        x: leftCorner.x,
        y: leftCorner.y,
        width: rightCorner.x - leftCorner.x,
        height: rightCorner.y - leftCorner.y
    }
}

/*document.getElementById("theCanvas").onclick = function() {
    coordinates = getCanvasMousePosition(canvas, event)
    document.getElementById("panel").innerHTML = "X is: " + coordinates.x + " and Y is: " + coordinates.y
    drawMouseRect(canvas, event)
}*/

document.getElementById("theCanvas").onmousedown = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    //Sets the leftcorner of the rectangle to the current mouse position
    leftCorner = getCanvasMousePosition(canvas, event)

    //Function to be called by the event listener. Repeatedly calls drawDragRect to redraw rectangle over and over again
    function drawRect() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawDragRect(canvas, event, leftCorner)
    }

    //Adds lister to mouse movement. Makes it so that drawRect is called repeatedly for dynamic rectangle drawing
    document.addEventListener('mousemove', drawRect)

    //When the mouse is released the final rectangle is drawn
    document.getElementById("theCanvas").onmouseup = function() {

        //Removes the event listener form mouse movement to stop the rectangle from being repeatedly drawn
        document.removeEventListener('mousemove', drawRect)

        //Gets the dimensions of the final panel
        panelDims = drawDragRect(canvas, event, leftCorner)
        createNewPanel(panelDims.x, panelDims.y, panelDims.width, panelDims.height, 'https://www.youtube.com/')
    }
}