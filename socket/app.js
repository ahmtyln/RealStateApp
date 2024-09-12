import {Server} from "socket.io"


const io = new Server ({
    cors:{
        origin: "*",
        methods: ["GET", "POST", "OPTIONS"]
    },
});

let onlineUser = [];

const addUser = (userId,socketId) =>{
    const userExits = onlineUser.find((user) => user.userId === userId);
    if(!userExits){
        onlineUser.push({userId, socketId});
    }
}

const removeUser = (socketId) => {
    onlineUser = onlineUser.filter((user) => user.socketId !== socketId)
}

const getUser = (userId) => {
    return onlineUser.find(user => user.userId === userId)
}

io.on("connection", (socket) => {
    socket.on("newUser", (userId) =>{
        addUser(userId,socket.id);
        console.log(onlineUser)
    })

    socket.on("sendMessage", ({receiverId, data}) =>{
        const receiver = getUser(receiverId)
        io.to(receiver.socketId).emit("getMessage",data);
    }) 

    socket.on("disconnet", () =>{
        removeUser(socket.id);
    })
})

io.listen("4000")