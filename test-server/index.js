import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 4201 });

wss.on("connection", async (ws) => {
  let closed = false;
  ws.onclose = () => {
    closed = true;
  };
  while (!closed) {
    ws.send(Math.random() * 11);
    await new Promise((resolve) => setTimeout(resolve, 1000 / 60));
  }
});
