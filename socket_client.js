const socket = require('socket.io-client')('http://localhost:3000')

socket.on('connect', function() {
  console.log('Connected');
});
socket.on('newBot', function(data) {
  console.log('event', data);
});