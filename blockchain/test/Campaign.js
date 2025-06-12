const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CampaignFactory & Campaign (with 2% fee)", function () {
  let factory;
  let campaign;
  let owner, user1, user2, user3, recipient;
  const feeRecipient = "0xaada21fD544dA24B3b96E465C4c7074f4D6E8632";

  async function getLatestCampaign(factoryInstance) {
    const [campaignAddress] = await factoryInstance.getDeployedCampaigns();
    const Campaign = await ethers.getContractFactory("Campaign");
    return await Campaign.attach(campaignAddress);
  }

  async function createTestCampaign(minimum = "1", target = "10") {
    await factory.connect(owner).createCampaign(
      ethers.parseEther(minimum),
      "Test Campaign",
      "This is a test campaign.",
      ethers.parseEther(target),
       "test@contact.com",
      { value: ethers.parseEther("0.05") }
    );
    campaign = await getLatestCampaign(factory);
  }

  beforeEach(async function () {
    [owner, user1, user2, user3, recipient] = await ethers.getSigners();

    const CampaignFactory = await ethers.getContractFactory("CampaignFactory");
    factory = await CampaignFactory.deploy();
    await factory.waitForDeployment();
  });

  it("should deploy multiple campaigns with correct managers", async function () {
    await factory.connect(owner).createCampaign(
      ethers.parseEther("1"),
      "Campaign 1",
      "Desc 1",
      ethers.parseEther("10"),
       "campaign1@example.com",
      { value: ethers.parseEther("0.05") }
    );
    await factory.connect(user1).createCampaign(
      ethers.parseEther("2"),
      "Campaign 2",
      "Desc 2",
      ethers.parseEther("10"),
      "campaign2@example.com",
      { value: ethers.parseEther("0.05") }
    );

    const campaigns = await factory.getDeployedCampaigns();
    expect(campaigns.length).to.equal(2);

    const Campaign = await ethers.getContractFactory("Campaign");
    const campaign1 = await Campaign.attach(campaigns[0]);
    const campaign2 = await Campaign.attach(campaigns[1]);

    expect(await campaign1.manager()).to.equal(owner.address);
    expect(await campaign2.manager()).to.equal(user1.address);
  });

  it("should enforce minimum contribution", async function () {
    await createTestCampaign();

    await expect(
      campaign.connect(user1).contribute({ value: ethers.parseEther("0.5") })
    ).to.be.revertedWith("Contribution too small");

    await campaign.connect(user1).contribute({ value: ethers.parseEther("2") });
    expect(await campaign.approvers(user1.address)).to.equal(true);
  });

  it("should not finalize request if approvals are less than 2/3", async function () {
    await createTestCampaign();

    await campaign.connect(user1).contribute({ value: ethers.parseEther("2") });
    await campaign.connect(user2).contribute({ value: ethers.parseEther("2") });
    await campaign.connect(user3).contribute({ value: ethers.parseEther("2") });

    await campaign.connect(owner).createRequest("Buy chairs", ethers.parseEther("3"), recipient.address);
    await campaign.connect(user1).approveRequest(0);

    await expect(campaign.connect(owner).finalizeRequest(0)).to.be.revertedWith("Not enough approvals");
  });

  it("should not finalize request if contract has insufficient balance", async function () {
    await createTestCampaign();

    await campaign.connect(user1).contribute({ value: ethers.parseEther("2") });
    await campaign.connect(user2).contribute({ value: ethers.parseEther("2") });
    await campaign.connect(user3).contribute({ value: ethers.parseEther("2") });

    await campaign.connect(owner).createRequest("Buy server", ethers.parseEther("10"), recipient.address);

    await campaign.connect(user1).approveRequest(0);
    await campaign.connect(user2).approveRequest(0);
    await campaign.connect(user3).approveRequest(0);

    await expect(campaign.connect(owner).finalizeRequest(0)).to.be.revertedWith("Insufficient funds");
  });

  it("should revert if the same user tries to approve twice", async () => {
    await createTestCampaign();

    await campaign.connect(user1).contribute({ value: ethers.parseEther("2") });
    await campaign.connect(owner).createRequest("Chair", ethers.parseEther("1"), recipient.address);
    await campaign.connect(user1).approveRequest(0);

    await expect(campaign.connect(user1).approveRequest(0)).to.be.revertedWith("Already approved");
  });

  it("should revert if a non-approver tries to approve a request", async () => {
    await createTestCampaign();

    await campaign.connect(owner).createRequest("Chair", ethers.parseEther("1"), recipient.address);

    await expect(
      campaign.connect(user2).approveRequest(0)
    ).to.be.revertedWith("Only approvers can approve requests");
  });

  it("should emit ContributionReceived event", async () => {
    await createTestCampaign();

    await expect(
      campaign.connect(user1).contribute({ value: ethers.parseEther("2") })
    ).to.emit(campaign, "ContributionReceived").withArgs(user1.address, ethers.parseEther("2"));
  });

  it("should return correct summary from getSummary()", async function () {
    await createTestCampaign();

    await campaign.connect(user1).contribute({ value: ethers.parseEther("2") });

    const summary = await campaign.getSummary();
    expect(summary[0]).to.equal(ethers.parseEther("1")); // minimumContribution
    expect(summary[3]).to.equal(1); // approversCount
    expect(summary[4]).to.equal(owner.address); // manager
  });

  it("should return correct request data from getRequest()", async function () {
    await createTestCampaign();

    await campaign.connect(owner).createRequest("Buy CPU", ethers.parseEther("5"), recipient.address);

    const [description, value, recipientAddr, complete, approvalCount] = await campaign.getRequest(0);

    expect(description).to.equal("Buy CPU");
    expect(value).to.equal(ethers.parseEther("5"));
    expect(recipientAddr).to.equal(recipient.address);
    expect(complete).to.equal(false);
    expect(approvalCount).to.equal(0);
  });

  it("should only allow manager to set approval threshold", async () => {
    await createTestCampaign();

    await expect(
      campaign.connect(user1).setApprovalThreshold(90)
    ).to.be.revertedWith("Only manager can call this function");

    await campaign.connect(owner).setApprovalThreshold(75);
    expect(await campaign.approvalThreshold()).to.equal(75);
  });

  it("should successfully complete a full campaign workflow with 2% fee", async function () {
    await createTestCampaign();

    await campaign.connect(user1).contribute({ value: ethers.parseEther("2") });
    await campaign.connect(user2).contribute({ value: ethers.parseEther("2") });
    await campaign.connect(user3).contribute({ value: ethers.parseEther("2") });

    await campaign.connect(owner).createRequest(
      "Buy components",
      ethers.parseEther("3"),
      recipient.address
    );

    await campaign.connect(user1).approveRequest(0);
    await campaign.connect(user2).approveRequest(0);

    const balanceBefore = await ethers.provider.getBalance(recipient.address);
    const feeRecipientBefore = await ethers.provider.getBalance(feeRecipient);

    await campaign.connect(owner).finalizeRequest(0);

    const balanceAfter = await ethers.provider.getBalance(recipient.address);
    const feeRecipientAfter = await ethers.provider.getBalance(feeRecipient);

    const threeEther = ethers.parseEther("3"); // BigInt
    const received = balanceAfter - balanceBefore;
    const expected = (threeEther * 98n) / 100n;
    const fee = (threeEther * 2n) / 100n;

    console.log("✅ Recipient received:", ethers.formatEther(received), "ETH");
    console.log("✅ Fee sent:", ethers.formatEther(fee), "ETH");

    expect(received).to.equal(expected);
    expect(feeRecipientAfter - feeRecipientBefore).to.equal(fee);
  });
});
