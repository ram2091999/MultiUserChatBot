//jshint esversion:6
const express=require("express");
const app = express();
const http = require('http').createServer(app);
const path = require('path');
var io = require('socket.io')(http);
const excuse = require('huh');
const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'] });
// Adds the utterances and intents for the NLP
manager.addDocument('en', 'goodbye for now', 'greetings.bye');
manager.addDocument('en', 'bye bye take care', 'greetings.bye');
manager.addDocument('en', 'okay see you later', 'greetings.bye');
manager.addDocument('en', 'bye for now', 'greetings.bye');
manager.addDocument('en', 'i must go', 'greetings.bye');
manager.addDocument('en', 'hello', 'greetings.hello');
manager.addDocument('en', 'hi', 'greetings.hello');
manager.addDocument('en', 'who', 'greetings.enq');
manager.addDocument('en', 'what are you', 'greetings.enq');
manager.addDocument('en', 'hola', 'greetings.hello');
manager.addDocument('en', 'hello world', 'greetings.hello');

// Train also the NLG
manager.addAnswer('en', 'greetings.bye', 'Till next time');
manager.addAnswer('en', 'greetings.bye', 'see you soon!');
manager.addAnswer('en', 'greetings.hello', 'Hey there!');
manager.addAnswer('en', 'greetings.hello', 'Greetings!');
manager.addAnswer('en', 'greetings.enq', 'Im a simple bot here to answer your questions!! ');
(async() => {
    await manager.train();
    manager.save();

})();

let user;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
   io.emit('chat message', {msg:msg,role:"user",user:user});
  botResponse(msg,socket);
 });
 socket.on('user',function(msg){
   user=msg;
 });
});

async function botResponse(msg,socket){
  let response=await manager.process('en', msg);
  socket.emit('chat message',{msg:response.answer,role:"bot"});
}


app.get('/', function(req, res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

http.listen(3000, function(){
  console.log('listening on Port:3000');
});
