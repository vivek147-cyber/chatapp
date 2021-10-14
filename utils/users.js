const users=[];


//returns the user joins from the client side to /chat
function joinusers(id,username,room){
    const user={id,username,room};

    users.push(user);

    return user;
    
}

//get the current user who joins the /chat
function getcurrentuser(id){

    return users.find(user=> user.id === id);
}

//users that left the chat
function userleave(id){
    const index = users.findIndex(user => user.id === id);

    if(index !== -1){
        return users.splice(index,1)[0];
    }
}

//get room users
function getroomusers(room){

    return users.filter(user=> user.room === room);
}


//exports the module
module.exports={
    joinusers,
    getcurrentuser,
    userleave,
    getroomusers
};