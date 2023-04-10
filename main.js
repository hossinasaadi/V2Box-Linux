const { app, BrowserWindow } = require('electron')
const path = require('path');
const electronIpcMain = require('electron').ipcMain;
const Store = require('electron-store');
const fs = require('fs');
const { dialog } = require('electron')
const store = new Store();
const { exec } = require('child_process');


app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');

const createWindow = () => {
    const win = new BrowserWindow({
      width: 500,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true
      }
  
    })
    win.setMenuBarVisibility(false)

    win.loadFile('index.html')
    return win
  }
  
  app.whenReady().then(() => {
    let win = createWindow()

    app.on('activate', () => {
        if (win.getAllWindows().length === 0) createWindow()
      })

      win.on('close', async e => {

        
        
        exec('pgrep --count tun2socks; echo $?', (err, stdout, stderr) => {
            if (err) {
              console.error(`exec error: ${err}`);
              if (process.platform !== 'darwin') win.destroy()
    
              return;
            }
            console.error(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            if(stdout.startsWith("0")){
                if (process.platform !== 'darwin') win.destroy()
                return
            }
            dialog.showErrorBox('Error', 'Stop Before Quit!') 

        })  
        e.preventDefault()
    
      })
      
  })

  app.on('window-all-closed', (e) => {
    
    exec('pgrep --count tun2socks; echo $?', (err, stdout, stderr) => {
        if (err) {
          console.error(`exec error: ${err}`);
          if (process.platform !== 'darwin') app.quit()

          return;
        }
        console.error(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        if(stdout.startsWith("0")){
            if (process.platform !== 'darwin') app.quit()
            return
        }
        dialog.showErrorBox('Error', 'Stop Before Quit!') 
        })
        e.preventDefault();

  })
  var sudo = require('sudo-prompt');

  electronIpcMain.on('runScript', () => {
      
    //save config
    let savePath = path.join(process.env.HOME, ".V2BOX")

    exec('mkdir ' + savePath, (err, stdout, stderr) => {
        if (err) {
          console.error(`exec error: ${err}`);
          return;
        }
    })

    
    let configSavePath = path.join(process.env.HOME, ".V2BOX","config.json")
    let configJson = JSON.parse(store.get('config'))
    let customInbound = JSON.parse('[{"sniffing":{"enabled":false},"listen":"127.0.0.1","protocol":"socks","settings":{"udp":true,"auth":"noauth","userLevel":8},"tag":"socks","port":10808}]')
    configJson["inbounds"] = customInbound
    configJson = JSON.stringify(configJson)
    try { fs.writeFileSync(configSavePath, configJson, 'utf-8'); }
    catch(e) { 
    dialog.showErrorBox('Error', 'Failed to save the file ! ' + configSavePath + e) 
    e.preventDefault();
}


    var options = {
    name: 'V2Box',
    };
    let shellPath = path.join(__dirname, 'Tunnel/tunnel.sh')

    sudo.exec('bash ' + shellPath + " " + store.get('serverAddress') + " " + path.join(__dirname, 'Tunnel') + " " + configSavePath, options,
    function(error, stdout, stderr) {
        if (error) throw error;
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);

    }
    );
})
electronIpcMain.on('stopScript', stopScript)

function stopScript(){
    // MacOS & Linux
    var options = {
        name: 'V2Box',
        };
        let shellPath = path.join(__dirname, 'Tunnel/stop.sh')
        sudo.exec('bash ' + shellPath, options,
        function(error, stdout, stderr) {
            if (error) throw error;
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
    
        }
        );
}