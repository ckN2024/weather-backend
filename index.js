import express from "express"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import connectDB from "./config/connectDB.js"
import weatherRoutes from "./routes/weatherRoutes.js"
import cors from "cors"

dotenv.config()
connectDB()

const app = express();
const PORT = process.env.WEATHER_PORT || 6000;

// cors configuration
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// body parser middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// route middlewares
app.use("/api/weather", weatherRoutes);

app.listen(PORT, () => {
  console.log(`weather server running on port: ${PORT}`);
});
