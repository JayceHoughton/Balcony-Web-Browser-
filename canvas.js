
//Panels array that saves state of all panels
let panels = []

//Canvas and UI drawing

canvas = document.getElementById("theCanvas")
ctx = canvas.getContext("2d")
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//When we resize the window the canvas is cleared, so we need to redraw all panels
window.onresize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    for(i = 0; i < panels.length; i++)
    {
        ctx.beginPath()
        ctx.rect(panels[i].x, panels[i].y, panels[i].width, panels[i].height)
        ctx.stroke()
        ctx.closePath()
    }
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

//Function to draw the rectangle made by the user dragging the mouse
//Clears and restores canvas each time it is called
//Redraws all finished rectangles which are stored in the panels array
//Returns all information about the current rectangle
function drawDragRect(canvas, event, leftCorner) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for(i = 0; i < panels.length; i++)
    {
        ctx.beginPath()
        ctx.rect(panels[i].x, panels[i].y, panels[i].width, panels[i].height)
        ctx.stroke()
        ctx.closePath()
    }
    rightCorner = getCanvasMousePosition(canvas, event)
    ctx.beginPath()
    ctx.rect(leftCorner.x, leftCorner.y, rightCorner.x - leftCorner.x, rightCorner.y - leftCorner.y)
    ctx.stroke()
    ctx.closePath()

    return {
        x: leftCorner.x,
        y: leftCorner.y,
        width: rightCorner.x - leftCorner.x,
        height: rightCorner.y - leftCorner.y
    }
}


//Function that resizes rectangles
//It will update the panels object at the passed position
//It will then redraw the entire canvas
function resizeRectangle(canvas, event, pos) {
    rightCorner = getCanvasMousePosition(canvas, event)
    panels[pos].width = rightCorner.x - panels[pos].x
    panels[pos].height = rightCorner.y - panels[pos].y

    //Call to panel function that resizes browser view
    changePanelDims(panels[pos].x, panels[pos].y, panels[pos].width, panels[pos].height, panels[pos].viewNum)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for(i = 0; i < panels.length; i++)
    {
        ctx.beginPath()
        ctx.rect(panels[i].x, panels[i].y, panels[i].width, panels[i].height)
        ctx.stroke()
        ctx.closePath()
    }
}

//Function that modifies the leftcorner value of the panels object
//This will move the panel to a new position
//Must update whole canvas when this happens
function moveRectangle(canvas, event, pos) {
    leftCorner = getCanvasMousePosition(canvas, event)
    panels[pos].x = leftCorner.x
    panels[pos].y = leftCorner.y

    //Call to panel function that moves the browser view
    changePanelDims(panels[pos].x, panels[pos].y, panels[pos].width, panels[pos].height, panels[pos].viewNum)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for(i = 0; i < panels.length; i++)
    {
        ctx.beginPath()
        ctx.rect(panels[i].x, panels[i].y, panels[i].width, panels[i].height)
        ctx.stroke()
        ctx.closePath()
    }
}

function whileDrawing() {

    //Sets the leftcorner of the rectangle to the current mouse position
    leftCorner = getCanvasMousePosition(canvas, event)

    //This loops checks to make sure the mouse isnt inside of one of the existing panels
    //We do not want to draw new rectangles inside of existing panels
    for(i = 0; i < panels.length; i++)
    {
        if(leftCorner.x > panels[i].x && leftCorner.x < (panels[i].width + panels[i].x))
        {
            if(leftCorner.y > panels[i].y && leftCorner.y < (panels[i].height + panels[i].y))
            {
                return
            }
        }
    }

    //Function to be called by the event listener. Repeatedly calls drawDragRect to redraw rectangle over and over again
    function drawRect() {
        coordinates = getCanvasMousePosition(canvas, event)
        if(coordinates.x > leftCorner.x && coordinates.y > leftCorner.y)
        {
            drawDragRect(canvas, event, leftCorner)
        }
    }

    //Adds lister to mouse movement. Makes it so that drawRect is called repeatedly for dynamic rectangle drawing
    document.addEventListener('mousemove', drawRect)

    //When the mouse is released the final rectangle is drawn
    function endDrawing() {

        //Removes the event listener form mouse movement to stop the rectangle from being repeatedly drawn
        document.removeEventListener('mousemove', drawRect)
        document.removeEventListener('mouseup', endDrawing)
        

        //We will only draw the panel if its drawn from top corner to bottom corner
        //Mainly makes the math for everything else alot easier to deal with

        if(coordinates.x > leftCorner.x && coordinates.y > leftCorner.y)
        {
            //Gets the dimensions of the final panel
            panelDims = drawDragRect(canvas, event, leftCorner)
            viewNum = createNewPanel(panelDims.x, panelDims.y, panelDims.width, panelDims.height, 'https://www.youtube.com/')

            //Pushes the finalized panel to the panel array
            panels.push({
                x: panelDims.x,
                y: panelDims.y,
                width: panelDims.width,
                height: panelDims.height,
                viewNum: viewNum
            })
        }
        else
        {
            //Get rid of the box drawn while drawing
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            for(i = 0; i < panels.length; i++)
            {
                ctx.beginPath()
                ctx.rect(panels[i].x, panels[i].y, panels[i].width, panels[i].height)
                ctx.stroke()
                ctx.closePath()
            }
        }
    }

    document.addEventListener('mouseup', endDrawing)
}

