window.addEventListener('load', function () {
    //Open and connect socket
    let socket = io();

    //Listen for confirmation of connection
    socket.on('connect', function () {
        console.log("connected!");
    });


    //Reference to the chat box
    let chatBox = document.getElementById('chat-box-msgs');

    //All buttons
    let buttons = document.querySelectorAll('.buttons button');

    //Send the message of the clicked button to the server
    // create 7 event listeners (1 for each button)
    buttons.forEach(btn => {
        btn.addEventListener('click', function () {
            let message = btn.innerText;
            console.log("Sending:", message);
            socket.emit('vote', message);
        });
    });

    // fixed: function now takes button as argument and sends structured vote
    function voting(btn) {
        const label = (btn.dataset.label || btn.innerText).trim();
        console.log("sending vote for:", label);
        socket.emit('vote', {
            label
        }); // send as object, not string
    }

    // added: grow buttons as server broadcasts updated counts
    socket.on('updateCounts', (votes) => {
        buttons.forEach((btn) => {
            const label = (btn.dataset.label || btn.innerText).trim();
            const count = votes[label] || 0;
            const base = 1;
            const growth = 0.08;
            const max = 3.2;
            const scale = Math.min(base + count * growth, max);
            btn.style.transform = `scale(${scale})`;
        });
    });

    //Receive new messages from the server and display them
    socket.on('newMessage', function (data) {
        let msg = document.createElement('div');
        msg.classList.add('chat-message');
        msg.textContent = data;
        chatBox.appendChild(msg);
        chatBox.scrollTop = chatBox.scrollHeight; // scroll to bottom
        //you can also do more lines here
    });

});



// let privatechatBox;

// /* --- Code to RECEIVE a socket message from the server --- */
// privatechatBox = document.getElementById('private-chat-box-msgs');

// //Listen for messages named 'msg' from the server
// socket.on('msg',  (data) => {
//     console.log("Message arrived!");
//     console.log(data);
//     addMsgToPage(data);
// });

// /* --- Code to SEND a socket message to the Server --- */
// let nameInput = document.getElementById('private-name-input')
// let msgInput = document.getElementById('private-msg-input');
// let sendButton = document.getElementById('send-button');

// sendButton.addEventListener('click', () => {
//     let curName = nameInput.value;
//     let curMsg = msgInput.value;
//     let msgObj = { "name": curName, "msg": curMsg };

//     //Send the message object to the server
//     socket.emit('msg', msgObj);
// });


// function addMsgToPage(obj){
//     //Create a message string and page element
//     let receivedMsg = obj.name + ": " + obj.msg;
//     let msgEl = document.createElement('p');
//     msgEl.innerHTML = receivedMsg;

//     //Add the element with the message to the page
//     chatBox.appendChild(msgEl);
//     //Add a bit of auto scroll for the chat box
//     chatBox.scrollTop = chatBox.scrollHeight;
// }