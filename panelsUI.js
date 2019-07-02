//File that contains the UI that will be persistent between all non-loginscreen views

function bottomBar(input) {
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
        startWidth += canvas.width*percentWidth
    }

    ctx.beginPath()
    ctx.rect(0,canvas.height*0.98,canvas.width,canvas.height-(canvas.height*0.98))
    ctx.fillStyle = "#00bfff"
    ctx.fill()
    ctx.closePath()
}

function checkBox() {
    let mousePosition = getCanvasMousePosition(canvas, event)
    percentWidth = 0.142857
    startWidth = 0
    endWidth = canvas.width*percentWidth
    for(let i = 0; i < 7; i++)
    {
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
        startWidth += canvas.width*percentWidth
    }
}