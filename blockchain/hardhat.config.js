require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {},  
    sepolia: {  
      url: process.env.SEPOLIA_RPC,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};

const fs = require("fs");
const path = require("path");

task("copy-abi", "Copies ABI files to frontend", async () => {
  console.log("\n🚀 Copying ABI files to frontend...");
  const abiDir = path.join(__dirname, "../web/src/utils/abis");
  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir, { recursive: true });
  }

  fs.copyFileSync(
    path.join(__dirname, "./artifacts/contracts/Campaign.sol/CampaignFactory.json"),
    path.join(abiDir, "CampaignFactory.json")
  );

  fs.copyFileSync(
    path.join(__dirname, "./artifacts/contracts/Campaign.sol/Campaign.json"),
    path.join(abiDir, "Campaign.json")
  );

  console.log("✅ ABI copied to frontend");
});

task("compile", "Compile contracts & copy ABI").setAction(async (_, { run }) => {
  await run("compile:solidity", { force: false, quiet: false });
  await run("copy-abi");
});
