"use client"; 
import React, { useState, useEffect } from "react";
import Link from "next/link"; // 用於動態路由連結
import { getFactoryContract } from "../utils/ethers";

export default function HomePage() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const factory = await getFactoryContract();
        const deployed = await factory.getDeployedCampaigns();
        setCampaigns(deployed);
      } catch (err) {
        console.error("Failed to load campaigns:", err);
      }
    }
    loadCampaigns();
  }, []);

  return (
    <div>
      <h1>Fundraising Platform</h1>
      <h2>已部署的 Campaigns:</h2>
      <ul>
        {campaigns.map((addr) => (
          <li key={addr}>
            <Link href={`/campaigns/${addr}`}>
              {addr}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
