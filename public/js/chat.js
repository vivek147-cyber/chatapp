const socket = io({transports: ['websocket'], upgrade: false});

const chatform = document.getElementById('chat-form')
const chatmessage = document.querySelector('.chat-message');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');



const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix:true,
});

//join the chatroom(emiiting scoket)
socket.emit('join-room',{username,room});

//get room and users
socket.on('roomUsers',({room,users})=>{

    outputroomname(room);
    outputusername(users);
})


//message submit
chatform.addEventListener('submit',(e)=>{

    e.preventDefault();

    //getting input msg as id is msg from input type
    const msg=e.target.elements.msg.value;
    
    //emit msg(sending to server.js) on server
    socket.emit('chat-message',msg);

    //clear input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();

})


//get message from server to show on client side
socket.on('message',(message)=>{
    console.log(message);

    //scroll to down autmatically when message exceeds
    chatmessage.scrollTop = chatmessage.scrollHeight;

    //function to get message on client side
    outputmessage(message);
})

//function for DOM manipulation
function outputmessage(message){

    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML=` <div  style="margin-top:32px"><h6 class="ms-3 rounded-3">${message.username}</h6> <p class="small p-2 ms-3 mb-1 rounded-3" style="background-color: #f5f6f7;">${message.text}</p>
  <p class="small ms-3 mb-3 rounded-3 text-muted float-end">${message.time}</p></div>`

  document.querySelector('.chat-message').appendChild(div);
}


//function for DOM of roomname
function outputroomname(room){

    roomName.innerHTML=room;
}



//function for DOM of users
function outputusername(users){

    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
}

