"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getProvider,
  getCampaignContract,
  getCampaignContractWithSigner
} from "../../../utils/ethers";

export default function CampaignPage() {
  const { address } = useParams();

  const [manager, setManager] = useState("");
  const [minimumContribution, setMinimumContribution] = useState("0");
  const [balance, setBalance] = useState("0");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        // 1. 取得單一 Campaign 的「只讀」合約
        const campaign = await getCampaignContract(address);

        // 2. 呼叫合約的公開屬性或 function
        const mgr = await campaign.manager();
        const minContr = await campaign.minimumContribution();

        // 3. 改用「外部 provider」查詢該地址餘額 (Ethers v6 下 .provider 不存在)
        const provider = getProvider();
        const bal = await provider.getBalance(address); // 回傳 BigInt

        // 4. 更新 state
        setManager(mgr);
        setMinimumContribution(minContr.toString());
        setBalance(bal.toString()); 
      } catch (err) {
        console.error("Error loading campaign data:", err);
      }
    }

    if (address) {
      loadData();
    }
  }, [address]);

  async function handleContribute() {
    try {
      // 取得「可發送交易」的合約 (帶 signer)
      const campaignWithSigner = await getCampaignContractWithSigner(address);
      // 發送 contribute 交易，指定 value=amount (wei)
      const tx = await campaignWithSigner.contribute({ value: amount });
      await tx.wait();

      alert("Contribute success!");
      setAmount("");

      // ⚠ 若要更新餘額，可再次呼叫 loadData()
    } catch (err) {
      console.error("Contribute failed:", err);
      alert("Contribute failed!");
    }
  }

  return (
    <div>
      <h1>Campaign @ {address}</h1>
      <p>Manager: {manager}</p>
      <p>Minimum Contribution: {minimumContribution} wei</p>
      <p>Balance: {balance} wei</p>
      <hr />
      <div>
        <h3>Contribute</h3>
        <input
          type="number"
          placeholder="Amount in wei"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleContribute}>Contribute</button>
      </div>
    </div>
  );
}
