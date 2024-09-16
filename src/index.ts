import express, { Application } from "express";
import bodyParser from "body-parser";
import { serve, setup } from "swagger-ui-express";
import Routes from "./routes";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path'
import { bootstrapAdmin } from "./utils/bootstrap.util";
let swaggerDoc = require('../public/swagger/swagger.json')

dotenv.config({ path: path.join(__dirname, '..', '.env') })
// connect to mongodb
require("./configs/mongoose.config");
const PORT = process.env.PORT || 4000;

const app: Application = express();
var server = require('http').createServer(app);
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", 1);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, authtoken, x-forwarded-for"
  );
  next();
});


// Middleware to block /postman requests
if (process.env.MODE != "local") {
  app.use((req, res, next) => {
    const userAgent = req.get('User-Agent');
    if (userAgent && userAgent.includes('Postman')) {
      return res.status(403).send('Access Forbidden');
    }
    next();
  });
}

// Middleware to block /swagger requests
if (process.env.MODE != "local") {
  app.use((req, res, next) => {
    if (req.url.includes('/swagger')) {
      return res.status(403).send('Access Forbidden');
    }
    next();
  });
}

const corsOptions = {
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'authtoken', 'x-forwarded-for', 'Accept', 'Origin', 'X-Requested-With'],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("public"));
if (process.env.MODE == "local") {
  app.use(
    '/swagger',
    serve,
    setup(swaggerDoc)
  )
}

// Use body parser to read sent json payloads
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.get('/health', (req, res) => {
  res.send('Okay!!');
});
app.use("/api", Routes);

bootstrapAdmin(() => {
  console.log("Bootstraping finished!");
});

server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
  console.log("swagger link ", `localhost:${PORT}/swagger`);
});


