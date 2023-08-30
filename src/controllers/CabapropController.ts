import { Request, Response } from "express";

export class CabapropController {
  async index(req: Request, res: Response): Promise<any> {
    try {
        res.status(200).send("Cabaprop Controller.");
    } catch (err) {
        res.status(500).send(err);
    }
  }
}
