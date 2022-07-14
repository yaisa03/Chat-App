let socket = io();

const nameInput = document.getElementById("nameInput");
const joinRoomInput = document.getElementById("joinRoomInput");
const joinRoomBtn = document.getElementById("joinRoomBtn");
const joinChatContainer = document.getElementById("joinChatContainer");
const chatContainer = document.getElementById("chatContainer");

let currentUsername = "";
let currentRoom = "";

joinRoomBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (nameInput.value && joinRoomInput.value) {
        joinChatContainer.style.display = "none";
        chatContainer.style.display = "";
        currentUsername = nameInput.value;
        currentRoom = joinRoomInput.value;
        socket.emit("join-room", currentRoom);
        document.getElementById('chatId').innerHTML = `Chat ID: ${currentRoom}`;
    }
});

const createRoomInput = document.getElementById("createRoomInput");
const createRoomBtn = document.getElementById("createRoomBtn");
socket.on('create-room', (room) => {
    currentRoom = room;
    console.log(currentRoom);
});
createRoomBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (createRoomInput.value) {
        socket.emit("join-room", currentRoom);
        joinChatContainer.style.display = "none";
        chatContainer.style.display = "";
        currentUsername = createRoomInput.value;
        alert(`el id de tu sala es ${currentRoom}`)
        document.getElementById('chatId').innerHTML = `Chat ID ${currentRoom}`;
    }
})

const message = document.getElementById("messageInput");
const button = document.getElementById("sendButton");
let messageContainer = document.querySelector("#messageContainer");
let messages = [];
let currentUser = "";

button.addEventListener("click", function (e) {
    e.preventDefault();
    if (message.value) {
        const messageData = {
            message: message.value,
            author: currentUsername,
            room: currentRoom,
            time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes()
        };
        socket.emit("send-message", messageData);
        message.value = "";

        let newMsgDiv = document.createElement('div');
        newMsgDiv.setAttribute('id', "you" );

        let msgTime = document.createElement('p');
        msgTime.innerHTML = messageData.author+'  '+messageData.time; 
        msgTime.setAttribute('id', 'time');

        let newMsg = document.createElement('p');
        newMsg.innerHTML = messageData.message;

        newMsgDiv.appendChild(newMsg);
        newMsgDiv.appendChild(msgTime);
        messageContainer.appendChild(newMsgDiv);
    }
});
socket.on('current-user', (user) => {
    currentUser = user
})
socket.on('receive-message', (msg) => {
    messages.push(msg);
    let newMsgDiv = document.createElement('div');
    newMsgDiv.setAttribute('id', msg.userID === currentUser ? "you" : "other");

    let msgTime = document.createElement('p');
    msgTime.innerHTML = msg.author + ' '+ msg.time;
    msgTime.setAttribute('id', 'time');

    let newMsg = document.createElement('p');
    newMsg.innerHTML = msg.message;

    newMsgDiv.appendChild(newMsg);
    newMsgDiv.appendChild(msgTime);
    messageContainer.appendChild(newMsgDiv);
})
