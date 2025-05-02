const express = require('express');
const app = express();
const { connectMySQL } = require('./connection/mysql')
const dotenv = require('dotenv').config();
const admin = require('./router/admin')
const user = require('./router/user')
const bodyparser = require('body-parser')
const cors = require('cors')
const { Server } = require('socket.io');
const http = require("http");
const handleSocket = require('./contoller/socket');
const path = require('path');

app.use(bodyparser.urlencoded({extended : false}))
app.use(bodyparser.json())
app.use(cors({ origin: "*" }))

app.use('/api/admin', admin)
app.use('/api/user', user)

// socket connect
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST', 'DELETE']
    }
})

handleSocket(io)
app.set('io', io)

connectMySQL().then(() => {
    console.log('connect to mysql');
}).catch((err) => { console.log(err, 'error'); });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send({message: 'server start', status: true})
})

server.listen(process.env.PORT, () => {
    try {
        console.log(`http://${process.env.HOSTNAME}:${process.env.PORT} running successfull`)
    }
    catch (e) {
        console.log(e,'error')
    }
})

io.on('connection', (socket) => {
    console.log('User connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    })
})