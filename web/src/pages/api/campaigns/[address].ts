import { NextApiRequest, NextApiResponse } from 'next';
import campaignMeta from '@/app/data/campaignMeta.json';
import { getCampaignContract } from '@/utils/ethers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  if (typeof address !== 'string') {
    return res.status(400).json({ error: 'Invalid address' });
  }

  try {
    const meta = campaignMeta.find(c => c.contractAddress.toLowerCase() === address.toLowerCase());
    if (!meta) {
      return res.status(404).json({ error: 'Campaign metadata not found' });
    }

    const campaign = await getCampaignContract(address);
    const targetAmount = await campaign.targetAmount();

    return res.status(200).json({
      title: meta.title,
      description: meta.description,
      targetAmount: targetAmount.toString(),
      createdAt: meta.createdAt,
      contactInfo: meta.contactInfo
    });
  } catch (err) {
    console.error("❌ Error fetching campaign:", err);
    return res.status(500).json({ error: 'Server error' });
  }
}
