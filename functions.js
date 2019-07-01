const {ipcRenderer, ipcMain, BrowserWindow} = require('electron')

//Function to create new Panels. Takes X and Y positions, Width, Height, and URL. Uses ipcRenderer to signal the main.js file
//to run the createBrowserView function which takes these parameters. x, y, width, height are integers, url is a string.
function createNewPanel(x, y, width, height, url) {
    ipcRenderer.send('makeWindow', {x: x, y: y, width: width, height: height, url: url})
}

<<<<<<< Updated upstream
function createInputPanel(x, y, width, height) {
    
}
=======
function changePanelDims(x, y, width, height, viewNum) {
    ipcRenderer.send('resize', {x: x, y: y, width: width, height: height, viewNum: viewNum})
}

//Function to signal main to delete the panel with the passed view number
function deletePanelDims(viewNum) {
    ipcRenderer.send('delete', viewNum)
}

//Function to signal main to update the panel view that was specified with a given website
function updatePanelWebsite(url, viewNum) {
    ipcRenderer.send('update', {url: url, viewNum: viewNum})
}

//Function to load input html file 
function takeInput(viewNum) {
    var urL = url.format({pathname: path.join(__dirname, 'inputWindow.html'), protocol: 'file:', slashes: true});
    updatePanelWebsite(urL, viewNum)
}
>>>>>>> Stashed changes
