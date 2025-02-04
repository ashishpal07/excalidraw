import { createRoomSchema } from "@repo/common/types"
import { prisma } from "@repo/db/client";
import { Request, Response } from "express";

export const createRoom = async (req: Request, res: Response) => {
  try {
    const parseData = createRoomSchema.safeParse(req.body);
    if (!parseData.success) {
      res.status(411).json({ error: parseData.error });
      return;
    }
    
    const userId = req.user?.user;
    const room = await prisma.room.create({
      data: {
        ...parseData.data,
        adminId: parseInt(userId),
      }
    });

    res.status(201).json({ message: "Room Created.", room: room.id });
    return;
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while ceating room.", error: error });
    return;
  }
}