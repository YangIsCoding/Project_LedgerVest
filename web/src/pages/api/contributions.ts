import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';

const dataPath = path.join(process.cwd(), 'src', 'app', 'data', 'contributions.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    txHash,
    contributorAddress,
    campaignAddress,
    amount,
    gasCost,
    note,
    contactInfo = 'N/A',
  } = req.body;

  if (!txHash || !contributorAddress || !campaignAddress || !amount) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    const fileContent = await fs.readFile(dataPath, 'utf-8').catch(() => '[]');
    const contributions = JSON.parse(fileContent);

    const newContribution = {
      id: randomUUID(),
      txHash,
      contributorAddress,
      campaignAddress,
      amount: Number(amount),
      gasCost: gasCost ? Number(gasCost) : 0,
      note: note || null,
      receivedAt: new Date().toISOString(),
    };

    contributions.push(newContribution);

    await fs.writeFile(dataPath, JSON.stringify(contributions, null, 2), 'utf-8');

    return res.status(201).json({ success: true, contribution: newContribution });
  } catch (error) {
    console.error('❌ Failed to save contribution:', error);
    return res.status(500).json({ success: false, error: 'Failed to save contribution' });
  }
}
