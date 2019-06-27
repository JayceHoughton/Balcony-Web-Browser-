var fs = require('fs')

//Panels array that saves state of all panels
savedData = fs.readFileSync('saveData.json')

let panels = JSON.parse(savedData)
let whichPanel = 0

//Canvas and UI drawing

canvas = document.getElementById("theCanvas")
ctx = canvas.getContext("2d")
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawBorder() {
    ctx.beginPath()
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.stroke()
    ctx.closePath()
}

function panelView(input) {
    document.addEventListener('mousedown', whileDrawing)
    document.addEventListener('mousemove', dontDraw)
    document.addEventListener('mousedown', resizePanel)
    document.addEventListener('mousedown', movePanel)
    document.addEventListener('mousedown', deletePanel)
    setPanelNumber(input)
    whichPanel = input
}

function clearView() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    clearPanelView()
    document.removeEventListener('mousedown', whileDrawing)
    document.removeEventListener('mousemove', dontDraw)
    document.removeEventListener('mousedown', resizePanel)
    document.removeEventListener('mousedown', movePanel)
    document.removeEventListener('mousedown', deletePanel)
}

//drawBorder()

//When we resize the window the canvas is cleared, so we need to redraw all panels
window.onresize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    for(i = 0; i < panels[whichPanel].length; i++)
    {
        ctx.beginPath()
        ctx.rect(panels[whichPanel][i].x, panels[whichPanel][i].y, panels[whichPanel][i].width, panels[whichPanel][i].height)
        ctx.stroke()
        ctx.closePath()
    }
    //drawBorder()
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


//Function that makes it so you drag and draw the rectangle
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
    for(i = 0; i < panels[whichPanel].length; i++)
    {
        ctx.beginPath()
        ctx.rect(panels[whichPanel][i].x, panels[whichPanel][i].y, panels[whichPanel][i].width, panels[whichPanel][i].height)
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
    panels[whichPanel][pos].width = rightCorner.x - panels[whichPanel][pos].x
    panels[whichPanel][pos].height = rightCorner.y - panels[whichPanel][pos].y

    //Call to panel function that resizes browser view
    changePanelDims(panels[whichPanel][pos].x, panels[whichPanel][pos].y, panels[whichPanel][pos].width, panels[whichPanel][pos].height, panels[whichPanel][pos].viewNum)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for(i = 0; i < panels[whichPanel].length; i++)
    {
        ctx.beginPath()
        ctx.rect(panels[whichPanel][i].x, panels[whichPanel][i].y, panels[whichPanel][i].width, panels[whichPanel][i].height)
        ctx.stroke()
        ctx.closePath()
    }
}

//Function that modifies the leftcorner value of the panels object
//This will move the panel to a new position
//Must update whole canvas when this happens
function moveRectangle(canvas, event, pos) {
    leftCorner = getCanvasMousePosition(canvas, event)
    panels[whichPanel][pos].x = leftCorner.x
    panels[whichPanel][pos].y = leftCorner.y

    //Call to panel function that moves the browser view
    changePanelDims(panels[whichPanel][pos].x, panels[whichPanel][pos].y, panels[whichPanel][pos].width, panels[whichPanel][pos].height, panels[whichPanel][pos].viewNum)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for(i = 0; i < panels[whichPanel].length; i++)
    {
        ctx.beginPath()
        ctx.rect(panels[whichPanel][i].x, panels[whichPanel][i].y, panels[whichPanel][i].width, panels[whichPanel][i].height)
        ctx.stroke()
        ctx.closePath()
    }
}

//Function to delete a rectangle as well as it's associated view
function deleteRectangle(canvas, event, pos) {
    //Call to delete panel function in functions.js
    deletePanelDims(panels[whichPanel][pos].viewNum)


    //Uses splice to remove element from array
    panels[whichPanel].splice(pos, 1)
    for(i = 0; i < panels[whichPanel].length; i++)
    {
        panels[whichPanel][i].viewNum = i
    }
    fs.writeFile('saveData.json', JSON.stringify(panels), 'utf-8', () => {})

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for(i = 0; i < panels[whichPanel].length; i++)
    {
        ctx.beginPath()
        ctx.rect(panels[whichPanel][i].x, panels[whichPanel][i].y, panels[whichPanel][i].width, panels[whichPanel][i].height)
        ctx.stroke()
        ctx.closePath()
    }
}

