var fs = require('fs');

module.exports = function () {
    this.app = require('http').createServer(this.handler);
    this.io = require('socket.io')(this.app);

    this.start = function() {
        console.log('Starting socket.io ...');

        this.app.listen(8017);
        this.io.on('connection', function (socket) {
            console.log('An user connected!');
        });
        console.log('... Started!');
    };

    this.handler = function(req, res) {
        res.writeHead(200);
        res.end('');
    };
};
