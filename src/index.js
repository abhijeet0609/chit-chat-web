const express = require('express');
const path = require('path');
const { dirname } = require('path');
const http = require('http');
const socketio = require('socket.io');
const appName = "Chit-Chat"

const { generateMsg } = require('./utils/message');
const { addUser,removeUser,getUserById, getUsersByRoom } = require('./utils/users');

const app = express();
const port = process.env.PORT || 3001;

const server = http.createServer(app);
const io = socketio(server);

const publicDirPath = path.join(__dirname , "../public"); 
app.use(express.static(publicDirPath));

io.on('connection',(socket)=>{

    socket.on('join',({userName,room,activeSession},callback)=>{
            const user = addUser(socket.id,userName,room,activeSession);
            if(user === "User already exists"){      
             return callback(user,undefined);
            }
            socket.join(user.room);
            socket.broadcast.to(user.room).emit('message',generateMsg("Chat Bot",`${user.userName} has joined the conversation.`));
            socket.emit('message',generateMsg("Chat Bot",`Hi ${user.userName}! Welcome to ${appName}. You are now in ${user.room} room.`))
                    const activeUsers = getUsersByRoom(user.room);
        io.to(user.room).emit('activeUsers',{activeUsers,room:user.room})
    })

    socket.on('sendMsg',(msg)=>{
        const user = getUserById(socket.id);
        io.to(user.room).emit('message',generateMsg(user.userName,msg));
    })
    socket.on('sendLocation',(location,callback)=>{
        const user = getUserById(socket.id);
        io.to(user.room).emit('locationEvent',generateMsg(user.userName,location));
        callback("location sent!");
    })
    socket.on('disconnect',()=>{
        const user = getUserById(socket.id);
        if(!user) return; //Multiple entry socket disconnect
        io.to(user.room).emit('message',generateMsg("Chat Bot",`${user.userName} has left`));
        removeUser(socket.id);
        const activeUsers = getUsersByRoom(user.room);
        io.to(user.room).emit('activeUsers',{ activeUsers, room:user.room })
    });
});

server.listen(port,()=>{console.log("Server up and running on  "+port)})
