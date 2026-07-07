require("dotenv").config();
const connectDB = require("./config/db");
const { runSeed } = require("./utils/seedData");

async function run() {
  await connectDB();
  const force = process.argv.includes("--force");
  const log = await runSeed({ force });
  log.forEach((line) => console.log("✅", line));
  console.log("🌱 Hoàn tất!");
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
