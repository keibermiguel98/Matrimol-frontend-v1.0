const { BrowserWindow } = require('electron')
const path = require('path'); 
process.env.SOCKET_PORT = 18092;


// --Ventanas--

//(1)Ventana principal login
let winLogin;
const createLogin = ()=>{
        winLogin = new BrowserWindow({
        width: 2000,
        height:1000,
        webPreferences:{
            nodeIntegration: true,
            contextIsolation:false,
            webSecurity: false
            
        }
    })
    winLogin.loadFile('src/views/login.html')
    winLogin.show()
}
       
// --Exportaciones--
module.exports = {
    createLogin
}
