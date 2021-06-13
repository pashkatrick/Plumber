const { app, BrowserWindow, globalShortcut, Menu } = require('electron')
const path = require('path')

let mainWindow

function hotkeysInit() {
  const tSd = globalShortcut.register('CommandOrControl+w', () => {
    mainWindow.webContents.send('tab-shut-down')
  })
  const tNe = globalShortcut.register('CommandOrControl+t', () => {
    mainWindow.webContents.send('tab-new-empty')
  })
  const enter = globalShortcut.register('CommandOrControl+Enter', () => {
    mainWindow.webContents.send('enter-action')
  })
  const save = globalShortcut.register('CommandOrControl+s', () => {
    mainWindow.webContents.send('save-action')
  })
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 800,
    minWidth: 1300,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: true,
      experimentalFeatures: true,
      additionalArguments: ["--platform=" + process.platform]
    }
  })

  mainWindow.loadFile(path.join('app', 'index.html'))

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', function () {
  createWindow();
  if (Menu.getApplicationMenu()) return
  const template = [
    {
      label: 'Edit',
      submenu: [
        {
          role: 'undo'
        },
        {
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          role: 'cut'
        },
        {
          role: 'copy'
        },
        {
          role: 'paste'
        },
        {
          role: 'pasteandmatchstyle'
        },
        {
          role: 'delete'
        },
        {
          role: 'selectall'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          role: 'reload'
        },
        {
          role: 'forcereload'
        },
        {
          role: 'toggledevtools'
        },
        {
          type: 'separator'
        },
        {
          role: 'resetzoom'
        },
        {
          role: 'zoomin'
        },
        {
          role: 'zoomout'
        },
        {
          type: 'separator'
        },
        {
          role: 'togglefullscreen'
        }
      ]
    },
    {
      role: 'window',
      submenu: [
        {
          role: 'minimize'
        },
        {
          role: 'close'
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: 'Plumber',
      submenu: [
        {
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          role: 'hide'
        },
        {
          role: 'hideothers'
        },
        {
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          role: 'quit'
        }
      ]
    })
    template[1].submenu.push({
      type: 'separator'
    }, {
      label: 'Speech',
      submenu: [
        {
          role: 'startspeaking'
        },
        {
          role: 'stopspeaking'
        }
      ]
    })
    template[3].submenu = [
      {
        role: 'close'
      },
      {
        role: 'minimize'
      },
      {
        role: 'zoom'
      },
      {
        type: 'separator'
      },
      {
        role: 'front'
      }
    ]
  } else {
    template.unshift({
      label: 'File',
      submenu: [{
        role: 'quit'
      }]
    })
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  hotkeysInit();
})
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

app.on('browser-window-blur', function () {
  globalShortcut.unregisterAll()
})

app.on('browser-window-focus', function () {
  hotkeysInit();
})

// Hot Reload
// try {
//   require('electron-reloader')(module)
// } catch (_) { }
