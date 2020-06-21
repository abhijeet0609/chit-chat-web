let users = [];

function addUser(id,userName,room,activeSession){
    userName = userName.trim();
    room = room.trim();
    //Validate unique
    let userExists = users.find(user =>{return  user.userName.toLowerCase() === userName.toLowerCase() && user.room.toLowerCase() === room.toLowerCase()});
    // console.log('userExists',userExists);
    if(userExists){
        if(!activeSession){
            // throw new Error("User already exists in room");
            return "User already exists"
        }
        else{
            userExists.id = id;
            return userExists
        }   
    }
    else{
        let user = {id,userName,room}
        users.push(user);
        return user;
    }
}

function removeUser(id){
    users = users.filter(user=>user.id!==id);
}


function getUserById(id){
    return users.find(user=>user.id === id);
}

function getUsersByRoom(room){
    return users.filter(user=>user.room===room);
}


module.exports = {
    addUser,
    removeUser,
    getUserById,
    getUsersByRoom
}