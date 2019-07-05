//File that will contain everything to do with WebBrowsers

//A List of the Browsing History
let history = []
historyLocation = 0

//Function that handles all webBrowser events
function webBrowser() {
    webCheck = true
    setPanelNumber(6)
    ctx.beginPath()
    ctx.rect(parseInt(canvas.width*0.035), parseInt(canvas.height*0.05), canvas.width*0.93, canvas.height*0.86)
    ctx.stroke()
    ctx.closePath()
    webWidth = parseInt(canvas.width*0.93)
    webHeight = parseInt(canvas.height*0.86)
    buildWebBrowser(parseInt(canvas.width*0.035), parseInt(canvas.height*0.05), webWidth, webHeight)
    webText()
}

//Functoin that handles the web top bar and input go button
function webText() {
    webBox = document.createElement("INPUT")
    webBox.setAttribute("type", "text")
    webBox.id = "webBox"
    webBox.className = "webBox"
    webBox.style.position = "absolute"
    boxWidth = canvas.width*0.75
    webBox.style.left = (canvas.width/2) - (boxWidth/2) + "px"
    webBox.style.top = parseInt(canvas.height*0.005) + "px"
    webBox.style.width = boxWidth + "px"
    webBox.style.height = canvas.height*0.03 + "px"
    webBox.style.borderRadius = "25px"
    document.getElementById("ui").appendChild(webBox)

    webGo = document.createElement("button")
    webGo.style.position = "absolute"
    webGo.id = "webGo"
    webGo.className = "webGo"
    webGo.innerHTML = "GO"
    webGo.style.left = (canvas.width/2) + (boxWidth/1.95) + "px"
    webGo.style.top = parseInt(canvas.height*0.005) + "px"
    webGo.style.height = canvas.height*0.038 + "px"
    webGo.style.borderRadius = "5px"
    webGo.onclick = function() {
        changeWebsite()
    }
    //Makes it so you can press enter intead of having to click GO
    webBox.addEventListener("keyup", function(event) {
        if(event.keyCode === 13)
        {
            event.preventDefault()
            webGo.click()
        }
    })
    document.getElementById("ui").appendChild(webGo)

    ipcRenderer.on('webpage', (event, arg) => {
        webBox.value = arg
        if((historyLocation === history.length-1 || history.length === 0) && history[historyLocation] !== arg)
        {
            history.push(arg)
            historyLocation = history.length-1
        }
        else {
            if(history.length > 0 && arg !== history[historyLocation])
            {
                history.splice(historyLocation+1, history.length, arg)
                historyLocation = history.length-1
            }
        }
    })

    backButton = document.createElement("button")
    backButton.style.position = "absolute"
    backButton.id = "backButton"
    backButton.className = "webGo"
    backButton.innerHTML = "&#8592"
    backButton.style.left = (canvas.width/30) + "px"
    backButton.style.top = parseInt(canvas.height*0.005) + "px"
    backButton.style.height = canvas.height*0.038 + "px"
    backButton.style.width = canvas.width*0.04 + "px"
    backButton.style.borderRadius = "10%"
    backButton.onclick = function() {
        if(historyLocation > 0) {
            historyLocation--
            updateWebBrowser(history[historyLocation])
        }
    }
    document.getElementById("ui").appendChild(backButton)

    forwardButton = document.createElement("button")
    forwardButton.style.position = "absolute"
    forwardButton.id = "forwardButton"
    forwardButton.className = "webGo"
    forwardButton.innerHTML = "&#8594"
    forwardButton.style.left = (canvas.width/13) + "px"
    forwardButton.style.top = parseInt(canvas.height*0.005) + "px"
    forwardButton.style.height = canvas.height*0.038 + "px"
    forwardButton.style.width = canvas.width*0.04 + "px"
    forwardButton.style.borderRadius = "10%"
    forwardButton.onclick = function() {
        if(historyLocation+1 < history.length) {
            historyLocation++
            updateWebBrowser(history[historyLocation])
        }
    }
    document.getElementById("ui").appendChild(forwardButton)
}

//Handles if the user resizes the window
function webResize() {
    resizeBox = document.getElementById("webBox")
    resizeWidth = canvas.width*0.75
    resizeBox.style.left = (canvas.width/2) - (resizeWidth/2) + "px"
    resizeBox.style.top = parseInt(canvas.height*0.005) + "px"
    resizeBox.style.width = resizeWidth + "px"
    resizeBox.style.height = canvas.height*0.03 + "px"

    resizeGo = document.getElementById("webGo")
    resizeGo.style.left = (canvas.width/2) + (resizeWidth/1.95) + "px"
    resizeGo.style.top = parseInt(canvas.height*0.005) + "px"
    resizeGo.style.height = canvas.height*0.038 + "px"

    resizeBack = document.getElementById("backButton")
    resizeBack.style.left = (canvas.width/30) + "px"
    resizeBack.style.top = parseInt(canvas.height*0.005) + "px"
    resizeBack.style.width = canvas.width*0.04 + "px"
    resizeBack.style.height = canvas.height*0.038 + "px"

    resizeForward = document.getElementById("forwardButton")
    resizeForward.style.left = (canvas.width/13) + "px"
    resizeForward.style.top = parseInt(canvas.height*0.005) + "px"
    resizeForward.style.width = canvas.width*0.04 + "px"
    resizeForward.style.height = canvas.height*0.038 + "px"

}

//Handles what to do when the website is changed via the top input bar
function changeWebsite() {
    userWeb = document.getElementById("webBox").value

    if (!userWeb.includes("https://") && userWeb.includes(".com") || userWeb.includes(".net") || userWeb.includes(".org") || userWeb.includes(".io") || userWeb.includes(".gov") || userWeb.includes(".edu") || userWeb.includes(".tv")) {
        userWeb = "https://" + userWeb;
    }
    if(userWeb.includes(".com") || userWeb.includes(".net") || userWeb.includes(".org") || userWeb.includes(".io") || userWeb.includes(".gov") || userWeb.includes(".edu") || userWeb.includes(".tv")) {
        updateWebBrowser(userWeb)
    }
    else
    {
        updateWebBrowser("https://www.google.com/search?q=" + userWeb)
    }


}