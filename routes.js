const express = require('express')
const routes = express()
const Users = require('./routes/users')
const imageTable=require('./routes/image')

routes.use('/api/user', Users)
routes.use('/api/image',imageTable)

module.exports = routes