const {createLogin} = require('./main')
const {app} = require('electron')
const path = require('path')


app.whenReady().then(createLogin)

