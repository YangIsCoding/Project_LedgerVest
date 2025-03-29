const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  console.log("\n🚀 Deploying CampaignFactory...");

  const CampaignFactory = await hre.ethers.getContractFactory("CampaignFactory");
  const campaignFactory = await CampaignFactory.deploy();
  await campaignFactory.waitForDeployment();

  const factoryAddress = await campaignFactory.getAddress();
  console.log(`✅ CampaignFactory deployed at: ${factoryAddress}`);

  // ✅ 儲存 ABI 與合約地址，供前端使用
  const abiDir = path.join(__dirname, "../../web/src/utils/abis");
  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir, { recursive: true });
  }
  console.log(abiDir);
  fs.writeFileSync(
    path.join(abiDir, "contract-address.json"),
    JSON.stringify({ CampaignFactory: factoryAddress }, null, 2)
  );

  fs.copyFileSync(
    path.join(__dirname, "../artifacts/contracts/Campaign.sol/CampaignFactory.json"),
    path.join(abiDir, "CampaignFactory.json")
  );

  fs.copyFileSync(
    path.join(__dirname, "../artifacts/contracts/Campaign.sol/Campaign.json"),
    path.join(abiDir, "Campaign.json")
  );

  console.log("📄 ABI & Contract Address copied to frontend ✅");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
