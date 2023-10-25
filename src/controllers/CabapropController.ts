import { Request, Response } from "express";
import { CabapropService } from "../services/CabapropService";

export class CabapropController {
  async index(req: Request, res: Response): Promise<any> {
    try {
      const cabapropService: CabapropService = new CabapropService();
      const result = await cabapropService.get();
      res.status(200).send(result);
    } catch (err) {
      res.status(500).send(err);
    }
  }
}
