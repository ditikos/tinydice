var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname+"/client/index.html");
});

var archive = [];
var usernum = 1;

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on("diceroll",function(msg) {
        if (msg==="d6") {
            result = Math.floor((Math.random() * 6) + 1); 
        }
        if (msg==="d10") {
            result = Math.floor((Math.random() * 10) + 1); 
        }        
        if (msg==="d20") {
            result = Math.floor((Math.random() * 20) + 1); 
        }        
        if (msg==="d100") {
            result = Math.floor((Math.random() * 100) + 1); 
        }        
        var obj = { "dicetype": msg, "result": result };
        console.log(obj);
        archive.push(obj);
        console.log(archive);
        //io.emit("diceroll",archive);
        io.emit("diceroll", archive);
    });
    socket.on("status",function(msg) {
        io.emit("status",archive);
    });
    usernum++;
});

http.listen(3000, function() {
    console.log("Listening on port 3000");
});