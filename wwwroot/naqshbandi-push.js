
const messaging = firebase.messaging();

// IDs of divs that display registration token UI or request permission UI.
const tokenDivId = 'token_div';
const permissionDivId = 'permission_div';
const profileDivId = 'profile_div';

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.onBackgroundMessage` handler.
messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    // Update the UI to include the received message.
    appendMessage(payload);
});

function resetUI() {

    //clearMessages();  UH removed to seperate SendPush page
    showToken('loading...');
    // Get registration token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.

    messaging.getToken({ vapidKey: 'BBuLk5lKzjZpWYoLE1Hj6Shvzv6Bqj3MOoh7FIoX6zVZ2fCsW2pqhIr5ga8MaZWb8-ywRs8YprmAI7Sy4hbELaQ' }).then((currentToken) => {
        console.log('Current token :', currentToken);
        if (currentToken) {
            window.localStorage.setItem('pushToken', currentToken);
            sendTokenToServer(currentToken);
            updateUIForPushEnabled(currentToken);
        } else {
            // Show permission request.
            console.log('No registration token available. Request permission to generate one.');
            // Show permission UI.
            updateUIForPushPermissionRequired();
            setTokenSentToServer(false);
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        showToken('Error retrieving registration token. ', err);
        setTokenSentToServer(false);
    });
    window.localStorage.setItem('pushToken', currentToken);
}


function showToken(currentToken) {
    // Show token in console and UI.
    const tokenElement = document.querySelector('#token');
    tokenElement.textContent = currentToken;
}

// Send the registration token your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the token from topics
function sendTokenToServer(currentToken) {
    console.log('Token sent to server: ' + isTokenSentToServer());

    if (!isTokenSentToServer()) {
        console.log('Sending token to server...');
        // TODO(developer): Send the current token to your server.
        setTokenSentToServer(true);
    } else {
        console.log('Token already sent to server so won\'t send it again ' +
            'unless it changes');
    }
}

function isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') === '1';
}

function setTokenSentToServer(sent) {
    window.localStorage.setItem('sentToServer', sent ? '1' : '0');
}

function showHideDiv(divId, show) {
    const div = document.querySelector('#' + divId);
    if (show) {
        div.style = 'display: visible';
    } else {
        div.style = 'display: none';
    }
}

function requestPermission() {
        console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            // TODO(developer): Retrieve a registration token for use with FCM.
            // In many cases once an app has been granted notification permission,
            // it should update its UI reflecting this.
            resetUI();
        } else {
            console.log('Unable to get permission to notify.');
            alert('Notification permission was not granted to the app.');
        }
    });
}

function deleteToken() {
    // Delete registration token.
    messaging.getToken().then((currentToken) => {
        messaging.deleteToken(currentToken).then(() => {
            console.log('Token deleted.');
            setTokenSentToServer(false);
            // Once token is deleted update UI.
            resetUI();
        }).catch((err) => {
            console.log('Unable to delete token. ', err);
        });
    }).catch((err) => {
        console.log('Error retrieving registration token. ', err);
        showToken('Error retrieving registration token. ', err);
    });
}

// Add a message to the messages element.
function appendMessage(payload) {
    const messagesElement = document.querySelector('#messages');
    const dataHeaderElement = document.createElement('h5');
    const dataElement = document.createElement('pre');
    dataElement.style = 'overflow-x:hidden;';
    dataHeaderElement.textContent = 'Received message:';
    dataElement.textContent = JSON.stringify(payload, null, 2);
    messagesElement.appendChild(dataHeaderElement);
    messagesElement.appendChild(dataElement);
}

// Clear the messages element of all children.
function clearMessages() {
    const messagesElement = document.querySelector('#messages');
    while (messagesElement.hasChildNodes()) {
        messagesElement.removeChild(messagesElement.lastChild);
    }
}

function updateUIForPushEnabled(currentToken) {
    showHideDiv(tokenDivId, true);
    showHideDiv(profileDivId, true);
    showHideDiv(permissionDivId, false);
    showToken(currentToken);
}

function updateUIForPushPermissionRequired() {
    showHideDiv(tokenDivId, false);
    showHideDiv(profileDivId, false);
    showHideDiv(permissionDivId, true);
}

