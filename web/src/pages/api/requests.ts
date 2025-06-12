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

    const events = await contract.queryFilter(
      contract.filters.RequestCreated(),
      0,
      'latest'
    );

    const requests = await Promise.all(events.map(async (ev) => {
      const eventLog = ev as ethers.EventLog; // 顯式斷言
      const block = await provider.getBlock(ev.blockNumber);
      if (!block) throw new Error(`Block ${ev.blockNumber} not found`);

      return {
        id: eventLog.args?.index?.toNumber(), // 你原本是用 id → 用 index 當 id
        reason: eventLog.args?.description,
        amount: eventLog.args?.value?.toString(),
        recipient: eventLog.args?.recipient,
        createdAt: new Date(block.timestamp * 1000).toISOString(),
      };
    }));

    // sort by id ASC
    requests.sort((a, b) => a.id - b.id);

    res.status(200).json(requests);
  } catch (error) {
    console.error('❌ Error fetching requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
}
