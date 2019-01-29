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
        let d = new Date();
        console.log(`[${d.getDate()}/${d.getMonth() + 1}  ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}]` + chalk.blue('[WS] ') + obj);
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
            self.log(`${socket.id}: Moving...`)
            if (self.mainSocket !== null)
            {
                self.mainSocket.emit('move-usr', data);
            }
        }
    }

    this.newComer = function (client) {
        if (self.mainSocket !== null)
        {
            self.mainSocket.emit('new-usr', client);
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
            self.log(`==========================================================`);
            self.log(`Sent a warm welcome to ${data.name}!`);
            self.log(`==========================================================`);
            lastId++
            self.status();
            self.newComer(self.clients[self.clients.length - 1]);
        };
    }

    this.disconnection = function (socket) {
        return () => {
            let leaving = self.clients.filter(c => c.socket === socket.id)[0]
            if (self.mainSocket !== null) {
                self.mainSocket.emit('quit-usr', leaving);
            }
            self.clients = self.clients.filter(c => c.socket !== socket.id);
            self.connectedSockets = self.connectedSockets.filter(cs => cs.id != socket.id);
            self.log(`${leaving.name} disconnected.`);
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
