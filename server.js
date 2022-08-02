const express = require('express');
const app = express();
const http = require('http');
const path = require('path');

const server = http.createServer(app);

const {Server} = require('socket.io');
const ACTIONS = require('./src/pages/Actions');
const io = new Server(server)

app.use(express.static('build'))

app.use((req, res, next) =>{
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})
const PORT = process.env.PORT||5000



userSocketmap ={}
function fetchconnectedUser(roomid){
    return Array.from(io.sockets.adapter.rooms.get(roomid) || []).map((socketid) =>{
        return {
            socketid,
            username : userSocketmap[socketid]
        };
    })
}
io.on('connection', (socket) => {
    console.log("New socket just connected", socket.id)
    socket.on(ACTIONS.JOIN, ({roomid, username}) =>{
        userSocketmap[socket.id] = username;
        socket.join(roomid)
        const client = fetchconnectedUser(roomid);
        client.forEach(({socketid}) =>{
            io.to(socketid).emit(ACTIONS.JOINED, {
                client,
                socketid : socket.id,
                username
            })
        })
    })

    socket.on(ACTIONS.CODE_CHANGE, ({roomid, code}) =>{
        socket.in(roomid).emit(ACTIONS.CODE_CHANGE, {code})
    })

    socket.on(ACTIONS.SYNC_CODE, ({socketid, code}) =>{
        io.to(socketid).emit(ACTIONS.CODE_CHANGE, {code})
    })

    socket.on('disconnecting', () =>{
        room = [...socket.rooms]
        room.forEach((roomId) =>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketid : socket.id,
                username : userSocketmap[socket.id]
            })
        })
    })
})


server.listen(PORT, () =>{
    console.log("App is running on port ", PORT )
})