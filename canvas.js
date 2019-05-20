//Canvas and UI drawing

canvas = document.getElementById("theCanvas")
ctx = canvas.getContext("2d")
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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

document.getElementById("theCanvas").onclick = function() {
    coordinates = getCanvasMousePosition(canvas, event)
    document.getElementById("panel").innerHTML = "X is: " + coordinates.x + " and Y is: " + coordinates.y
    drawMouseRect(canvas, event)
}