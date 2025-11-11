/* --- Code to SEND a socket message to the Server --- */
let chatBox = document.getElementById('private-chat-box-msgs')
let nameInput = document.getElementById('private-name-input')
let msgInput = document.getElementById('private-msg-input');
let sendButton = document.getElementById('send-button');

console.log("working")
let socket = io();
//made with Claude AI + Adam

// Extract room name from URL
let params = new URLSearchParams(window.location.search);
let roomName = params.get('room'); //going to get room key from query parameter we created in index.js file
console.log(roomName)
//emits when room is joined

if (roomName) {
    // Join the room immediately on page load
    socket.emit('room', {
        room: roomName
    });

    // Optional: display which room you're in
    // document.getElementById('room-title').textContent = `Chat: ${roomName}`;
}

socket.on('joined', (data) => {
    console.log(data.msg);
});

socket.on('msg', (data) => {
    // debugger;
    addMsgToPage(data);
});
//newly added from app.js code but wasnt removed
function addMsgToPage(obj) {
    //Create a message string and page element
    let receivedMsg = obj.name + ": " + obj.msg;
    let msgEl = document.createElement('p');
    msgEl.innerHTML = receivedMsg;

    //Add the element with the message to the page
    chatBox.appendChild(msgEl);
    //Add a bit of auto scroll for the chat box
    chatBox.scrollTop = chatBox.scrollHeight;
}


sendButton.addEventListener('click', () => {
    let curName = nameInput.value;
    let curMsg = msgInput.value;
    let msgObj = {
        "name": curName,
        "msg": curMsg
    };

    //Send the message object to the server
    socket.emit('privateMsg', msgObj);
});