function whileDrawing() {

    //Sets the leftcorner of the rectangle to the current mouse position
    let leftCorner = getCanvasMousePosition(canvas, event)

    //This loops checks to make sure the mouse isnt inside of one of the existing panels
    //We do not want to draw new rectangles inside of existing panels
    for(i = 0; i < panels[whichPanel].length; i++)
    {
        if(leftCorner.x > panels[whichPanel][i].x && leftCorner.x < (panels[whichPanel][i].width + panels[whichPanel][i].x))
        {
            if(leftCorner.y > panels[whichPanel][i].y && leftCorner.y < (panels[whichPanel][i].height + panels[whichPanel][i].y))
            {
                return
            }
        }
    }

    //Function to be called by the event listener. Repeatedly calls drawDragRect to redraw rectangle over and over again
    function drawRect() {
        changeCursor("crosshair")
        coordinates = getCanvasMousePosition(canvas, event)
        if(coordinates.x > leftCorner.x && coordinates.y > leftCorner.y)
        {
            drawDragRect(canvas, event, leftCorner)
        }
    }

    function holdCursor() {
        changeCursor("crosshair")
    }

    //Adds lister to mouse movement. Makes it so that drawRect is called repeatedly for dynamic rectangle drawing
    document.addEventListener('mousemove', drawRect)
    document.addEventListener('mousedown', holdCursor)

    //When the mouse is released the final rectangle is drawn
    function endDrawing() {

        //Removes the event listener form mouse movement to stop the rectangle from being repeatedly drawn
        document.removeEventListener('mousemove', drawRect)
        document.removeEventListener('mouseup', endDrawing)
        document.removeEventListener('mousedown', holdCursor)
        

        //We will only draw the panel if its drawn from top corner to bottom corner
        //Mainly makes the math for everything else alot easier to deal with


        //Below for loop checks to make sure the box being drawn does not overlap any other boxes
        notInside = true

        for(let i = 0; i < panels[whichPanel].length; i++)
        {
            if(coordinates.x > panels[whichPanel][i].x && coordinates.x < panels[whichPanel][i].x + panels[whichPanel][i].width && coordinates.y > panels[whichPanel][i].y && coordinates.y < panels[whichPanel][i].y + panels[whichPanel][i].height)
            {
                notInside = false
                break
            }
            else if(leftCorner.y < panels[whichPanel][i].y + panels[whichPanel][i].height && leftCorner.x < panels[whichPanel][i].x + panels[whichPanel][i].width && (coordinates.y > panels[whichPanel][i].y && coordinates.x > panels[whichPanel][i].x))
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
            updatePanelWebsite('https://www.google.com', viewNum)

            //Pushes the finalized panel to the panel array
            panels[whichPanel].push({
                x: panelDims.x,
                y: panelDims.y,
                width: panelDims.width,
                height: panelDims.height,
                viewNum: viewNum
            })
            fs.writeFile('saveData.json', JSON.stringify(panels), 'utf-8', () => {})
        }
        else
        {
            //Get rid of the box drawn while drawing
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            for(i = 0; i < panels[whichPanel].length; i++)
            {
                ctx.beginPath()
                ctx.rect(panels[whichPanel][i].x, panels[whichPanel][i].y, panels[whichPanel][i].width, panels[whichPanel][i].height)
                ctx.stroke()
                ctx.closePath()
            }
        }
    }

    document.addEventListener('mouseup', endDrawing)
}

//Adding the new while drawing listener to the client
//document.addEventListener('mousedown', whileDrawing)

function changeCursor(newCursor) {
    canvas.style.cursor = newCursor
}

