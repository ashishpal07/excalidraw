import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];



function checkUser (token: string): string | null {
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
  
    if (typeof decode === 'string') {
      return null;
    }
  
    if (!decode || decode.user.user) {
      return null;
    }
  
    return decode.user.user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

wss.on('connection', (ws, request) => {
  ws.on('error', console.error);

  ws.on('message', (data) => {
    console.log("recievec: %s", data);
  });
  const url = request.url;
  const queryParams = new URLSearchParams(url?.split('?')[1]);
  const token = queryParams.get('token') || "";
  
  const userId = checkUser(token);

  if (userId === null) {
    ws.close();
    return;
  }

  users.push({
    userId: userId,
    rooms: [],
    ws: ws
  });

  ws.on('message', (data) => {
    const parseData = JSON.parse(data as unknown as string);
    if (parseData.type === "join_room") {
      // TODO: check room is exist
      // TODO: check user is allwed to join this room
      const user = users.find(x => x.ws === ws);
      user?.rooms.push(parseData.roomId);
    }

    if (parseData.type === "leave_room") {
      const user = users.find(x => x.ws === ws);
      if (user) {
        user.rooms = user.rooms.filter(x => x === parseData.roomId);
      }
    }

    if (parseData.type === "chat") {
      const roomId = parseData.roomId;
      const message = parseData.message;

      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(JSON.stringify({
            type: "chat",
            message: message,
            roomId
          }));
        }
      });
    }
  })

  // ws.send('something');
});
