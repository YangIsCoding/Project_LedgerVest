# 🧪 Test Documentation: CampaignFactory & Campaign (with 2% fee)

This document explains the unit tests in `test/Campaign.js`, covering all major functionalities and logic validations of the smart contract system.

---

## ✅ Test Environment

- Framework: [Hardhat](https://hardhat.org/)
- Language: JavaScript (Chai + Mocha)
- Packages:
  - `ethers`: Blockchain interaction
  - `chai`: Assertions and test validation
- Test command:

  ```bash
  npx hardhat test
  ```

---

## 📋 Test Cases Overview

### ✅ Basic Functionality Tests

- `should deploy multiple campaigns with correct managers`  
  Tests whether the factory can successfully deploy multiple campaigns and validates that the manager address is correct.

- `should enforce minimum contribution`  
  Verifies that contributions below the minimum threshold are correctly reverted.

- `should emit ContributionReceived event`  
  Ensures that `contribute()` emits the expected event.

---

### 🗳️ Request & Voting Logic

- `should not finalize request if approvals are less than 2/3`  
  Validates that the request cannot be finalized if not enough votes are collected.

- `should not finalize request if contract has insufficient balance`  
  The request should be rejected if the requested amount exceeds the contract's balance.

- `should revert if the same user tries to approve twice`  
  The same approver should not be able to vote on the same request twice.

- `should revert if a non-approver tries to approve a request`  
  Users who haven't contributed should not be allowed to vote.

---

### 🧾 Data Retrieval Features

- `should return correct summary from getSummary()`  
  Checks that `getSummary()` returns correct values for minimum, balance, approver count, etc.

- `should return correct request data from getRequest()`  
  Validates that `getRequest()` returns all fields of the specified request correctly.

---

### 🔐 Access Control Tests

- `should only allow manager to set approval threshold`  
  Verifies that only the campaign manager can change the approval threshold.

---

### 💸 Full Workflow Validation

- `should successfully complete a full campaign workflow with 2% fee`  
  Validates the full process: contribution → request creation → voting → finalization, including proper 2% platform fee deduction from each request.

---

## 🔁 Reusable Utility

### `getLatestCampaign(factoryInstance)`

Helper function used to attach a contract instance from the latest deployed campaign:

```js
async function getLatestCampaign(factoryInstance) {
  const [campaignAddress] = await factoryInstance.getDeployedCampaigns();
  const Campaign = await ethers.getContractFactory("Campaign");
  return await Campaign.attach(campaignAddress);
}
```

---

## 💡 Notable Validation Points

- ✅ All `.revertedWith(...)` checks include specific error messages
- ✅ Uses BigInt for precise fee and amount calculations (2% accuracy)
- ✅ Verifies that the platform fee recipient receives correct balance
- ✅ Each event has at least one unit test to validate emission

---

## 📦 Suggested Enhancements

- Add test: fallback / receive calls should correctly trigger `contribute`
- Add edge case tests: e.g., invalid request index or bad address input
- E2E integration test: combine Hardhat Network with Playwright for UI flow simulation

---

## 🙌 Author

- Author: **Chen Pin Yang**
- For: Duke FinTech 512 Final Project
- GitHub: [@YangIsCoding](https://github.com/YangIsCoding)
