import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { runTwitterPipeline } from "../src/twitter/index.js";
import { generateCharacter } from "../src/character/GenerateCharacter.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Twitter Scraper API is running 🚀" });
});

app.post("/scrape", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username)
      return res.status(400).json({ error: "Username is required" });

    console.log("Scraping tweets for ", username);
    const tweets = await runTwitterPipeline(username);
    return res.json({ success: true, tweets });
  } catch (err) {
    console.error("Failed to scrape twitter profile: ", err);
    return res.status(500).json({ error: "Failed to scrape tweets" });
  }
});

app.post("/generate", async (req, res) => {
  try {
    const { username, date } = req.body;
    if (!username)
      return res.status(400).json({ error: "Username is required" });

    if (!date) return res.status(400).json({ error: "Date is required" });

    console.log("Creating character for ", username);
    const characterTweets = await generateCharacter(username, date);
    return res.json({ success: true, characterTweets });
  } catch (err) {
    console.error("Failed to scrape twitter profile: ", err);
    return res.status(500).json({ error: "Failed to scrape tweets" });
  }
});

app.listen(PORT, () => console.log("API running on port: ", PORT));
