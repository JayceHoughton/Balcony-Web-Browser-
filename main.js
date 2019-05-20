const { app, BrowserWindow, BrowserView, session, ipcMain} = require('electron')

let win
let ses
let view

function createWindow () {
  win = new BrowserWindow({ width: 1500, height: 800, fullscreenable: false, webPreferences: { webviewTag: true, nodeIntegration: true}})

  win.setMenu(null)

  win.loadFile('index.html')

  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}

//Creates a BrowserView using infromation provided from renderer signal
function createBrowserView(x, y, width, height, url) {
  view = new BrowserView()
  win.addBrowserView(view)
  view.setBounds({ x: x, y: y, width: width, height: height })
  //view.setAutoResize({width: false, height: true})
  view.webContents.loadURL(url)
}

app.on('ready', createWindow)

//Responds to the makeWindow signal from functions. Calls createBrowserView
ipcMain.on('makeWindow', (event, arg) => {
  console.log(arg)
  createBrowserView(arg.x, arg.y, arg.width, arg.height, arg.url)
})

app.on('window-all-closed', () => {
  //Uncomment if you want to see the names of all the cookies
  session.defaultSession.cookies.get({}, function(err, cookies) {
    for(i = 0; i < cookies.length; i++)
    {
      console.log(cookies[i])
    }
  })

  //Clears all browsing data and cookies. Temporary function until we have another way
  //to handle the user wanting to clear cookies themselves. For now clears all cookies and data
  //on window close
  session.defaultSession.clearStorageData([], function() {} )
  

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})