<<<<<<< Updated upstream
=======
const url = require('url');
const path = require('path');

//Panels array that saves state of all panels
let panels = []

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
        document.removeEventListener('mouseup', endDrawing)
        document.removeEventListener('mousedown', holdCursor)
        

        //We will only draw the panel if its drawn from top corner to bottom corner
        //Mainly makes the math for everything else alot easier to deal with


        //Below for loop checks to make sure the box being drawn does not overlap any other boxes
        notInside = true

        for(let i = 0; i < panels.length; i++)
        {
            if(coordinates.x > panels[i].x && coordinates.x < panels[i].x + panels[i].width && coordinates.y > panels[i].y && coordinates.y < panels[i].y + panels[i].height)
            {
                notInside = false
                break
            }
            else if(leftCorner.y < panels[i].y + panels[i].height && leftCorner.x < panels[i].x + panels[i].width && (coordinates.y > panels[i].y && coordinates.x > panels[i].x))
            {
                notInside = false
                break
            }
        }

        if(coordinates.x > leftCorner.x && coordinates.y > leftCorner.y && notInside == true)
        {
            //Gets the dimensions of the final panel
            panelDims = drawDragRect(canvas, event, leftCorner)
            viewNum = createNewPanel(panelDims.x, panelDims.y, panelDims.width, panelDims.height)
            takeInput(viewNum)

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

function changeCursor(newCursor) {
    canvas.style.cursor = newCursor
}

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
                changeCursor("nw-resize")
                document.removeEventListener('mousedown', whileDrawing)
                break
            }
        }
        //Loop to check if the cursor is in the top left for moving
        else if(coordinates.x > panels[i].x - 5 && coordinates.x < panels[i].x + 5)
        {
            if(coordinates.y > panels[i].y - 5 && coordinates.y < panels[i].y + 5)
            {
                changeCursor("move")
                document.removeEventListener('mousedown', whileDrawing)
                break
            }
        }
        else
        {
            changeCursor("default")
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
                let currPos = i
                let OGPosition = {
                    x: panels[currPos].x,
                    y: panels[currPos].y,
                    width: panels[currPos].width,
                    height: panels[currPos].height
                }
                
                //removing the whileDrawing listener and adding the resize rectangle listener
                //so they dont conflict
                document.removeEventListener('mousedown', whileDrawing)
                document.addEventListener('mousemove', resizeRect)

                //Function to resize the rectangle, made to be called by the event listener
                function resizeRect() {
                    changeCursor("nw-resize")
                    coordinates = getCanvasMousePosition(canvas, event)
                    if(coordinates.x > panels[i].x && coordinates.y > panels[i].y)
                    {
                        resizeRectangle(canvas, event, i)
                    }
                }

                //Function to stop the resize listener when the mouse is released
                //notInside functionality prevent windows from being resized and overlapping each other
                function stopResize() {
                    coordinates = getCanvasMousePosition(canvas, event)
                    let notInside = true
                    for(let i = 0; i < panels.length; i++)
                    {
                        if(coordinates.x > panels[i].x && coordinates.x < panels[i].x + panels[i].width && coordinates.y > panels[i].y && coordinates.y < panels[i].y + panels[i].height)
                        {
                            notInside = false
                            break
                        }
                        else if(OGPosition.x !== panels[i].x && OGPosition.y < panels[i].y + panels[i].height && OGPosition.x < panels[i].x + panels[i].width && (coordinates.y > panels[i].y && coordinates.x > panels[i].x))
                        {
                            notInside = false
                            break
                        }
                    }

                    if(notInside == false)
                    {
                        panels[currPos].x = OGPosition.x
                        panels[currPos].y = OGPosition.y
                        panels[currPos].width = OGPosition.width
                        panels[currPos].height = OGPosition.height
                        //Call to panel function that resizes browser view
                        changePanelDims(panels[currPos].x, panels[currPos].y, panels[currPos].width, panels[currPos].height, panels[currPos].viewNum)

                        ctx.clearRect(0, 0, canvas.width, canvas.height)
                        for(j = 0; j < panels.length; j++)
                        {
                            ctx.beginPath()
                            ctx.rect(panels[j].x, panels[j].y, panels[j].width, panels[j].height)
                            ctx.stroke()
                            ctx.closePath()
                        }
                    }
                    document.removeEventListener('mousemove', resizeRect)
                    document.addEventListener('mousedown', whileDrawing)
                    document.removeEventListener('mouseup', stopResize)
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

                let currPos = i
                let OGPosition = {
                    x: panels[currPos].x,
                    y: panels[currPos].y,
                    width: panels[currPos].width,
                    height: panels[currPos].height
                }

                function moveRect() {
                    changeCursor("move")
                    coordinates = getCanvasMousePosition(canvas, event)
                    moveRectangle(canvas, event, i)
                }

                //Maintains the move cursor while moving
                //Needed due to some lag possibilities
                function holdCursor() {
                    changeCursor("move")
                }

                //removing the whileDrawing listener and adding the move rectangle listener
                //so they dont conflict
                document.removeEventListener('mousedown', whileDrawing)
                document.addEventListener('mousemove', moveRect)
                document.addEventListener('mousedown', holdCursor)

                function stopMove() {
                    //Prevents panels from being placed on to of one another
                    coordinates = getCanvasMousePosition(canvas, event)
                    let notInside = true
                    for(let i = 0; i < panels.length; i++)
                    {
                        if(coordinates.x > panels[i].x && coordinates.x < panels[i].x + panels[i].width && coordinates.y > panels[i].y && coordinates.y < panels[i].y + panels[i].height)
                        {
                            notInside = false
                            break
                        }
                        else if(coordinates.x !== panels[i].x && coordinates.y < panels[i].y + panels[i].height && coordinates.x < panels[i].x + panels[i].width && (panels[currPos].y + panels[currPos].height > panels[i].y && panels[currPos].x + panels[currPos].width > panels[i].x))
                        {
                            notInside = false
                            break
                        }
                    }
                    if(notInside == false)
                    {
                        panels[currPos].x = OGPosition.x
                        panels[currPos].y = OGPosition.y
                        panels[currPos].width = OGPosition.width
                        panels[currPos].height = OGPosition.height
                        //Call to panel function that resizes browser view
                        //This is called too times. Its really janky, but changePanelDims is sometimes inconsisent with actually moving the Browserview
                        //You dont notice this when moving the panel since its called so many times
                        //Calling this twice seems to be enough, but might be safer to call it like 3-4 times
                        //There is probably a more consistent way to ensure that the BrowserView is moved
                        //Jank can be ironed out later
                        changePanelDims(panels[currPos].x, panels[currPos].y, panels[currPos].width, panels[currPos].height, panels[currPos].viewNum)
                        changePanelDims(panels[currPos].x, panels[currPos].y, panels[currPos].width, panels[currPos].height, panels[currPos].viewNum)

                        ctx.clearRect(0, 0, canvas.width, canvas.height)
                        for(j = 0; j < panels.length; j++)
                        {
                            ctx.beginPath()
                            ctx.rect(panels[j].x, panels[j].y, panels[j].width, panels[j].height)
                            ctx.stroke()
                            ctx.closePath()
                        }
                    }
                    document.removeEventListener('mousedown', holdCursor)
                    document.removeEventListener('mousemove', moveRect)
                    document.addEventListener('mousedown', whileDrawing)
                    document.removeEventListener('mouseup', stopMove)
                }
                document.addEventListener('mouseup', stopMove)
            }
        }
    }
}

//Adds a listener for the panel moving function
document.addEventListener('mousedown', movePanel)

function deletePanel() {
    coordinates = getCanvasMousePosition(canvas, event)
>>>>>>> Stashed changes

        //Gets the dimensions of the final panel
        panelDims = drawDragRect(canvas, event, leftCorner)
        createNewPanel(panelDims.x, panelDims.y, panelDims.width, panelDims.height, 'https://www.youtube.com/')
        browserURL();
    }
}

//making a prompt to take input for the website
let addwindow

function browserULR(){
    addWindow = new BrowserWindow({
        width: 300,
        height: 200, 
        title: 'Enter Website'
    });

    addWindow.loadURL(url.format({
        pathname: path.joing(_dirname, 'addWindow.html'),
        protocol: 'file:',
        slases: true
    })); 
}