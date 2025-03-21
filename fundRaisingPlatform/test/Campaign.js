const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Campaign", function () {
  let Campaign, campaign;
  let owner, user1, user2, user3, recipient;

  beforeEach(async function () {
    [owner, user1, user2, user3, recipient] = await ethers.getSigners();

    Campaign = await ethers.getContractFactory("Campaign");
    campaign = await Campaign.deploy(ethers.parseEther("1"));
    await campaign.waitForDeployment();

    console.log("\nCampaign deployed at:", await campaign.getAddress());
    console.log("👤 Manager (Owner):", owner.address);

    await campaign.connect(user1).contribute({ value: ethers.parseEther("2") });
    await campaign.connect(user2).contribute({ value: ethers.parseEther("2") });
    await campaign.connect(user3).contribute({ value: ethers.parseEther("2") });

    console.log("Approvers:", user1.address, user2.address, user3.address);

    await campaign.connect(owner).createRequest("Buy materials", ethers.parseEther("3"), recipient.address);
  });

  it("should not finalize request if approvals are less than 2/3", async function () {
    console.log("🗳️ user1 approving request...");
    await campaign.connect(user1).approveRequest(0); 

    await expect(
      campaign.connect(owner).finalizeRequest(0)
    ).to.be.revertedWith("Not enough approvals");
  });

  it("should finalize request if approvals are more than 2/3", async function () {
    console.log("user1 approving request...");
    await campaign.connect(user1).approveRequest(0);
    
    console.log("user2 approving request...");
    await campaign.connect(user2).approveRequest(0); 

    console.log("Finalizing request...");
    await campaign.connect(owner).finalizeRequest(0);

    const request = await campaign.requests(0);
    console.log("Request complete:", request.complete);
    expect(request.complete).to.be.true;
  });

  it("should transfer funds to the recipient after finalization", async function () {
    const initialBalance = await ethers.provider.getBalance(recipient.address);

    await campaign.connect(user1).approveRequest(0);
    await campaign.connect(user2).approveRequest(0);
    await campaign.connect(owner).finalizeRequest(0);

    const finalBalance = await ethers.provider.getBalance(recipient.address);
    const receivedFunds = finalBalance - initialBalance;

    console.log("Funds received by recipient:", ethers.formatEther(receivedFunds), "ETH");

    expect(receivedFunds).to.equal(ethers.parseEther("3"));
  });


  it("should not allow finalizing the same request twice", async function () {
    await campaign.connect(user1).approveRequest(0);
    await campaign.connect(user2).approveRequest(0);
    await campaign.connect(owner).finalizeRequest(0); 

    console.log("Trying to finalize again...");
    await expect(
      campaign.connect(owner).finalizeRequest(0)
    ).to.be.revertedWith("Request already finalized"); 
  });

  it("should not finalize request if contract has insufficient balance", async function () {
    await campaign.connect(owner).createRequest("Expensive Item", ethers.parseEther("10"), recipient.address);

    await campaign.connect(user1).approveRequest(1);
    await campaign.connect(user2).approveRequest(1);

    console.log("Trying to finalize request with insufficient funds...");
    await expect(
      campaign.connect(owner).finalizeRequest(1)
    ).to.be.revertedWith("Insufficient funds"); 
  });
});
