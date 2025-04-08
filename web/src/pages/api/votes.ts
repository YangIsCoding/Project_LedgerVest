import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { txHash, requestId, voterAddress, gasCost } = req.body;

  // 检查必填字段
  if (!txHash || !requestId || !voterAddress || gasCost === undefined) {
    console.error('❌ Missing or invalid required fields:', {
        txHash,
        requestId,
        voterAddress,
        gasCost,
    });

    if (!txHash) {
        console.error('❌ Missing txHash');
    }
    if (!requestId) {
        console.error('❌ Missing requestId');
    }
    if (!voterAddress) {
        console.error('❌ Missing voterAddress');
    }
    if (gasCost === undefined) {
        console.error('❌ Missing or invalid gasCost');
    }

    return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

  try {
    // 确保用户存在或创建新用户
    await prisma.user.upsert({
      where: { walletAddress: voterAddress },
      update: { lastLogin: new Date() },
      create: {
        id: voterAddress,
        walletAddress: voterAddress,
      },
    });

    // 创建投票记录
    const request = await prisma.request.findUnique({
    where: { id: requestId }
    });

    if (!request) {
        return res.status(404).json({ error: 'Request not found for given requestId' });
    }
    const vote = await prisma.vote.create({
        data: {
        txHash,
        requestId,
        voterAddress,
        gasCost: gasCost ? parseFloat(gasCost) : undefined,
        },
    });

    return res.status(201).json({ success: true, vote });
    } catch (error: any) {
    console.error('❌ Failed to save vote:', error);

    if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Duplicate vote detected' });
    }

    return res.status(500).json({ error: 'Failed to save vote', detail: error.message });
    }
}
