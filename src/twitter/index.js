// index.js
import dotenv from "dotenv";
dotenv.config();

import TwitterPipeline from "./TwitterPipeline.js";
import Logger from "./Logger.js";

process.on("unhandledRejection", (error) => {
  Logger.error(`❌ Unhandled promise rejection: ${error.message}`);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  Logger.error(`❌ Uncaught exception: ${error.message}`);
  process.exit(1);
});

/**
 * Runs the Twitter pipeline for a given username.
 * @param {string} username - The Twitter username to scrape.
 */
export async function runTwitterPipeline(username) {
  const pipeline = new TwitterPipeline(username);

  const cleanup = async () => {
    Logger.warn("\n🛑 Received termination signal. Cleaning up...");
    try {
      if (pipeline.scraper) {
        await pipeline.scraper.logout();
        Logger.success("🔒 Logged out successfully.");
      }
    } catch (error) {
      Logger.error(`❌ Error during cleanup: ${error.message}`);
    }
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  await pipeline.run();
}

// Check if script is run via CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const username = args[0] || "degenspartan";

  runTwitterPipeline(username).catch(() => process.exit(1));
}
