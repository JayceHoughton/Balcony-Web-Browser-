const { app, BrowserWindow, BrowserView, session, ipcMain } = require('electron')
var fs = require('fs')
global.registeredUser = {prop1:0}; /**************Added this Global variable*******/
let win, ses, view, loginWindow

//Window Position is used to keep track of linking the Browser View to its corresponding Panel in canvas
let windowPos = 0
let panelNum = 0

//Webpages and View Data are stored to JSON file for persistent storage
webpages = fs.readFileSync('savedWebpages.json')
viewData = fs.readFileSync('savedViewData.json')
registrationCheck = fs.readFileSync('premiumCheck.json')
let registeredUser1 = JSON.parse(registrationCheck)
let savedViewData = JSON.parse(viewData)
let savedWebsites = JSON.parse(webpages)
let viewArr = []

function createWindow() {
  let loginSes = session.fromPartition('persist:part1')
  
  function  getCookies(){
    if (registeredUser1 == "True"){
      return 0
    }
    else{
      return 1
    }

  }
  win = new BrowserWindow({ width: 1500, height: 800, fullscreenable: false, webPreferences: { webviewTag: true, nodeIntegration: true, plugins: true } })

  win.setMenu(null)

  win.loadFile('index.html')

  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })

  if (getCookies()) {

    loginWindow = new BrowserWindow({
      width: 1500, height: 800,
      webPreferences: {
        nodeIntegration: true,
        session: loginSes
      },
      parent: win,
      resizable: false,
      modal: true
    })

    loginWindow.loadFile('Login.html')
    loginWindow.webContents.openDevTools()

    loginWindow.on('closed', () => {
      if (registeredUser.prop1) {
        registrationCheck = "True"
        fs.writeFile('premiumCheck.json', JSON.stringify(registrationCheck), 'utf-8', () => {win.webContents.send('logged') })
      }
    })
  }
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
  win.removeBrowserView(viewArr[viewNum])
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
    win.removeBrowserView(viewArr[i])
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

function buildBrowser(x, y, width, height) {
  view = new BrowserView({ webPreferences: { plugins: true, nodeIntegration: true } })
  viewArr.push(view)
  win.addBrowserView(view)
  view.setBounds({ x: x, y: y, width: width, height: height})
  if(savedWebsites[panelNum].length === 0)
  {
    view.webContents.loadURL('https://www.google.com/')
    savedWebsites[panelNum].push({ url: 'https://www.google.com/', viewNum: 0 })
  }
  else
  {
    view.webContents.loadURL(savedWebsites[panelNum][0].url)
  }
  viewArr[0].webContents.on('did-navigate', function() {
    //console.log(viewArr[0].webContents.getURL())
    win.webContents.send('webpage', viewArr[0].webContents.getURL())
  })

  viewArr[0].webContents.on('did-navigate-in-page', function() {
    //console.log(viewArr[0].webContents.getURL())
    win.webContents.send('webpage', viewArr[0].webContents.getURL())
  })
}

function updateWebBrowser(url) {
  viewArr[0].webContents.loadURL(url)
  savedWebsites[panelNum][0].url = url
}

function resizeWebBrowser(x, y, width, height) {
  viewArr[0].setBounds({ x: x, y: y, width: width, height: height })
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

ipcMain.on('web', (event, arg) => {
  buildBrowser(arg.x, arg.y, arg.width, arg.height)
})

ipcMain.on('webresize', (event, arg) => {
  resizeWebBrowser(arg.x, arg.y, arg.width, arg.height)
})

ipcMain.on('updateB', (event, arg) => {
  updateWebBrowser(arg)
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