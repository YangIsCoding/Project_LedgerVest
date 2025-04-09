// pages/api/campaigns/[address].ts
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  if (typeof address !== 'string') {
    return res.status(400).json({ error: 'Invalid address' });
  }

  try {
    const campaign = await prisma.campaign.findFirst({
        where: {
            contractAddress: {
                equals: address,
                mode: 'insensitive' // 👈 這行關鍵，忽略大小寫
            }
        },
      select: {
        title: true,
        description: true,
        targetAmount: true,
        createdAt: true,
        creator: {
          select: {
            contactInfo: true
          }
        }
      },
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    return res.status(200).json({
      title: campaign.title,
      description: campaign.description,
      targetAmount: campaign.targetAmount,
      createdAt: campaign.createdAt,
      contactInfo: campaign.creator.contactInfo
    });
  } catch (err) {
    console.error("❌ Error fetching campaign:", err);
    return res.status(500).json({ error: 'Server error' });
  }
}
