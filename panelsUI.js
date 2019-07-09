//File that contains the UI that will be persistent between all non-loginscreen views
var fs = require('fs')

premiumCheck = fs.readFileSync('premiumCheck.json')
isPremium = "False"
try {
    isPremium = JSON.parse(premiumCheck)
    } catch {
        isPremium = "False"
        fs.writeFile('premiumCheck.json', JSON.stringify(isPremium), 'utf-8', () => {})
}

//Function that handles drawing the bottom bar. Takes an input which tells it which
//part of the bottom bar to highlight, and also which bars to write premium on based on user level
function bottomBar(input) {
    premiumCheck = fs.readFileSync('premiumCheck.json')
    isPremium = JSON.parse(premiumCheck)
    percentWidth = 0.142857
    startWidth = 0
    endWidth = canvas.width*percentWidth
    for(i = 0; i < 7; i++)
    {
        ctx.beginPath()
        ctx.rect(startWidth,canvas.height*0.93,endWidth,canvas.height*0.07)
        if(i==input) {
            ctx.fillStyle = "#00bfff"
            ctx.fill()
        }
        else {
            ctx.stroke()
            ctx.fillStyle = "#b3ecff"
            ctx.fill()
        }
        ctx.closePath()
        ctx.font = "25px Impact"
        ctx.fillStyle = "#00bfff"
        panelNum = i+1
        if(isPremium === "False" && i !== 0 && i !== 6)
        {
            ctx.fillText("Premium", startWidth, canvas.height*0.98)
        }
        if(i == 6)
        {
            ctx.fillText("Browser", startWidth, canvas.height*0.98)
        }
        startWidth += canvas.width*percentWidth
    }

    ctx.beginPath()
    ctx.rect(0,canvas.height*0.98,canvas.width,canvas.height-(canvas.height*0.98))
    ctx.fillStyle = "#00bfff"
    ctx.fill()
    ctx.closePath()
}

//Function for checking if the mouse is clicking one of the bottom bar buttons
//Changes which panel view is being displayed, or if we are in the web browser view based on click
//Makes panels 2-5 unclickable if the user is not a premium user
function checkBox() {
    premiumCheck = fs.readFileSync('premiumCheck.json')
    isPremium = JSON.parse(premiumCheck)
    let mousePosition = getCanvasMousePosition(canvas, event)
    percentWidth = 0.142857
    startWidth = 0
    endWidth = canvas.width*percentWidth
    for(let i = 0; i < 7; i++)
    {
        if((isPremium === "False" && (i === 0 || i === 6)) || isPremium === "True") {
            if(mousePosition.y > canvas.height*0.93 && mousePosition.x > startWidth && mousePosition.x < (startWidth+endWidth))
            {
                document.removeEventListener('mousedown', checkBox)
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                for(j = 0; j < panels[whichPanel].length; j++)
                {
                    ctx.beginPath()
                    ctx.rect(panels[whichPanel][j].x, panels[whichPanel][j].y, panels[whichPanel][j].width, panels[whichPanel][j].height)
                    ctx.stroke()
                    ctx.closePath()
                }
                clearView()
                bottomBar(i)
                if(i < 6)
                {
                    panelView(i)
                }
                else {
                    webBrowser()
                }
                document.addEventListener('mousedown', checkBox)
            }
        }
        startWidth += canvas.width*percentWidth
    }
}