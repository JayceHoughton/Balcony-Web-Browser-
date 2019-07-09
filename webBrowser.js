//File that will contain everything to do with WebBrowsers
var fs = require('fs')
const prompt = require('electron-prompt')

//A List of the Browsing History
let history = []
historyLocation = 0
saveHistory = fs.readFileSync('savedHistory.json')
let savedHistory = JSON.parse(saveHistory)
backgroundFirst = fs.readFileSync('backgroundImage.json')
backgroundPic = JSON.parse(backgroundFirst)
faveFirst = fs.readFileSync('favorites.json')
let savedFavorites = JSON.parse(faveFirst)
let currentPage = ''

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

//Function that handles creating all HTML elements on the webbrowser tab
function webText() {
    //Input feild for web navigation
    webBox = document.createElement("INPUT")
    webBox.setAttribute("type", "text")
    webBox.id = "webBox"
    webBox.className = "webBox"
    webBox.style.position = "absolute"
    boxWidth = canvas.width*0.6
    webBox.style.left = (canvas.width/2) - (boxWidth/1.6) + "px"
    webBox.style.top = parseInt(canvas.height*0.005) + "px"
    webBox.style.width = boxWidth + "px"
    webBox.style.height = canvas.height*0.03 + "px"
    webBox.style.borderRadius = "25px"
    document.getElementById("ui").appendChild(webBox)

    //Go button for above input feild
    webGo = document.createElement("button")
    webGo.style.position = "absolute"
    webGo.id = "webGo"
    webGo.className = "webGo"
    webGo.innerHTML = "GO"
    webGo.style.left = (canvas.width/2) + (boxWidth/2.6) + "px"
    webGo.style.top = parseInt(canvas.height*0.005) + "px"
    webGo.style.height = canvas.height*0.038 + "px"
    webGo.style.width = canvas.width*0.03 + "px"
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

    //Changes the top bar text feild on website navigation so it always displays the current address
    ipcRenderer.on('webpage', (event, arg) => {
        webBox.value = arg
        currentPage = arg
        saveHistory = fs.readFileSync('savedHistory.json')
        savedHistory = JSON.parse(saveHistory)
        if(arg.includes("https://")) {
            savedHistory.push(arg)
            fs.writeFile('savedHistory.json', JSON.stringify(savedHistory), 'utf-8', () => {})
        }
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

    ipcRenderer.on('tab', (event, arg) => {
        updateWebBrowser(arg)
    })

    //Navigates backwards in temporary history. If a user goes backwards and then navigates to a new page
    //the front of the list is chopped off and that page becomes the new front
    backButton = document.createElement("button")
    backButton.style.position = "absolute"
    backButton.id = "backButton"
    backButton.className = "webGo"
    backButton.innerHTML = "&#8592"
    backButton.style.left = (canvas.width/15) + "px"
    backButton.style.top = parseInt(canvas.height*0.005) + "px"
    backButton.style.height = canvas.height*0.038 + "px"
    backButton.style.width = canvas.width*0.025 + "px"
    backButton.style.borderRadius = "10%"
    backButton.onclick = function() {
        if(historyLocation > 0) {
            historyLocation--
            updateWebBrowser(history[historyLocation])
        }
    }
    document.getElementById("ui").appendChild(backButton)

    //Navigates forward in temporary history
    forwardButton = document.createElement("button")
    forwardButton.style.position = "absolute"
    forwardButton.id = "forwardButton"
    forwardButton.className = "webGo"
    forwardButton.innerHTML = "&#8594"
    forwardButton.style.left = (canvas.width/10.5) + "px"
    forwardButton.style.top = parseInt(canvas.height*0.005) + "px"
    forwardButton.style.height = canvas.height*0.038 + "px"
    forwardButton.style.width = canvas.width*0.025 + "px"
    forwardButton.style.borderRadius = "10%"
    forwardButton.onclick = function() {
        if(historyLocation+1 < history.length) {
            historyLocation++
            updateWebBrowser(history[historyLocation])
        }
    }
    document.getElementById("ui").appendChild(forwardButton)

    //Button that goes to the history page which lists all of the users persistent history
    historyButton = document.createElement("button")
    historyButton.style.position = "absolute"
    historyButton.id = "historyButton"
    historyButton.className = "webGo"
    historyButton.innerHTML = "History"
    historyButton.style.left = (canvas.width/2) + (boxWidth/2.28) + "px"
    historyButton.style.top = parseInt(canvas.height*0.005) + "px"
    historyButton.style.height = canvas.height*0.038 + "px"
    historyButton.style.width = canvas.width*0.048 + "px"
    historyButton.style.borderRadius = "10%"
    historyButton.onclick = function() {
        var urL = url.format({pathname: path.join(__dirname, 'historyWindow.html'), protocol: 'file:', slashes: true});
        updateWebBrowser(urL)
    }
    document.getElementById("ui").appendChild(historyButton)

    //Button that displays the help page with some commonly asked questions
    helpButton = document.createElement("button")
    helpButton.style.position = "absolute"
    helpButton.id = "helpButton"
    helpButton.className = "webGo"
    helpButton.innerHTML = "Help"
    helpButton.style.left = (canvas.width/30) + "px"
    helpButton.style.top = parseInt(canvas.height*0.005) + "px"
    helpButton.style.height = canvas.height*0.038 + "px"
    helpButton.style.width = canvas.width*0.03 + "px"
    helpButton.style.borderRadius = "10%"
    helpButton.onclick = function() {
        var urL = url.format({pathname: path.join(__dirname, 'helpWindow.html'), protocol: 'file:', slashes: true});
        updateWebBrowser(urL)
    }
    document.getElementById("ui").appendChild(helpButton)

    //Button that allows the user to change the background image for personalization
    picButton = document.createElement("button")
    picButton.style.position = "absolute"
    picButton.id = "picButton"
    picButton.className = "webGo"
    picButton.innerHTML = "Style"
    picButton.style.left = (canvas.width/2) + (boxWidth/1.91) + "px"
    picButton.style.top = parseInt(canvas.height*0.005) + "px"
    picButton.style.height = canvas.height*0.038 + "px"
    picButton.style.width = canvas.width*0.05 + "px"
    picButton.style.borderRadius = "10%"
    picButton.onclick = function() {
        prompt({
            title: 'Enter Background Image Link',
            label: '',
            value: '',
            inputAttrs: {
                type: 'url'
            }
        })
        .then((r) => {
            if(r === null) {
                //Do nothing, guess they didnt enter something?
            } else {
                console.log('result', r);
                document.getElementById('body').style.backgroundImage = "url('" + r + "')"
                backgroundPic = r
                fs.writeFile('backgroundImage.json', JSON.stringify(backgroundPic), 'utf-8', () => {})
            }
        })
        .catch(console.error);
    }
    document.getElementById("ui").appendChild(picButton)

    //Button that allows the user to favorite their current page
    favoriteButton = document.createElement("button")
    favoriteButton = document.createElement("button")
    favoriteButton.style.position = "absolute"
    favoriteButton.id = "favoriteButton"
    favoriteButton.className = "webGo"
    favoriteButton.innerHTML = "&#9733"
    favoriteButton.style.left = (canvas.width/2) + (boxWidth/1.63) + "px"
    favoriteButton.style.top = parseInt(canvas.height*0.005) + "px"
    favoriteButton.style.height = canvas.height*0.038 + "px"
    favoriteButton.style.width = canvas.width*0.03 + "px"
    favoriteButton.style.borderRadius = "10%"
    favoriteButton.onclick = function() {
        faveFirst = fs.readFileSync('favorites.json')
        savedFavorites = JSON.parse(faveFirst)
        savedFavorites.push(currentPage)
        fs.writeFile('favorites.json', JSON.stringify(savedFavorites), 'utf-8', () => {})
    }
    document.getElementById("ui").appendChild(favoriteButton)

    //Identical to history, but this one displays the list of persistent favorite pages
    favePageButton = document.createElement("button")
    favePageButton = document.createElement("button")
    favePageButton.style.position = "absolute"
    favePageButton.id = "favePageButton"
    favePageButton.className = "webGo"
    favePageButton.innerHTML = "Favorites"
    favePageButton.style.left = (canvas.width/2) + (boxWidth/1.49) + "px"
    favePageButton.style.top = parseInt(canvas.height*0.005) + "px"
    favePageButton.style.height = canvas.height*0.038 + "px"
    favePageButton.style.width = canvas.width*0.062 + "px"
    favePageButton.style.borderRadius = "10%"
    favePageButton.onclick = function() {
        var urL = url.format({pathname: path.join(__dirname, 'favoritesWindow.html'), protocol: 'file:', slashes: true});
        updateWebBrowser(urL)
    }
    document.getElementById("ui").appendChild(favePageButton)
}

//Handles if the user resizes the window
function webResize() {
    resizeBox = document.getElementById("webBox")
    resizeWidth = canvas.width*0.6
    resizeBox.style.left = (canvas.width/2) - (resizeWidth/1.6) + "px"
    resizeBox.style.top = parseInt(canvas.height*0.005) + "px"
    resizeBox.style.width = resizeWidth + "px"
    resizeBox.style.height = canvas.height*0.03 + "px"

    resizeGo = document.getElementById("webGo")
    resizeGo.style.left = (canvas.width/2) + (resizeWidth/2.6) + "px"
    resizeGo.style.top = parseInt(canvas.height*0.005) + "px"
    resizeGo.style.height = canvas.height*0.038 + "px"
    resizeGo.style.width = canvas.width*0.03 + "px"

    resizeBack = document.getElementById("backButton")
    resizeBack.style.left = (canvas.width/15) + "px"
    resizeBack.style.top = parseInt(canvas.height*0.005) + "px"
    resizeBack.style.width = canvas.width*0.025 + "px"
    resizeBack.style.height = canvas.height*0.038 + "px"

    resizeForward = document.getElementById("forwardButton")
    resizeForward.style.left = (canvas.width/10.5) + "px"
    resizeForward.style.top = parseInt(canvas.height*0.005) + "px"
    resizeForward.style.width = canvas.width*0.025 + "px"
    resizeForward.style.height = canvas.height*0.038 + "px"

    resizeHistory = document.getElementById("historyButton")
    resizeHistory.style.left = (canvas.width/2) + (resizeWidth/2.28) + "px"
    resizeHistory.style.top = parseInt(canvas.height*0.005) + "px"
    resizeHistory.style.height = canvas.height*0.038 + "px"
    resizeHistory.style.width = canvas.width*0.048 + "px"

    resizeHelp = document.getElementById("helpButton")
    resizeHelp.style.left = (canvas.width/30) + "px"
    resizeHelp.style.top = parseInt(canvas.height*0.005) + "px"
    resizeHelp.style.width = canvas.width*0.03 + "px"
    resizeHelp.style.height = canvas.height*0.038 + "px"

    resizePic = document.getElementById("picButton")
    resizePic.style.left = (canvas.width/2) + (resizeWidth/1.91) + "px"
    resizePic.style.top = parseInt(canvas.height*0.005) + "px"
    resizePic.style.height = canvas.height*0.038 + "px"
    resizePic.style.width = canvas.width*0.05 + "px"

    resizeFavorite = document.getElementById("favoriteButton")
    resizeFavorite.style.left = (canvas.width/2) + (resizeWidth/1.63) + "px"
    resizeFavorite.style.top = parseInt(canvas.height*0.005) + "px"
    resizeFavorite.style.height = canvas.height*0.038 + "px"
    resizeFavorite.style.width = canvas.width*0.03 + "px"

    resizeFavePage = document.getElementById("favePageButton")
    resizeFavePage.style.left = (canvas.width/2) + (resizeWidth/1.49) + "px"
    resizeFavePage.style.top = parseInt(canvas.height*0.005) + "px"
    resizeFavePage.style.height = canvas.height*0.038 + "px"
    resizeFavePage.style.width = canvas.width*0.062 + "px"

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