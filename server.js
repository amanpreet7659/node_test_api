const http = require('http')
const app = require('./app')

const PORT = process.env.SERVER_PORT || 8080

const server = http.createServer(app)

server.listen(PORT,()=>{
    console.log(`server listen at ${PORT}`);
})