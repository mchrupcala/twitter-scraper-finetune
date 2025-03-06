import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Twitter Scraper API is running 🚀" });
});

app.listen(PORT, () => console.log("API running on port: ", PORT));
