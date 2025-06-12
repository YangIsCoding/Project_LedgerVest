import type { NextApiRequest, NextApiResponse } from 'next';
import campaignMeta from '@/app/data/campaignMeta.json';
import { getCampaignContract } from '@/utils/ethers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress } = req.query;

  if (typeof walletAddress !== 'string') {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }

  try {
    // Filter campaigns created by this wallet
    const campaigns = campaignMeta.filter(c => c.creatorWallet.toLowerCase() === walletAddress.toLowerCase());

    const result = await Promise.all(campaigns.map(async c => {
      const campaign = await getCampaignContract(c.contractAddress);
      const targetAmount = await campaign.targetAmount();

      // Finalized amount → 你要看你合約有沒有 totalFinalizedAmount 之類的 function → 假設有：
      let finalizedAmount = 0;
      try {
        finalizedAmount = await campaign.totalFinalizedAmount(); // 如果有 function → call
      } catch {
        finalizedAmount = 0; // fallback
      }

      return {
        title: c.title.length > 12 ? `${c.title.slice(0, 12)}...` : c.title,
        targetAmount: targetAmount.toString(),
        finalizedAmount: finalizedAmount.toString()
      };
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('❌ Error fetching campaign performance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
