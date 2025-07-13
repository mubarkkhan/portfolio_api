require('dotenv').config();
const express = require('express');
const app = express();
const { connectMySQL } = require('./connection/mysql')
const admin = require('./router/admin')
const user = require('./router/user')
const bodyparser = require('body-parser')
const cors = require('cors')
const { Server } = require('socket.io');
const http = require("http");
const handleSocket = require('./contoller/socket');
const path = require('path');
const PORT = process.env.PORT || 4000;

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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send({message: 'server start', status: true})
})

app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    const db = await connectMySQL();

    if (!db) {
        console.log('⚠️ DB not connected. Some routes depending on DB might not work.');
    }
});

io.on('connection', (socket) => {
    console.log('User connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    })
})