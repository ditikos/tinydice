/*var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);*/

var PORT = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var IPADDRESS = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require("socket.io").listen(server);

app.get('/', function(req, res) {
    res.sendFile(__dirname+"/client/index.html");
});

var archive = [];
var usernum = 1;

io.on('connection', function(socket){
    //console.log('a user connected');
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
var d = new Date,
    dformat = [(d.getMonth()+1).padLeft(),
               d.getDate().padLeft(),
               d.getFullYear()].join('/') +' ' +
              [d.getHours().padLeft(),
               d.getMinutes().padLeft(),
               d.getSeconds().padLeft()].join(':');      
        var obj = { "time":dformat, "dicetype": msg, "result": result };
        archive.push(obj);
        io.emit("diceroll", archive);
    });
    socket.on("status",function(msg) {
        io.emit("status",archive);
    });
    
    socket.on("clear", function(msg) {
        // http://stackoverflow.com/questions/1232040/how-to-empty-an-array-in-javascript
        while (archive.length) { archive.pop(); }
        io.emit("status",archive);
    });
    usernum++;
});


server.listen(PORT, IPADDRESS, function() {
    console.log("Listening on..."+IPADDRESS+":"+PORT);
});


Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}