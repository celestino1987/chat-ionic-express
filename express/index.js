const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
  },
});

const cors = require('cors');
app.use(
  cors({
    credentials: false,
    origins: ['http://localhost:4200'],
  })
);



app.get('/', (req, res) => res.send('hello!!!!'));

io.on('connection', (socket) => {
  socket.on('disconnect', function () {
    io.emit('users-changed', { user: socket.username, event: 'left' });
  });
  socket.on('set-name', (name) => {
    socket.username = name;
    io.emit('users-changed', { user: name, event: 'joined' });
  });

  socket.on('send-message', (message) => {
    io.emit('message', {
      msg: message.text,
      user: socket.username,
      createdAt: new Date(),
    });
  });
});
var port = 3000;
server.listen(port, function (p) {
  console.log('listening in http://localhost:' + port);
});
