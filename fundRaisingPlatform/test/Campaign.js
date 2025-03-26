const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CampaignFactory & Campaign", function () {
  let factoryContract;
  let factory;
  let campaign;
  let owner, user1, user2, user3, recipient;

  beforeEach(async function () {
    [owner, user1, user2, user3, recipient] = await ethers.getSigners();

    const CampaignFactory = await ethers.getContractFactory("CampaignFactory");
    factory = await CampaignFactory.deploy();
    await factory.waitForDeployment();

    console.log("\n🏗️  Factory deployed at:", await factory.getAddress());
  });

  it("should deploy multiple campaigns with correct managers", async function () {
    await factory.connect(owner).createCampaign(ethers.parseEther("1"));
    await factory.connect(user1).createCampaign(ethers.parseEther("2"));

    const campaigns = await factory.getDeployedCampaigns();
    console.log("📦 Total deployed campaigns:", campaigns.length);
    expect(campaigns.length).to.equal(2);

    const Campaign = await ethers.getContractFactory("Campaign");

    const campaign1 = await Campaign.attach(campaigns[0]);
    const campaign2 = await Campaign.attach(campaigns[1]);

    const manager1 = await campaign1.manager();
    const manager2 = await campaign2.manager();

    console.log("👤 Campaign 1 manager:", manager1);
    console.log("👤 Campaign 2 manager:", manager2);

    expect(manager1).to.equal(owner.address);
    expect(manager2).to.equal(user1.address);
  });

  it("should enforce minimum contribution", async function () {
    await factory.createCampaign(ethers.parseEther("1"));
    const [campaignAddress] = await factory.getDeployedCampaigns();
    const Campaign = await ethers.getContractFactory("Campaign");
    campaign = await Campaign.attach(campaignAddress);

    const min = await campaign.minimumContribution();
    console.log("💰 Minimum Contribution:", ethers.formatEther(min), "ETH");
    expect(min).to.equal(ethers.parseEther("1"));

    console.log("❌ Try contributing 0.5 ETH (should fail)");
    await expect(
      campaign.connect(user1).contribute({ value: ethers.parseEther("0.5") })
    ).to.be.revertedWith("Contribution too small");

    console.log("✅ Contributing 2 ETH (should pass)");
    await campaign.connect(user1).contribute({ value: ethers.parseEther("2") });

    const isApprover = await campaign.approvers(user1.address);
    expect(isApprover).to.equal(true);
  });

  it("should not finalize request if approvals are less than 2/3", async function () {
    await factory.createCampaign(ethers.parseEther("1"));
    const [campaignAddress] = await factory.getDeployedCampaigns();
    const Campaign = await ethers.getContractFactory("Campaign");
    campaign = await Campaign.attach(campaignAddress);

    console.log("🔧 Contributing...");
    await campaign.connect(user1).contribute({ value: ethers.parseEther("2") });
    await campaign.connect(user2).contribute({ value: ethers.parseEther("2") });
    await campaign.connect(user3).contribute({ value: ethers.parseEther("2") });

    console.log("📝 Creating request...");
    await campaign.connect(owner).createRequest(
      "Buy chairs",
      ethers.parseEther("3"),
      recipient.address
    );

    console.log("🗳️ Only user1 approves");
    await campaign.connect(user1).approveRequest(0);

    console.log("🚫 Finalizing (should fail due to insufficient votes)");
    await expect(campaign.connect(owner).finalizeRequest(0)).to.be.revertedWith("Not enough approvals");
  });

  it("should not finalize request if contract has insufficient balance", async function () {
    await factory.createCampaign(ethers.parseEther("1"));
    const [campaignAddress] = await factory.getDeployedCampaigns();
    const Campaign = await ethers.getContractFactory("Campaign");
    campaign = await Campaign.attach(campaignAddress);

    await campaign.connect(user1).contribute({ value: ethers.parseEther("2") });
    await campaign.connect(user2).contribute({ value: ethers.parseEther("2") });
    await campaign.connect(user3).contribute({ value: ethers.parseEther("2") });

    console.log("📝 Creating OVER-BUDGET request...");
    await campaign.connect(owner).createRequest(
      "Buy server",
      ethers.parseEther("10"),
      recipient.address
    );

    await campaign.connect(user1).approveRequest(0);
    await campaign.connect(user2).approveRequest(0);
    await campaign.connect(user3).approveRequest(0);

    console.log("🚫 Finalizing (should fail due to insufficient contract balance)");
    await expect(campaign.connect(owner).finalizeRequest(0)).to.be.revertedWith("Insufficient funds");
  });

  it("should successfully complete a full campaign workflow", async function () {
    await factory.createCampaign(ethers.parseEther("1"));
    const [campaignAddress] = await factory.getDeployedCampaigns();
    const Campaign = await ethers.getContractFactory("Campaign");
    campaign = await Campaign.attach(campaignAddress);

    console.log("💸 Contributors: user1, user2, user3");
    await campaign.connect(user1).contribute({ value: ethers.parseEther("2") });
    await campaign.connect(user2).contribute({ value: ethers.parseEther("2") });
    await campaign.connect(user3).contribute({ value: ethers.parseEther("2") });

    console.log("📝 Creating request to send 3 ETH to recipient...");
    await campaign.connect(owner).createRequest(
      "Buy components",
      ethers.parseEther("3"),
      recipient.address
    );

    await campaign.connect(user1).approveRequest(0);
    await campaign.connect(user2).approveRequest(0);

    const initialBalance = await ethers.provider.getBalance(recipient.address);
    console.log("📊 Recipient initial balance:", ethers.formatEther(initialBalance));

    console.log("✅ Finalizing request...");
    await campaign.connect(owner).finalizeRequest(0);

    const finalBalance = await ethers.provider.getBalance(recipient.address);
    const received = finalBalance - initialBalance;

    console.log("🎉 Recipient received:", ethers.formatEther(received), "ETH");
    expect(received).to.equal(ethers.parseEther("3"));
  });
});
