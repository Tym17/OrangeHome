const chalk = require('chalk');

module.exports = function () {
    this.app = require('http').createServer(this.handler);
    this.io = require('socket.io')(this.app);
    this.connectedSockets = [];
    let self = this;
    let lastId = 0;
    this.clients = [];

    this.log = function(obj) {
        console.log(chalk.blue('[WS] ') + obj);
    };

    this.start = function() {
        self.log('Starting socket.io...');

        self.app.listen(8017);
        self.io.on('connection', self.connection);

        self.log('...Started!');
    };

    this.connection = function(socket) {
        self.connectedSockets.push(socket);
        self.log('An user connected!');
        
        socket.on('disconnect', self.disconnection(socket));
        socket.on('join', self.join(socket));
    };
    
    this.join = function (socket) {
        return data => {
            self.io.emit('status', { 
                nbPlayers: self.connectedSockets.length
            });
            console.log(data);
            self.clients.push({
                name: data.name,
                id: lastId,
                socket: socket.id
            });
            console.log(self.clients);
            socket.emit('welcome', self.clients[self.clients.length - 1]);
            self.log(`Sent a warm welcome to ${data.name}!`);
            lastId++
        };
    }

    this.disconnection = function(socket) {
        return () => {
            self.clients = self.clients.filter(c => c.socket != socket.id);
            self.connectedSockets = self.connectedSockets.filter(cs => cs.id != socket.id);
            self.log('User disconnected');
        };
    }

    this.handler = function(req, res) {
        res.writeHead(200);
        res.end('');
    };
};
