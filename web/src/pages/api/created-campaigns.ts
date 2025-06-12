import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { getProvider } from '@/utils/ethers';
import CampaignFactoryABI from '@/app/data/CampaignFactoryABI.json';
import campaignMeta from '@/app/data/campaignMeta.json';
import contractAddresses from '@/utils/abis/contract-address.json';

// ✅ 你的 CampaignFactory 地址
export const CAMPAIGN_FACTORY_ADDRESS = contractAddresses.CampaignFactory;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress } = req.query;

  if (typeof walletAddress !== 'string') {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }

  try {
    const provider = getProvider();

    const factory = new ethers.Contract(
      CAMPAIGN_FACTORY_ADDRESS,
      CampaignFactoryABI,
      provider
    );

    // ✅ 查詢 CampaignCreated event
    const events = await factory.queryFilter(
      factory.filters.CampaignCreated(null, walletAddress),
      0,
      'latest'
    );

    // ✅ async map → await Promise.all
    const campaigns = await Promise.all(events.map(async (ev) => {
      const eventLog = ev as ethers.EventLog;

      const { campaignAddress, creator } = eventLog.args!;

      const block = await provider.getBlock(ev.blockNumber);
      if (!block) throw new Error(`Block ${ev.blockNumber} not found`);

      const meta = campaignMeta.find((m) =>
        m.contractAddress.toLowerCase() === campaignAddress.toLowerCase()
      );

      return {
        contractAddress: campaignAddress,
        creator: creator,
        createdAt: new Date(block.timestamp * 1000).toISOString(),
        title: meta?.title || 'Unknown Campaign',
        description: meta?.description || '',
        targetAmount: meta?.targetAmount || 0
      };
    }));

    // ✅ 排序 createdAt desc
    campaigns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.status(200).json(campaigns);
  } catch (error) {
    console.error('❌ Error fetching created campaigns:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
