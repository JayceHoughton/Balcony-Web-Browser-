const {ipcRenderer, ipcMain, BrowserWindow} = require('electron')
const url = require('url');
const path = require('path');


//Function to create new Panels. Takes X and Y positions, Width, Height, and URL. Uses ipcRenderer to signal the main.js file
//to run the createBrowserView function which takes these parameters. x, y, width, height are integers, url is a string.
function createNewPanel(x, y, width, height, url) {
    return ipcRenderer.sendSync('makeWindow', {x: x, y: y, width: width, height: height})
}

function changePanelDims(x, y, width, height, viewNum) {
    ipcRenderer.send('resize', {x: x, y: y, width: width, height: height, viewNum: viewNum})
}

//Function to signal main to delete the panel with the passed view number
function deletePanelDims(viewNum) {
    ipcRenderer.send('delete', viewNum)
}

//Function to update the website contents of a Browserview
function setPanelWebsite(url, viewNum) {
    ipcRenderer.send('set', {url: url, viewNum: viewNum})
}

function updatePanelWebsite(url, viewNum) {
    ipcRenderer.send('update', {url: url, viewNum: viewNum})
}

//Function to clear the panel view for other views
function clearPanelView() {
    ipcRenderer.send('clear')
}

//Function to restore the panel view
function restorePanelView() {
    ipcRenderer.send('restore')
}

//Function to set the panel number used when calling panelView
function setPanelNumber(num) {
    ipcRenderer.send('number', num)
}

//Function to load input html file 
function takeInput(viewNum) {
    var urL = url.format({pathname: path.join(__dirname, 'inputWindow.html'), protocol: 'file:', slashes: true});
    setPanelWebsite(urL, viewNum)
}