//Adding the new while drawing listener to the client
document.addEventListener('mousedown', whileDrawing)


//Function to stop the whileDrawing event listener from firing if we are over a corner
function dontDraw() {
    coordinates = getCanvasMousePosition(canvas, event)

    //For loop to loop through panels and check if the mouse position is at the bottom right corner of one of the panels
    for(let i = 0; i < panels.length; i++)
    {
        if(coordinates.x > (panels[i].width + panels[i].x - 5) && coordinates.x < (panels[i].width + panels[i].x + 5))
        {
            if(coordinates.y > (panels[i].height + panels[i].y - 5) && coordinates.y < (panels[i].height + panels[i].y + 5))
            {
                document.removeEventListener('mousedown', whileDrawing)
            }
        }
        else
        {
            document.addEventListener('mousedown', whileDrawing)
        }
    }
}

document.addEventListener('mousemove', dontDraw)


//Function to resize panels that have already been made
function resizePanel() {
    coordinates = getCanvasMousePosition(canvas, event)

    //For loop to loop through panels and check if the mouse position is at the bottom right corner of one of the panels
    for(let i = 0; i < panels.length; i++)
    {
        if(coordinates.x > (panels[i].width + panels[i].x - 5) && coordinates.x < (panels[i].width + panels[i].x + 5))
        {
            if(coordinates.y > (panels[i].height + panels[i].y - 5) && coordinates.y < (panels[i].height + panels[i].y + 5))
            {

                //removing the whileDrawing listener and adding the resize rectangle listener
                //so they dont conflict
                document.removeEventListener('mousedown', whileDrawing)
                document.addEventListener('mousemove', resizeRect)

                //Function to resize the rectangle, made to be called by the event listener
                function resizeRect() {
                    coordinates = getCanvasMousePosition(canvas, event)
                    if(coordinates.x > panels[i].x && coordinates.y > panels[i].y)
                    {
                        resizeRectangle(canvas, event, i)
                    }
                }

                //Function to stop the resize listener when the mouse is released
                function stopResize() {
                    document.removeEventListener('mousemove', resizeRect)
                    document.addEventListener('mousedown', whileDrawing)
                }
                document.addEventListener('mouseup', stopResize)
            }
        }
    }
}

//Adding the new resize listener to the client
document.addEventListener('mousedown', resizePanel)

//Function to move panels to a new position
//Called by an event listener
//This function works almost identically to the above resize function
//The main difference is that it calls moveRectangle
function movePanel() {
    coordinates = getCanvasMousePosition(canvas, event)

    //For loop to loop through and check if the mouse is in the upper left corner and the user wants to move the panel
    for(let i = 0; i < panels.length; i++)
    {
        if(coordinates.x > panels[i].x - 5 && coordinates.x < panels[i].x + 5)
        {
            if(coordinates.y > panels[i].y - 5 && coordinates.y < panels[i].y + 5)
            {
                function moveRect() {
                    coordinates = getCanvasMousePosition(canvas, event)
                    moveRectangle(canvas, event, i)
                }

                //removing the whileDrawing listener and adding the move rectangle listener
                //so they dont conflict
                document.removeEventListener('mousedown', whileDrawing)
                document.addEventListener('mousemove', moveRect)

                function stopMove() {
                    document.removeEventListener('mousemove', moveRect)
                    document.addEventListener('mousedown', whileDrawing)
                }
                document.addEventListener('mouseup', stopMove)

            }
        }
    }
}

//Adds a listener for the panel moving function
document.addEventListener('mousedown', movePanel)