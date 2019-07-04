function webBrowser() {
    webCheck = true
    setPanelNumber(6)
    console.log("HI")
    ctx.beginPath()
    ctx.rect(parseInt(canvas.width*0.035), parseInt(canvas.height*0.05), canvas.width*0.93, canvas.height*0.86)
    ctx.stroke()
    ctx.closePath()
    webWidth = parseInt(canvas.width*0.93)
    webHeight = parseInt(canvas.height*0.86)
    buildWebBrowser(parseInt(canvas.width*0.035), parseInt(canvas.height*0.05), webWidth, webHeight)
}