const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const { use } = require("./routers/index");
const formatmessage = require('./utils/message');

//import the user.js from utils
const {joinusers,getcurrentuser,userleave,getroomusers} = require('./utils/users');

const app = express();

//botname for welcome the users
const botname = 'chatapp';

//socket.io setup
const server = http.createServer(app);
const io = socketio(server);

//PORT setup
const PORT = process.env.PORT || 3000;

//making io connection 
//Run when client connects
io.on('connection', (socket) => {

  //get the userdata from client-side
  socket.on('join-room', ({ username, room }) => {

    const user = joinusers(socket.id,username,room);

    //joining room in socket
    socket.join(user.room);

    //chatapp welcomes the user
    socket.emit('message', formatmessage(botname, 'welcome to chatapp'));

    //broadcast when connects to group server
    //to(user.room)=> makes message deliver only to the same user
    socket.broadcast.to(user.room).emit('message', formatmessage(botname, `${user.username} joins the chat`));

    //get all room users
    io.to(user.room).emit('roomUsers',{
      room:user.room,
      users:getroomusers(user.room),
    });
    

  });

  // display message on server side
  socket.on('chat-message', (msg) => {

    //get current user
    const user = getcurrentuser(socket.id);
    //sneding on message so as to show it on client side
    io.to(user.room).emit('message', formatmessage(user.username, msg));
  });

  
  //a user disconnects/leave the server
  socket.on('disconnect', () => {

    const user = userleave(socket.id);

    if(user){
      io.to(user.room).emit('message', formatmessage(botname, `${user.username} has left the Server`));

       //get all room users
    io.to(user.room).emit('roomUsers',{
      room:user.room,
      users:getroomusers(user.room)
    });
    
    }

  });
});

//saving images,files,static files
app.use(express.static(`public`));

//ejs template
app.set('view engine', 'ejs');

//routers
app.use('/', require('./routers/index'));
app.use('/', require('./routers/chat'))

//listening to Port
server.listen(PORT, () => console.log(`Listening to port ${PORT}`));