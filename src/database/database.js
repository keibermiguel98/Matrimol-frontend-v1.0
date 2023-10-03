const mysql = require('mysql');

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'matrimol'
});

db.connect((error)=>{
    if(error){
        console.log('No se pudo conectar con la base de datos')
    }
    else{
        console.log('conexion exitosa con la base de datos')
    }
})

module.exports = db