//Function to stop the whileDrawing event listener from firing if we are over a corner
function dontDraw() {
    coordinates = getCanvasMousePosition(canvas, event)

    //For loop to loop through panels and check if the mouse position is at the bottom right corner of one of the panels
    for(let i = 0; i < panels[whichPanel].length; i++)
    {
        if(coordinates.x > (panels[whichPanel][i].width + panels[whichPanel][i].x - 5) && coordinates.x < (panels[whichPanel][i].width + panels[whichPanel][i].x + 5))
        {
            if(coordinates.y > (panels[whichPanel][i].height + panels[whichPanel][i].y - 5) && coordinates.y < (panels[whichPanel][i].height + panels[whichPanel][i].y + 5))
            {
                changeCursor("nw-resize")
                document.removeEventListener('mousedown', whileDrawing)
                break
            }
        }
        //Loop to check if the cursor is in the top left for moving
        else if(coordinates.x > panels[whichPanel][i].x - 5 && coordinates.x < panels[whichPanel][i].x + 5)
        {
            if(coordinates.y > panels[whichPanel][i].y - 5 && coordinates.y < panels[whichPanel][i].y + 5)
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

//document.addEventListener('mousemove', dontDraw)


//Function to resize panels that have already been made
function resizePanel() {
    coordinates = getCanvasMousePosition(canvas, event)

    //For loop to loop through panels and check if the mouse position is at the bottom right corner of one of the panels
    for(let i = 0; i < panels[whichPanel].length; i++)
    {
        if(coordinates.x > (panels[whichPanel][i].width + panels[whichPanel][i].x - 5) && coordinates.x < (panels[whichPanel][i].width + panels[whichPanel][i].x + 5))
        {
            if(coordinates.y > (panels[whichPanel][i].height + panels[whichPanel][i].y - 5) && coordinates.y < (panels[whichPanel][i].height + panels[whichPanel][i].y + 5))
            {
                let currPos = i
                let OGPosition = {
                    x: panels[whichPanel][currPos].x,
                    y: panels[whichPanel][currPos].y,
                    width: panels[whichPanel][currPos].width,
                    height: panels[whichPanel][currPos].height
                }
                
                //removing the whileDrawing listener and adding the resize rectangle listener
                //so they dont conflict
                document.removeEventListener('mousedown', whileDrawing)
                document.addEventListener('mousemove', resizeRect)

                //Function to resize the rectangle, made to be called by the event listener
                function resizeRect() {
                    changeCursor("nw-resize")
                    coordinates = getCanvasMousePosition(canvas, event)
                    if(coordinates.x > panels[whichPanel][i].x && coordinates.y > panels[whichPanel][i].y)
                    {
                        resizeRectangle(canvas, event, i)
                    }
                }

                //Function to stop the resize listener when the mouse is released
                //notInside functionality prevent windows from being resized and overlapping each other
                function stopResize() {
                    coordinates = getCanvasMousePosition(canvas, event)
                    let notInside = true
                    for(let i = 0; i < panels[whichPanel].length; i++)
                    {
                        if(coordinates.x > panels[whichPanel][i].x && coordinates.x < panels[whichPanel][i].x + panels[whichPanel][i].width && coordinates.y > panels[whichPanel][i].y && coordinates.y < panels[whichPanel][i].y + panels[whichPanel][i].height)
                        {
                            notInside = false
                            break
                        }
                        else if(OGPosition.x !== panels[whichPanel][i].x && OGPosition.y < panels[whichPanel][i].y + panels[whichPanel][i].height && OGPosition.x < panels[whichPanel][i].x + panels[whichPanel][i].width && (coordinates.y > panels[whichPanel][i].y && coordinates.x > panels[whichPanel][i].x))
                        {
                            notInside = false
                            break
                        }
                    }

                    if(notInside == false)
                    {
                        panels[whichPanel][currPos].x = OGPosition.x
                        panels[whichPanel][currPos].y = OGPosition.y
                        panels[whichPanel][currPos].width = OGPosition.width
                        panels[whichPanel][currPos].height = OGPosition.height
                        //Call to panel function that resizes browser view
                        changePanelDims(panels[whichPanel][currPos].x, panels[whichPanel][currPos].y, panels[whichPanel][currPos].width, panels[whichPanel][currPos].height, panels[whichPanel][currPos].viewNum)

                        ctx.clearRect(0, 0, canvas.width, canvas.height)
                        for(j = 0; j < panels[whichPanel].length; j++)
                        {
                            ctx.beginPath()
                            ctx.rect(panels[whichPanel][j].x, panels[whichPanel][j].y, panels[whichPanel][j].width, panels[whichPanel][j].height)
                            ctx.stroke()
                            ctx.closePath()
                        }
                    }
                    else {
                        fs.writeFile('saveData.json', JSON.stringify(panels), 'utf-8', () => {})
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
//document.addEventListener('mousedown', resizePanel)

//Function to move panels to a new position
//Called by an event listener
//This function works almost identically to the above resize function
//The main difference is that it calls moveRectangle
function movePanel() {
    coordinates = getCanvasMousePosition(canvas, event)

    //For loop to loop through and check if the mouse is in the upper left corner and the user wants to move the panel
    for(let i = 0; i < panels[whichPanel].length; i++)
    {
        if(coordinates.x > panels[whichPanel][i].x - 5 && coordinates.x < panels[whichPanel][i].x + 5)
        {
            if(coordinates.y > panels[whichPanel][i].y - 5 && coordinates.y < panels[whichPanel][i].y + 5)
            {

                let currPos = i
                let OGPosition = {
                    x: panels[whichPanel][currPos].x,
                    y: panels[whichPanel][currPos].y,
                    width: panels[whichPanel][currPos].width,
                    height: panels[whichPanel][currPos].height
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
                    for(let i = 0; i < panels[whichPanel].length; i++)
                    {
                        if(coordinates.x > panels[whichPanel][i].x && coordinates.x < panels[whichPanel][i].x + panels[whichPanel][i].width && coordinates.y > panels[whichPanel][i].y && coordinates.y < panels[whichPanel][i].y + panels[whichPanel][i].height)
                        {
                            notInside = false
                            break
                        }
                        else if(coordinates.x !== panels[whichPanel][i].x && coordinates.y < panels[whichPanel][i].y + panels[whichPanel][i].height && coordinates.x < panels[whichPanel][i].x + panels[whichPanel][i].width && (panels[whichPanel][currPos].y + panels[whichPanel][currPos].height > panels[whichPanel][i].y && panels[whichPanel][currPos].x + panels[whichPanel][currPos].width > panels[whichPanel][i].x))
                        {
                            notInside = false
                            break
                        }
                    }
                    if(notInside == false)
                    {
                        panels[whichPanel][currPos].x = OGPosition.x
                        panels[whichPanel][currPos].y = OGPosition.y
                        panels[whichPanel][currPos].width = OGPosition.width
                        panels[whichPanel][currPos].height = OGPosition.height
                        //Call to panel function that resizes browser view
                        //This is called too times. Its really janky, but changePanelDims is sometimes inconsisent with actually moving the Browserview
                        //You dont notice this when moving the panel since its called so many times
                        //Calling this twice seems to be enough, but might be safer to call it like 3-4 times
                        //There is probably a more consistent way to ensure that the BrowserView is moved
                        //Jank can be ironed out later
                        changePanelDims(panels[whichPanel][currPos].x, panels[whichPanel][currPos].y, panels[whichPanel][currPos].width, panels[whichPanel][currPos].height, panels[whichPanel][currPos].viewNum)
                        changePanelDims(panels[whichPanel][currPos].x, panels[whichPanel][currPos].y, panels[whichPanel][currPos].width, panels[whichPanel][currPos].height, panels[whichPanel][currPos].viewNum)

                        ctx.clearRect(0, 0, canvas.width, canvas.height)
                        for(j = 0; j < panels[whichPanel].length; j++)
                        {
                            ctx.beginPath()
                            ctx.rect(panels[whichPanel][j].x, panels[whichPanel][j].y, panels[whichPanel][j].width, panels[whichPanel][j].height)
                            ctx.stroke()
                            ctx.closePath()
                        }
                    }
                    else {
                        fs.writeFile('saveData.json', JSON.stringify(panels), 'utf-8', () => {})
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
//document.addEventListener('mousedown', movePanel)

function deletePanel() {
    coordinates = getCanvasMousePosition(canvas, event)

    //Loop to check if mouse position is in the top right corner of a panel
    for(let i = 0; i < panels[whichPanel].length; i++)
    {
        if(coordinates.x > panels[whichPanel][i].x + panels[whichPanel][i].width - 5 && coordinates.x < panels[whichPanel][i].x + panels[whichPanel][i].width + 5)
        {
            if(coordinates.y > panels[whichPanel][i].y - 5 && coordinates.y < panels[whichPanel][i].y + 5)
            {
                let currPos = i
                document.removeEventListener("mousedown", deletePanel)
                function deleteThis() {
                    deleteRectangle(canvas, event, currPos)
                    document.removeEventListener("mouseup", deleteThis)
                    document.addEventListener('mousedown', whileDrawing)
                    document.addEventListener("mousedown", deletePanel)
                }
                document.addEventListener("mouseup", deleteThis)
                document.removeEventListener('mousedown', whileDrawing)
            }
        }
    }
}

//document.addEventListener('mousedown', deletePanel)