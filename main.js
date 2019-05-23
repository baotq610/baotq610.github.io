

var socket = io('https://oanhsusan.herokuapp.com/')

socket.on("has_new_user", (users)=>{
    $("#ulUser").html("")
    users.forEach((user)=>{
        $("#ulUser").append(`<li id="${user.id}"> ${user.name} </li>`)
    })
    
})

socket.on("sign-up-failure", ()=>{
    alert('sign up failure')
})

function openStream() {
    const config = { audio: false, video: true }
    return navigator.mediaDevices.getUserMedia(config)
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag)
    video.srcObject = stream
    video.play()
}

// openStream()
//     .then(stream => playStream('localStream', stream)
//     )

// var peer = new Peer({ key: 'lwjd5qra8257b9' });
var peer = new Peer();

peer.on('open', function (id) {
    $("#my-peer").append(id)
    $("#btnSignUp").click(() => {
        socket.emit("sign-up",
            {
                name: $("#txtUser").val(),
                id: id
            }
        )
    })
});

$("#btnCall").click(() => {
    const id = $("#remoteId").val();
    openStream()
        .then(stream => {
            playStream('localStream', stream)
            const call = peer.call(id, stream)
            call.on('stream', remoteStream => {
                playStream('remoteStream', remoteStream)
            })
        })
})


peer.on('call', call => {
    openStream()
        .then(stream => {
            call.answer(stream);
            playStream('localStream', stream)
            call.on('stream', remoteStream =>  playStream('remoteStream', remoteStream)
            )
        })
})

$("#ulUser").on('click', 'li', function(){    
    console.log($(this).attr('id'));
    
    const id = $(this).attr('id')
    openStream()
        .then(stream => {
            playStream('localStream', stream)
            const call = peer.call(id, stream)
            call.on('stream', remoteStream =>  playStream('remoteStream', remoteStream)
            )
        })  
})