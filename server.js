const { WebSocketServer } = require('ws'); // npm i ws
const wss = new WebSocketServer({ port: parseInt(process.env.NEXT_PUBLIC_WS_PORT || '8081') });
wss.on('connection', (ws) => {
  ws.on('message', (m) =>
    setTimeout(() => ws.readyState === 1 && ws.send(m.toString()), 300),
  );
  setTimeout(() => ws.terminate(), 25000 + Math.random() * 10000);
});
