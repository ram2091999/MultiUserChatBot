//jshint esversion:6
let user = localStorage.getItem("MultiUserChatBot");
var socket = io();
if(!user){
  document.getElementById("jumbotron").style.display = "block";
  document.getElementById("box").style.display = "none";
}
function setUser(){
  let value=document.getElementById("name").value;
  if(!value){
    document.getElementById("noNameError").style.display="block";
  }else{
    user=value;
    localStorage.setItem("MultiUserChatBot",value);
    document.getElementById("jumbotron").style.display = "none";
    document.getElementById("box").style.display = "block";
  }
}
document.getElementById("messageBtn").addEventListener("click", function(){
  let value=document.getElementById("message").value;
  socket.emit("user",user);
  socket.emit("chat message",value);
  document.getElementById("message").value="";
});
socket.on('chat message', function(msg){
    if(msg.role!="bot"){
    let str=`<div class=" list-group-item">
      <div class="">
        <h5 class="mb-1">${msg.user}</h5>
        <small class="text-muted"></small>
        <p class="mb-1">${msg.msg}</p>
      </div>

    </div>`;
      document.getElementById("chat").insertAdjacentHTML( 'beforeend', str );

    }else{
      let str=`<div class=" list-group-item">
        <div class="">
          <h5 class="mb-1">Bot</h5>
          <small class="text-muted"></small>
          <p class="mb-1">${msg.msg}</p>
        </div>

      </div>`;
        document.getElementById("chat").insertAdjacentHTML( 'beforeend', str );

    }
    });
