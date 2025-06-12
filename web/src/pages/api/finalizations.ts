// /pages/api/stats/finalizations-received.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { getProvider } from '@/utils/ethers';
import CampaignABI from '@/app/data/CampaignABI.json'; // 你 Campaign.sol 的 ABI
import campaignMeta from '@/app/data/campaignMeta.json'; // 你目前 deployed campaign meta

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress } = req.query;

  if (typeof walletAddress !== 'string') {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }

  try {
    const provider = getProvider();

    const allFinalizations = [];

    for (const meta of campaignMeta) {
      const contract = new ethers.Contract(meta.contractAddress, CampaignABI, provider);

      const events = await contract.queryFilter(
        contract.filters.RequestFinalized(null, null, walletAddress), // 你加了 fundSeekerAddr → 第三參數
        0,
        'latest'
      );

      for (const ev of events) {
        const eventLog = ev as ethers.EventLog; // 顯式斷言

        const block = await provider.getBlock(ev.blockNumber);
        if (!block) continue;

        allFinalizations.push({
          amount: eventLog.args?.amount?.toString(),
          timestamp: new Date(block.timestamp * 1000).toISOString(),
          campaignAddr: meta.contractAddress
        });
      }
    }

    // sort
    allFinalizations.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    res.status(200).json(allFinalizations);
  } catch (err) {
    console.error('❌ Error fetching finalizations:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
