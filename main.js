const { app, BrowserWindow, globalShortcut, Menu } = require('electron')
const path = require('path')
const fs = require('fs')
const config = require('./config')
const { ipcMain } = require('electron')


let pythonProcess = null
let pythonPort = null


function getPythonServerPath() {
  if (!guessPackaged()) {
    python_server_path = path.join(__dirname, config.PYTHON_SERVER_DIR, config.PYTHON_SERVER + '.py')
    python_server_path = path.join(config.PYTHON_SERVER_DIR, config.PYTHON_SERVER + '.py')
  } else {
    if (process.platform === 'win32') {
      python_server_path = path.join(__dirname, config.PYTHON_DIST_DIR, config.PYTHON_SERVER + '.exe')
    } else {
      python_server_path = path.join(__dirname, config.PYTHON_DIST_DIR, config.PYTHON_SERVER)
    }
  }
  if (config.DEBUG) {
    console.log("Guess packaged() returned: " + guessPackaged())
    console.log("Python server path: " + python_server_path)
  }
  return python_server_path
}

function selectPort() {
  pythonPort = config.ZERORPC_PORT
  return pythonPort
}


function guessPackaged() {
  fullPath = path.join(__dirname, config.PYTHON_DIST_DIR)
  if (config.DEBUG) {
    console.log("Guess packaged path: " + fullPath)
  }
  return fs.existsSync(fullPath)
}

function createPythonProcess() {
  let pythonScriptPath = getPythonServerPath()
  let port = '' + selectPort()

  if (guessPackaged()) {
    pythonProcess = require('child_process').execFile(pythonScriptPath, [port])
  } else {
    pythonProcess = require('child_process').spawn('python', [pythonScriptPath, port])
  }

  pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })

  pythonProcess.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`)
  })

  pythonProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
  })

  return pythonProcess
}

function closePythonProcess() {
  pythonProcess.kill()
  pythonProcess = null
  pythonPort = null
}

ipcMain.on('python-server', (event, arg) => {
  createPythonProcess().addListener('close', () => {
    event.sender.send('python-server-reply')
  })
})

app.on('will-quit', closePythonProcess)

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
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: true,
      experimentalFeatures: true,
      // enableRemoteModule: true
    }
  })

  mainWindow.loadFile(path.join('front', 'index.html'))

  if (config.DEBUG) {
    mainWindow.webContents.openDevTools()
  }

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
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            shell.openExternal('https://electronjs.org')
          }
        },
        {
          label: 'Documentation',
          click() {
            shell.openExternal(
              `https://github.com/electron/electron/tree/v${process.versions.electron}/docs#readme`
            )
          }
        },
        {
          label: 'Community Discussions',
          click() {
            shell.openExternal('https://discuss.atom.io/c/electron')
          }
        },
        {
          label: 'Search Issues',
          click() {
            shell.openExternal('https://github.com/electron/electron/issues')
          }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: 'Electron',
      submenu: [
        {
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          role: 'services'
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
try {
  require('electron-reloader')(module)
} catch (_) { }
