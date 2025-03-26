"use client";
import React, { useState } from "react";
import { getFactoryContractWithSigner } from "../../src/utils/ethers";

export default function CreateCampaignPage() {
  const [minimum, setMinimum] = useState("");

  async function handleCreateCampaign() {
    try {
      // 取得具有 signer 的 CampaignFactory
      const factoryWithSigner = await getFactoryContractWithSigner();
      // 呼叫 createCampaign
      const tx = await factoryWithSigner.createCampaign(minimum);
      await tx.wait();  // 等待交易完成

      alert("Campaign created successfully!");
      setMinimum("");
    } catch (error) {
      console.error("Create Campaign failed:", error);
      alert("Failed to create campaign!");
    }
  }

  return (
    <div>
      <h1>Create a Campaign</h1>
      <div>
        <label>Minimum contribution (wei): </label>
        <input
          type="number"
          placeholder="Enter minimum wei"
          value={minimum}
          onChange={(e) => setMinimum(e.target.value)}
        />
      </div>
      <button onClick={handleCreateCampaign}>Create</button>
    </div>
  );
}
