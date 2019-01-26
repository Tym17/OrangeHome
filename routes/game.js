const express = require('express');
const interfaces = require('os').networkInterfaces();

const router = express.Router();

/* GET game listing. */
router.get('/', (req, res, next) => {
  let addresses = [];
  for (let ifs in interfaces) {
    for (let i in interfaces[ifs]) {
      var address = interfaces[ifs][i];
      if (address.family === 'IPv4' && !address.internal) {
        addresses.push(address.address);
      }
    }
  }
  res.render('game/lobby', { title: 'OrangeHome : Lobby', ips: addresses });
});

router.get('/play', (req, res, next) => {
  res.render('game/game', { title: 'OrangeHome : Playing' });
});

module.exports = router;
