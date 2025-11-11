//Initialize the express 'app' object
let express = require('express');
let app = express();
app.use('/', express.static('public'));

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
// env --> there's no guarantee that once the code is deployed the port is going to be 3000, in case choose the best posrt
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

//Initialize socket.io
let io = require('socket.io');
io = new io.Server(server);

// vote store (public/global)                                            // tracks total clicks per button label
const votes = {}; // { label: count }

//Listen for individual clients/users to connect
io.sockets.on('connection', function (socket) {
    console.log("We have a new client: " + socket.id);

    //Listen for this client to disconnect
    socket.on('disconnect', function () {
        console.log("A client has disconnected: " + socket.id);
    });



    socket.on('vote', function (data) {
        console.log("Received vote: " + data);
        // Invia a tutti i client il messaggio del voto
        let returnMsg = data + " was voted ";


        io.emit('newMessage', returnMsg);


        // // normalize label from payload                                       // supports both object and legacy string formats
        let label = data;


        // increment count and notify everyone                                // drives button growth on all clients
        if (label) {
            votes[label] = (votes[label] || 0) + 1;
            io.emit('updateCounts', votes); // clients scale buttons based on this map
        }

        console.log(data);
    });


    // Private messages (with room)
    socket.on('room', (roomName) => {
        console.log(roomName)
        console.log(`user joined ${roomName.room}`) //added a string literal
        socket.join(roomName);
        socket.room = roomName;
        io.to(roomName).emit('joined', `User joined ${roomName}`);
    });

    socket.on('privateMsg', (data) => {
        console.log(data);
        io.to(socket.room).emit('msg', data); // Only room sees it
    });
});


//Initialize private room namespace
//Allows us to better manage the rooms
// let private = io.of('/private');





// //Listen for users connecting to private page
// private.on('connection', (socket) => {
//     console.log("We have a new private client: " + socket.id);

//     socket.on('room', (data) => {
//         let roomName = data.room;
//         console.log("Create/Join Room: " + roomName);
//         //Add this socket to the room
//         socket.join(roomName);
//         //Add a room property to the individual socket
//         socket.room = roomName;
//         //Let everyone in the room know that a new user has joined
//         let joinMsg = "A new user has joined the chat room: " + roomName;
//         private.to(roomName).emit("joined", {msg: joinMsg });
//     });

//     //Listen for a message named 'msg' from this client
//     socket.on('msg', (data) => {
//         //Data can be numbers, strings, objects
//         console.log("Received a 'msg' event");
//         console.log(data);

//         let roomName = socket.room;
//         //Send a response to all clients, including this one
//         private.to(roomName).emit('msg', data);
//     });

//     //Listen for this client to disconnect
//     socket.on('disconnect', () => {
//         console.log("A client has disconnected: " + socket.id);
//     });
// });