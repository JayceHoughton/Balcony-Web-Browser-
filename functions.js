const {ipcRenderer} = require('electron')


//Function to create new Panels. Takes X and Y positions, Width, Height, and URL. Uses ipcRenderer to signal the main.js file
//to run the createBrowserView function which takes these parameters. x, y, width, height are integers, url is a string.
function createNewPanel(x, y, width, height, url) {
    return ipcRenderer.sendSync('makeWindow', {x: x, y: y, width: width, height: height, url: url})
}

function changePanelDims(x, y, width, height, viewNum) {
    ipcRenderer.send('resize', {x: x, y: y, width: width, height: height, viewNum: viewNum})
}