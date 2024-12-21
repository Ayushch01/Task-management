import express from "express";
import router from "./routes";
import cors from "cors"
import { envConfigs } from "./config/envconfig";
import swagger from "swagger-ui-express";
import apiDocs from "./config/swagger";
import limiter from "./helpers/rateLimit";
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  allowedHeaders: ['Authorization', 'Content-Type'],
}));
// app.use(limiter)

app.use("/", router);

app.use(
  "/api-doc",
  swagger.serve,
  swagger.setup(apiDocs, {
    swaggerOptions: {
      plugins: [],
    },
  })
);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

app.listen(envConfigs.port, () => {
  console.log(`Server started on ${envConfigs.port}`);
});

export default io
