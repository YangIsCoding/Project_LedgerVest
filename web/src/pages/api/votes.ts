// pages/api/vote.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { getProvider } from '@/utils/ethers';
import CampaignABI from '@/app/data/CampaignABI.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { campaignAddress } = req.query;

  if (!campaignAddress || typeof campaignAddress !== 'string') {
    return res.status(400).json({ error: 'Invalid campaign address' });
  }

  try {
    const provider = getProvider();

    const contract = new ethers.Contract(campaignAddress, CampaignABI, provider);

    // 查 RequestApproved event
    const events = await contract.queryFilter(
      contract.filters.RequestApproved(),
      0,
      'latest'
    );

    // async map 讀 block timestamp
    const votes = await Promise.all(events.map(async (ev) => {
      const eventLog = ev as ethers.EventLog;
      const block = await provider.getBlock(ev.blockNumber);
      if (!block) throw new Error(`Block ${ev.blockNumber} not found`);

      return {
        requestId: eventLog.args?.index?.toNumber(),
        voterAddress: eventLog.args?.approver,
        txHash: ev.transactionHash,
        blockNumber: ev.blockNumber,
        timestamp: new Date(block.timestamp * 1000).toISOString(),
      };
    }));

    // 排序
    votes.sort((a, b) => a.blockNumber - b.blockNumber);

    res.status(200).json(votes);
  } catch (error) {
    console.error('❌ Error fetching votes:', error);
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
}
