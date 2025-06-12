import type { NextApiRequest, NextApiResponse } from 'next';
import { getProvider } from '@/utils/ethers';
import campaignMeta from '@/app/data/campaignMeta.json';
import CampaignABI from '../../../../../blockchain/artifacts/contracts/Campaign.sol/Campaign.json';
import { ethers } from 'ethers';
import type { Log, EventLog } from 'ethers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress } = req.query;

  if (typeof walletAddress !== 'string') {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }

  try {
    const provider = getProvider();

    // 先找到這 user 建立的 campaigns
    const userCampaigns = campaignMeta.filter(c => c.creatorWallet.toLowerCase() === walletAddress.toLowerCase());

    const allContributions = [];

    for (const meta of userCampaigns) {
      const contract = new ethers.Contract(meta.contractAddress, CampaignABI.abi, provider);

      // 直接抓全部 ContributionReceived event
      const events = await contract.queryFilter(
        contract.filters.ContributionReceived(),
        0,
        'latest'
      );

      for (const ev of events) {
        const log = ev as EventLog;
        const block = await provider.getBlock(log.blockNumber);
        const timestamp = block?.timestamp ? new Date(block.timestamp * 1000).toISOString() : new Date().toISOString();

        allContributions.push({
          amount: log.args?.amount.toString(),
          timestamp,
          campaignAddress: meta.contractAddress
        });
      }
    }

    // sort by timestamp asc
    allContributions.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    res.status(200).json(allContributions);
  } catch (error) {
    console.error('❌ Error fetching funds raised:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
