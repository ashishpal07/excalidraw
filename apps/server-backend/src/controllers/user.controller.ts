import { prisma } from "@repo/db/client";
import { Request, Response } from "express";
import { createUserSchema, userLoginSchema } from "@repo/common/types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const create = async (req: Request, res: Response) => {
  try {
    const parseData = createUserSchema.safeParse(req.body);
    if (!parseData.success) {
      res.status(411).json({ message: parseData.error });
      return;
    }

    const findUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: parseData.data.email },
          { username: parseData.data.username },
        ],
      },
    });

    if (findUser) {
      res.status(409).json({ message: "Invalid username or email" });
      return;
    }

    const hashedPassword = await bcrypt.hash(parseData.data.password, 10);

    const user = await prisma.user.create({
      data: {
        ...parseData.data,
        password: hashedPassword,
      },
    });

    res
      .status(201)
      .json({ message: "User created successfully.", user: user.id });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while creating user",
      error: error,
    });
    return;
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const parseData = userLoginSchema.safeParse(req.body);
    if (!parseData.success) {
      res.status(411).json({ message: parseData.error });
      return;
    }

    const findUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: parseData.data.email },
          { username: parseData.data.username },
        ],
      },
    });

    if (!findUser) {
      res.status(404).json({ message: "User Not Found." });
      return;
    }

    if (!(await bcrypt.compare(parseData.data.password, findUser.password))) {
      res.status(401).json({ message: "Invalid credentails." });
      return;
    }

    const token = jwt.sign({ user: findUser.id }, "random_jwt_secret", {
      expiresIn: "1d",
    });
    res.status(200).json({ message: "Loggedin Successfully.", token });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while login user.",
      error: error,
    });
    return;
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId || "";
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });

    if (!user) {
      res.status(404).json({ message: "User Not Found." });
      return;
    }

    await prisma.user.delete({
      where: {
        id: parseInt(userId),
      },
    });

    res
      .status(200)
      .json({ message: "User Deleted Successfully", user: userId });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while delete user.",
      error: error,
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId || "";
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });

    res
      .status(200)
      .json({
        message: "Success.",
        user: {
          id: user?.id,
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
        },
      });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while getting user.", error: error });
  }
};
