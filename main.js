const { app, BrowserWindow, BrowserView, session, ipcMain } = require('electron')
var fs = require('fs')

let win
let ses
let view
let windowPos = 0
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

  for (i = 0; i < savedViewData.length; i++) {
    view = new BrowserView({ webPreferences: { plugins: true } })
    viewArr.push(view)
    win.addBrowserView(view)
    view.setBounds({ x: savedViewData[i].x, y: savedViewData[i].y, width: savedViewData[i].width, height: savedViewData[i].height })
    view.webContents.loadURL(savedWebsites[i].url)
    windowPos++
  }

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
  savedViewData.push({ x: x, y: y, width: width, height: height })
  fs.writeFile('savedViewData.json', JSON.stringify(savedViewData), 'utf-8', () => { })
  //view.setAutoResize({width: false, height: true})
  //view.webContents.loadURL(url)
}

//Function to resize the passed Browser View
function resizeBrowserView(x, y, width, height, viewNum) {
  viewArr[viewNum].setBounds({ x: x, y: y, width: width, height: height })
  savedViewData[viewNum].x = x
  savedViewData[viewNum].y = y
  savedViewData[viewNum].width = width
  savedViewData[viewNum].height = height
}

//Function to delete the passed Browser View
function deleteBrowserView(viewNum) {
  viewArr[viewNum].destroy()
  viewArr.splice(viewNum, 1)
  savedViewData.splice(viewNum, 1)
  savedWebsites.splice(viewNum, 1)
  windowPos = 0
  for(i = 0; i < savedWebsites.length; i++)
  {
    savedWebsites[i].viewNum = i
    windowPos++
  }
}

function updateBrowserView(url, viewNum) {
  viewArr[viewNum].webContents.loadURL(url)
  savedWebsites.push({ url: url, viewNum: viewNum })
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

ipcMain.on('update', (event, arg) => {
  updateBrowserView(arg.url, arg.viewNum)
})

app.on('window-all-closed', () => {
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