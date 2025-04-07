# 💸 CampaignFactory & Campaign Smart Contract System

## 🧠 Project Overview

This project is a smart contract system for a **Decentralized Crowdfunding Platform**, allowing anyone to:

- Create personal fundraising campaigns
- Collect public donations
- Propose spending requests for campaign funds
- Have those requests approved via decentralized voting by contributors
- Distribute funds to recipients upon majority approval

All operations are **transparent, verifiable, and audit-friendly**, suitable for personal fundraising, charity projects, DAO fund governance, and more.

---

## 📦 Contract Structure

### 1. `CampaignFactory`

- Manages creation and tracking of all campaigns.
- Includes platform fee logic: `createCampaign` requires 2% fee sent to the platform.

### 2. `Campaign`

- Represents a single fundraising campaign.
- Handles contributions, spending requests, voting, fund release, and more.
- Applies a 2% platform fee during request finalization.

---

## 🚀 Core Features

### ✅ `CampaignFactory`

| Function | Description |
|----------|-------------|
| `createCampaign(uint minimum)` | Deploy a new campaign with a minimum contribution setting. Any ETH can be sent (2% will go to the platform). |
| `getDeployedCampaigns()` | Returns an array of deployed campaign addresses. |

> 🧾 Platform automatically deducts `2%` and sends it to: `0xaada21fD544dA24B3b96E465C4c7074f4D6E8632`

---

### ✅ `Campaign`

| Function | Description |
|----------|-------------|
| `contribute()` | Send ETH to the campaign. Must be ≥ minimumContribution. Sender becomes an approver. |
| `createRequest(description, value, recipient)` | Manager proposes a request to spend funds. |
| `approveRequest(index)` | Approvers vote to approve a spending request. Only once per request. |
| `finalizeRequest(index)` | Finalizes request. If approvals are sufficient and balance is enough, sends funds to recipient minus 2% fee. |
| `setApprovalThreshold(uint)` | Manager can adjust the voting threshold (default: 66%, max: 100). |
| `getSummary()` | Returns summary info for front-end use. |
| `getRequest(index)` | Returns data for a specific request. |

---

## 📊 Event Logs

| Event | Description |
|-------|-------------|
| `ContributionReceived(address contributor, uint amount)` | Emitted when a contribution is made. |
| `RequestCreated(uint index, string desc, uint value, address recipient)` | Emitted when a new request is created. |
| `RequestApproved(uint index, address approver)` | Emitted when an approver votes. |
| `RequestFinalized(uint index)` | Emitted when a request is successfully finalized. |

---

## 🛡️ Security & Restriction Design

- `contribute()` enforces minimum ETH requirement to prevent spam.
- `approveRequest()` only available to contributors and only once per request.
- `createRequest()` and `finalizeRequest()` restricted to campaign manager.
- `finalizeRequest()` checks:
  - Vote threshold met
  - Request not already completed
  - Contract has enough ETH
- 2% platform fee is deducted from all finalized requests.

---

## 💰 Fee Logic

| Action | Fee Details |
|--------|-------------|
| `createCampaign()` | Any ETH can be sent; 2% is automatically deducted and sent to the platform. |
| `finalizeRequest()` | 2% is deducted from the request value before sending to recipient. |

**Platform fee recipient address:**
`0xaada21fD544dA24B3b96E465C4c7074f4D6E8632`

---

## 🧪 Test Coverage (Examples)

- ✅ Campaign deployment
- ✅ Contribution success / rejection on low amount
- ✅ Request creation and approval flow
- ✅ Rejection on finalize if conditions not met (low approval, insufficient funds)
- ✅ Recipient receives funds + platform receives fee
- ✅ Event logs correctly emitted
- ✅ Proper access control (only manager can execute restricted functions)

---

## 🌐 Use Cases

- DAO fund governance
- Charity and non-profit fundraising
- Collaborative project financial management
- DAO on-chain proposal systems with voting

---

## 🛠️ Deployment (Hardhat)

```bash
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.js --network localhost
```

📁 **ABI & Front-End Integration**  
After deployment, ABI will be copied to the `frontend/abi/` folder. Can be integrated using `ethers.js` or `wagmi`.

---

## 👨‍💻 Author / Maintainer

- Name: **Chen Pin Yang**
- Project: **Duke FinTech 512 Final Project**
- GitHub: [@YangIsCoding](https://github.com/YangIsCoding)
