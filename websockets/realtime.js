const chalk = require('chalk');

module.exports = function () {
    this.app = require('http').createServer(this.handler);
    this.io = require('socket.io')(this.app);
    this.connectedSockets = [];
    let me = this;

    this.log = function(obj) {
        console.log(chalk.blue('[WS] ') + obj);
    };

    this.start = function() {
        me.log('Starting socket.io ...');

        me.app.listen(8017);
        me.io.on('connection', me.connection);
        me.log('... Started!');
    };

    this.connection = function(socket) {
        me.connectedSockets.push(socket);
        me.log('An user connected!');
        let disco = me.disconnection(socket);
        socket.on('disconnect', disco);
    };

    this.disconnection = function(socket) {
        return () => {
            me.log('Disconnected');
        };
    }

    this.handler = function(req, res) {
        res.writeHead(200);
        res.end('');
    };
};
