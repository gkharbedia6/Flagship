import express from "express";
import * as path from "path";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import compression from "compression";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import { router } from "./router";

dotenv.config();

const port = process.env.PORT || 8080;

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:4200",
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
app.use(express.static(path.join(__dirname, "public")));

app.get("/api", (req, res) => {
  res.send({ message: "Hello API" });
});

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
  throw new Error("ATLAS_URI is not defined");
}

mongoose.Promise = Promise;
mongoose.connect(ATLAS_URI);
mongoose.connection.on("error", (error: Error) => {
  console.log(error);
});

app.use("/api", router());
