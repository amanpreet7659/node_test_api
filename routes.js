const express = require('express')
const routes = express()
const Users = require('./routes/users')
const imageTable=require('./routes/image')
const path = require('path')

routes.use('/user', Users)
routes.use('/image',imageTable)
routes.use("/uploads", express.static(path.join("uploads")));

module.exports = routes