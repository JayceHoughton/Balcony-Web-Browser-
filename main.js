const { app, BrowserWindow} = require('electron')

let win
let ses

function createWindow () {
  win = new BrowserWindow({ width: 1500, height: 800, webPreferences: { webviewTag: true}})

  win.setMenu(null)

  win.loadFile('index.html')

  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })

  ses = win.webContents.session
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  //Uncomment if you want to see the names of all the cookies
  /*ses.cookies.get({ url: "https://www.youtube.com/" }, function(err, cookies) {
    for(i = 0; i < cookies.length; i++)
    {
      console.log(cookies[i].name)
    }

  })*/

  //Clears all browsing data and cookies. Temporary function until we have another way
  //to handle the user wanting to clear cookies themselves. For now clears all cookies and data
  //on window close
  ses.clearStorageData([], function (data) {})
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})