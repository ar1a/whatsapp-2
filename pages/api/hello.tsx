// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Request, Response } from "express";

export default (req: Request, res: Response) => {
  res.status(200).json({ name: "John Doe" });
};
