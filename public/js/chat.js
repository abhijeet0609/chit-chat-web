
const socket = io();
const $msgsContainer = document.querySelector('#msgsContainer');
const $leftNav = document.querySelector('#leftNav');
const _messageTemplate = document.querySelector('#messageTemplate').innerHTML;
const _locationTemplate = document.querySelector('#locationTemplate').innerHTML;
const _leftNavTemplate = document.querySelector('#leftNavTemplate').innerHTML;


let connectionDetails = Qs.parse(location.search, { ignoreQueryPrefix: true });
let activeSession = false;
//Emit events
let user = sessionStorage.getItem('user');
if (user === connectionDetails.userName) {
    activeSesion = true;
}
connectionDetails.activeSession = activeSession;

socket.emit('join', connectionDetails, (err, res) => {
    if (err) {
        alert(err);
        history.back();
        return;
    }
    sessionStorage.setItem('user', connectionDetails.userName);
})


function leaveRoom() {
    socket.emit('disconnect');
    sessionStorage.removeItem('user')
    window.location.replace('/index.html');
}
//Subscribe Events
socket.on('message', (res) => {
    let { message, sender, time } = res;
    const html = Mustache.render(_messageTemplate, { message, sender, time });

    $msgsContainer.insertAdjacentHTML("beforeend", html);
    // if(res.sender === connectionDetails.userName){
    //     let msgs = $msgsContainer.querySelectorAll('.msg-block-wrapper')
    //     let $msgContainer = msgs[msgs.length -1].querySelector('.msg-container');
    //     $msgContainer.classList.add('float-right');
    // }
    autoScroll();
})

socket.on('locationEvent', (res) => {
    let { message, sender, time } = res;
    const html = Mustache.render(_locationTemplate, { message, sender, time });
    $msgsContainer.insertAdjacentHTML("beforeend", html);
    autoScroll();
})

socket.on('activeUsers', ({ room, activeUsers }) => {
    const html = Mustache.render(_leftNavTemplate, { room, activeUsers });
    $leftNav.innerHTML = html;
})

// Functions...............
function keyUp(event) {
    if (event.keyCode === 13) {
        if (!event.target.value) return;
        socket.emit('sendMsg', event.target.value);
        event.target.value = ""
    }
}
function sendMsg() {
    const $msgInput = document.querySelector('#msgInput');
    const value = $msgInput.value;
    if (!value) return;
    socket.emit('sendMsg', value);
    event.target.value = ""
}
function sendLocation() {
    let position;
    if (!navigator) {
        alert("Your browser doesn't support navigator")
    }
    navigator.geolocation.getCurrentPosition(pos => {
        position = pos;
        const location = `https://google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
        socket.emit('sendLocation', location, (ack) => { console.log(ack) });
    });
}

function autoScroll() {
    const $newMsg = $msgsContainer.lastElementChild;
    const newMsgStyles = getComputedStyle($newMsg);
    const newMsgHeight = $newMsg.offsetHeight + parseInt(newMsgStyles.marginTop.split('px')[0]) + parseInt(newMsgStyles.marginBottom.split('px')[0]);

   
    let scrollBottom = msgsContainer.scrollHeight - msgsContainer.scrollTop - msgsContainer.clientHeight;
    if(scrollBottom<newMsgHeight){
        $msgsContainer.scrollTop = $msgsContainer.scrollHeight;
    }

}

