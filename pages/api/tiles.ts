// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { MosaicTile, prisma, PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<MosaicTile[]>) {
  const prisma = new PrismaClient()
  if (req.method === 'PUT') {
    const body = JSON.parse(req.body)
    const tile = await prisma.mosaicTile.update({
      where: { x_y: { x: body.x, y: body.y } },
      data: { color: body.selectedColor }
    })

    if (!tile.color) {
      return res.status(404)
    }
    const tiles = await prisma.mosaicTile.findMany({})
    res.status(200).json(tiles)
  } else {
    const tiles = await prisma.mosaicTile.findMany({})
    res.status(200).json(tiles)
  }
}
