const { app, BrowserWindow, BrowserView, session, ipcMain} = require('electron')

let win
let ses
let view
let windowPos = 0
let viewArr = []

function createWindow () {
  win = new BrowserWindow({ width: 1500, height: 800, fullscreenable: false, webPreferences: { webviewTag: true, nodeIntegration: true, plugins: true}})

  win.setMenu(null)

  win.loadFile('index.html')

  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}

//Creates a BrowserView using infromation provided from renderer signal
function createBrowserView(x, y, width, height, url) {
  view = new BrowserView({webPreferences: {plugins: true}})
  viewArr.push(view)
  win.addBrowserView(view)
  view.setBounds({ x: x, y: y, width: width, height: height })
  //view.setAutoResize({width: false, height: true})
  view.webContents.loadURL(url)
}

function resizeBrowserView(x, y, width, height, viewNum) {
  viewArr[viewNum].setBounds({ x: x, y: y, width: width, height: height })
}

app.on('ready', createWindow)

//Responds to the makeWindow signal from functions. Calls createBrowserView
ipcMain.on('makeWindow', (event, arg) => {
  createBrowserView(arg.x, arg.y, arg.width, arg.height, arg.url)
  //event.reply('winPos', windowPos)
  event.returnValue = windowPos
  windowPos++
})

ipcMain.on('resize', (event, arg) => {
  resizeBrowserView(arg.x, arg.y, arg.width, arg.height, arg.viewNum)
})

app.on('window-all-closed', () => {
  //Uncomment if you want to see the names of all the cookies
  session.defaultSession.cookies.get({}, function(err, cookies) {
    for(i = 0; i < cookies.length; i++)
    {
      //console.log(cookies[i])
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

refresh.addEventListener('click', reloadView);  
back.addEventListener('click', backView);  
forward.addEventListener('click', forwardView);  
omni.addEventListener('keydown', updateURL);  
fave.addEventListener('click', addBookmark);  
list.addEventListener('click', openPopUp);  
popup.addEventListener('click', handleUrl);  
dev.addEventListener('click', handleDevtools);  
view.addEventListener('did-finish-load', updateNav); 