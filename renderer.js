window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('button').addEventListener('click', () => {
        let state = document.getElementById('button').value
        if(window.store.get('serverAddress')!== "" && window.store.get('config')!== ""){

            if(state == "Start Xray"){
                document.getElementById('button').value = "Stop Xray"
                window.ipcRender.send('runScript');
            }
            else{ 
                window.ipcRender.send('stopScript');
                document.getElementById('button').value = "Start Xray"

            }
    }else {
        document.getElementById('button').style = "color:red;"
    }
    })
    
    const configTextarea = document.getElementById("config");
    
    configTextarea.onchange = function() {
        window.store.set('config', this.value);
        console.log(window.store.get('config'));

        console.log(this.value)
       }
       configTextarea.value = window.store.get('config')

       const serverAddressText = document.getElementById("serverAddress");
    
       serverAddressText.onchange = function() {
           window.store.set('serverAddress', this.value);
           console.log(window.store.get('serverAddress'));
   
           console.log(this.value)
          }
          serverAddressText.value = window.store.get('serverAddress')
   
})
  
  