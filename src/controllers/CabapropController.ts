import { Request, Response } from "express";
import { CabapropService } from "../services/CabapropService";

export class CabapropController {
  async index(req: Request, res: Response): Promise<any> {
    try {
        res.status(200).send({ message: "Cabaprop API" });
    } catch (err) {
        res.status(500).send(err);
    }
  }
}
