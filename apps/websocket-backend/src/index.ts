import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws, request) => {
  ws.on('error', console.error);

  ws.on('message', (data) => {
    console.log("recievec: %s", data);
  });
  const url = request.url;
  const queryParams = new URLSearchParams(url?.split('?')[1]);
  const token = queryParams.get('token') || "";
  const decode = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

  if (typeof decode === 'string') {
    ws.close();
    return;
  }

  if (!decode || decode.user.user) {
    ws.close();
    return;
  }

  ws.on('message', (data) => {
    ws.send('pong');
  })

  // ws.send('something');
});
