// Establish a WebSocket connection
const socket = new WebSocket('wss://faff-198-48-245-203.ngrok-free.app:5555');  // Replace with your backend WebSocket URL and port

// DOM elements
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const username = prompt("Enter your username:"); // Prompt user for username

// Display message in chat window
function displayMessage(username, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.innerHTML = `<span class="username">${username}:</span><span class="text">${message}</span>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;  // Auto-scroll to bottom
}

// Send message to the WebSocket server
function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        // Display the message locally
        displayMessage(username, message);

        // Send the message to the WebSocket server
        socket.send(JSON.stringify({
            username: username,
            message: message
        }));

        // Clear the input field
        messageInput.value = '';
    }
}

// Event listener for "Send" button
sendBtn.addEventListener('click', sendMessage);

// Allow sending messages by pressing Enter
messageInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Listen for messages from the server
socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    
    // Display the received message in the chat
    if (data.username && data.message) {
        displayMessage(data.username, data.message);
    }
};

// Handle WebSocket connection open event
socket.onopen = function () {
    console.log("Connected to WebSocket server.");
    // Notify other users that the new user has joined
    socket.send(JSON.stringify({
        username: 'System',
        message: `${username} has joined the chat.`
    }));
};

// Handle WebSocket errors
socket.onerror = function (error) {
    console.log("WebSocket error: " + error);
};

// Handle WebSocket connection close event
socket.onclose = function () {
    console.log("Disconnected from WebSocket server.");
};

// Display a welcome message when the user joins
displayMessage('System', `${username} has joined the chat.`);
