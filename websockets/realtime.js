const chalk = require('chalk');

module.exports = function () {
    this.app = require('http').createServer(this.handler);
    this.io = require('socket.io')(this.app);
    this.connectedSockets = [];
    let self = this;
    let lastId = 0;
    this.clients = [];
    this.mainSocket = null;

    this.log = function (obj) {
        console.log(chalk.blue('[WS] ') + obj);
    };

    this.start = function () {
        self.log('Starting socket.io...');

        self.app.listen(8017);
        self.io.on('connection', self.connection);

        self.log('...Started!');
    };

    this.connection = function (socket) {
        self.connectedSockets.push(socket);
        self.log('An user connected!');

        socket.on('disconnect', self.disconnection(socket));
        socket.on('join', self.join(socket));
        socket.on('lead', self.takeLead(socket));
        socket.on('move', self.move(socket));
    };

    this.move = function (socket) {
        return data => {
            self.log(`${socket.id}: Moving... ${data}.`)
            if (self.mainSocket !== null)
            {
                self.mainSocket.emit('move-usr', data);
            }
        }
    }

    this.takeLead = function (socket) {
        return () => {
            self.log(`${socket.id} took lead.`);
            self.mainSocket = socket;
            self.status();
        };
    }

    this.join = function (socket) {
        return data => {
            self.clients.push({
                name: data.name,
                id: lastId,
                socket: socket.id
            });
            socket.emit('welcome', self.clients[self.clients.length - 1]);
            self.log(`Sent a warm welcome to ${data.name}!`);
            lastId++
            self.status();
        };
    }

    this.disconnection = function (socket) {
        return () => {
            self.clients = self.clients.filter(c => c.socket != socket.id);
            self.connectedSockets = self.connectedSockets.filter(cs => cs.id != socket.id);
            self.log('User disconnected');
        };
    }

    this.status = function () {
        self.io.emit('status', {
            nbPlayers: self.connectedSockets.length,
            players: self.clients.map(c => ({ name: c.name, socket: c.socket }))
        });
    }

    this.handler = function (req, res) {
        res.writeHead(200);
        res.end('');
    };
};
