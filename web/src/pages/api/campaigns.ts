import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs/promises';

const dataPath = path.join(process.cwd(), 'src', 'app', 'data', 'campaignMeta.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      title,
      description,
      minimumContribution,
      targetAmount,
      walletAddress,
      contractAddress,
    } = req.body;

    try {
      // 讀取目前 campaignMeta.json
      const fileContent = await fs.readFile(dataPath, 'utf-8');
      const campaignMeta = JSON.parse(fileContent);

      // 新增一筆新的 campaign meta
      const newMeta = {
        contractAddress,
        creatorWallet: walletAddress,
        title,
        description,
        targetAmount: parseFloat(targetAmount),
        minimumContribution: parseFloat(minimumContribution),
        createdAt: new Date().toISOString(),
      };

      campaignMeta.push(newMeta);

      // 回寫 json 檔
      await fs.writeFile(dataPath, JSON.stringify(campaignMeta, null, 2), 'utf-8');

      return res.status(201).json({ success: true, campaign: newMeta });
    } catch (err) {
      console.error('❌ Error saving campaign meta:', err);
      return res.status(500).json({ success: false, error: 'Failed to save campaign meta' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
