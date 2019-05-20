const {ipcRenderer} = require('electron')


//Function to create new Panels. Takes X and Y positions, Width, Height, and URL. Uses ipcRenderer to signal the main.js file
//to run the createBrowserView function which takes these parameters. x, y, width, height are integers, url is a string.
function createNewPanel(x, y, width, height, url) {
    ipcRenderer.send('makeWindow', {x: x, y: y, width: width, height: height, url: url})
}

createNewPanel(0, 0, 500, 500, 'https://google.com/')

createNewPanel(500, 0, 500, 500, 'https://youtube.com/')