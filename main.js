const { app, BrowserWindow, BrowserView, session, ipcMain } = require('electron')
var fs = require('fs')

let win
let ses
let view

//Window Position is used to keep track of linking the Browser View to its corresponding Panel in canvas
let windowPos = 0
let panelNum = 0

//Webpages and View Data are stored to JSON file for persistent storage
webpages = fs.readFileSync('savedWebpages.json')
viewData = fs.readFileSync('savedViewData.json')
let savedViewData = JSON.parse(viewData)
let savedWebsites = JSON.parse(webpages)
let viewArr = []

function createWindow() {
  win = new BrowserWindow({ width: 1500, height: 800, fullscreenable: false, webPreferences: { webviewTag: true, nodeIntegration: true, plugins: true } })

  win.setMenu(null)

  win.loadFile('index.html')

  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}

//Creates a BrowserView using infromation provided from renderer signal
function createBrowserView(x, y, width, height) {
  view = new BrowserView({ webPreferences: { plugins: true } })
  viewArr.push(view)
  win.addBrowserView(view)
  view.setBounds({ x: x, y: y, width: width, height: height })
  savedViewData[panelNum].push({ x: x, y: y, width: width, height: height })
  //view.setAutoResize({width: false, height: true})
  //view.webContents.loadURL(url)
}

//Function to resize the passed Browser View
function resizeBrowserView(x, y, width, height, viewNum) {
  viewArr[viewNum].setBounds({ x: x, y: y, width: width, height: height })
  savedViewData[panelNum][viewNum].x = x
  savedViewData[panelNum][viewNum].y = y
  savedViewData[panelNum][viewNum].width = width
  savedViewData[panelNum][viewNum].height = height
}

//Function to delete the passed Browser View
function deleteBrowserView(viewNum) {
  viewArr[viewNum].destroy()
  viewArr.splice(viewNum, 1)
  savedViewData[panelNum].splice(viewNum, 1)
  savedWebsites[panelNum].splice(viewNum, 1)
  windowPos = 0
  for(i = 0; i < savedWebsites[panelNum].length; i++)
  {
    savedWebsites[panelNum][i].viewNum = i
    windowPos++
  }
}

function setBrowserView(url, viewNum) {
  viewArr[viewNum].webContents.loadURL(url)
  savedWebsites[panelNum].push({ url: url, viewNum: viewNum })
}

function updateBrowserView(url, viewNum) {
  //viewArr[viewNum].webContents.loadURL(url)
  savedWebsites[panelNum][viewNum].url = url
}

function destroyViews() {
  
  for(let i = 0; i < viewArr.length; i++)
  {
    updateBrowserView(viewArr[i].webContents.getURL(), i)
    viewArr[i].destroy()
  }
  viewArr.length = 0
  windowPos = 0

  fs.writeFile('savedViewData.json', JSON.stringify(savedViewData), 'utf-8', () => { })
  fs.writeFile('savedWebpages.json', JSON.stringify(savedWebsites), 'utf-8', () => { })
}

function restoreViews() {
  for (i = 0; i < savedViewData[panelNum].length; i++) {
    view = new BrowserView({ webPreferences: { plugins: true } })
    viewArr.push(view)
    win.addBrowserView(view)
    view.setBounds({ x: savedViewData[panelNum][i].x, y: savedViewData[panelNum][i].y, width: savedViewData[panelNum][i].width, height: savedViewData[panelNum][i].height })
    view.webContents.loadURL(savedWebsites[panelNum][i].url)
  }
}

function setPanelNum(num) {
  /*for(i = 0; i < viewArr.length; i++)
  {
    viewArr[i].destroy()
  }
  viewArr.length = 0*/
  panelNum = num
  for (i = 0; i < savedViewData[panelNum].length; i++) {
    view = new BrowserView({ webPreferences: { plugins: true } })
    viewArr.push(view)
    win.addBrowserView(view)
    view.setBounds({ x: savedViewData[panelNum][i].x, y: savedViewData[panelNum][i].y, width: savedViewData[panelNum][i].width, height: savedViewData[panelNum][i].height })
    view.webContents.loadURL(savedWebsites[panelNum][i].url)
    windowPos++
  }
}

app.on('ready', createWindow)

//Responds to the makeWindow signal from functions. Calls createBrowserView
ipcMain.on('makeWindow', (event, arg) => {
  createBrowserView(arg.x, arg.y, arg.width, arg.height)
  //event.reply('winPos', windowPos)
  event.returnValue = windowPos
  windowPos++
})

ipcMain.on('resize', (event, arg) => {
  resizeBrowserView(arg.x, arg.y, arg.width, arg.height, arg.viewNum)
})

ipcMain.on('delete', (event, arg) => {
  deleteBrowserView(arg)
})

ipcMain.on('set', (event, arg) => {
  setBrowserView(arg.url, arg.viewNum)
})

ipcMain.on('clear', (event, arg) => {
  destroyViews()
})

ipcMain.on('restore', (event, arg) => {
  restoreViews()
})

ipcMain.on('number', (event, arg) => {
  setPanelNum(arg)
})

ipcMain.on('update', (event, arg) => {
  updateBrowserView(arg.url, arg.viewNum)
})

app.on('window-all-closed', () => {
  for(let i = 0; i < viewArr.length; i++)
  {
    updateBrowserView(viewArr[i].webContents.getURL(), i)
  }
  fs.writeFile('savedViewData.json', JSON.stringify(savedViewData), 'utf-8', () => { })
  fs.writeFile('savedWebpages.json', JSON.stringify(savedWebsites), 'utf-8', () => { })
  //Uncomment if you want to see the names of all the cookies
  session.defaultSession.cookies.get({}, function (err, cookies) {
    for (i = 0; i < cookies.length; i++) {
      //console.log(cookies[i])
    }
  })

  //Clears all browsing data and cookies. Temporary function until we have another way
  //to handle the user wanting to clear cookies themselves. For now clears all cookies and data
  //on window close
  session.defaultSession.clearStorageData([], function () { })


  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})