import type { NextApiRequest, NextApiResponse } from 'next';
import { getProvider } from '@/utils/ethers';
import campaignMeta from '@/app/data/campaignMeta.json';
import CampaignABI from '@/utils/abis/Campaign.json';
import { ethers } from 'ethers';
import type { Log, EventLog } from 'ethers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress } = req.query;

  if (typeof walletAddress !== 'string') {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }

  try {
    const provider = getProvider();

    const allFinalizations = [];

    for (const meta of campaignMeta) {
      const contract = new ethers.Contract(meta.contractAddress, CampaignABI.abi, provider);

      // 假設 Finalized event 是這樣定義的：
      // event Finalized(address indexed fundSeekerAddr, uint amount, uint timestamp);

      const events = await contract.queryFilter(
        contract.filters.Finalized(walletAddress),
        0, // from block
        'latest' // to block
      );

      for (const ev of events) {
        const log = ev as EventLog; // 👉 斷言成 EventLog
        const block = await provider.getBlock(log.blockNumber);
        const timestamp = block?.timestamp ? new Date(block.timestamp * 1000).toISOString() : new Date().toISOString();

        allFinalizations.push({
          amount: log.args?.amount.toString(),
          timestamp,
          campaignAddr: meta.contractAddress
        });
      }
    }

    // sort by timestamp asc
    allFinalizations.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    res.status(200).json(allFinalizations);
  } catch (err) {
    console.error('❌ Error fetching finalizations:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
